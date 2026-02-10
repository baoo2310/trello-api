import Joi from 'joi';
import { randomUUID } from 'crypto';
import { GET_DB } from '../config/db.js';
import { BOARD_TYPES } from '../utils/constant.js';

const BOARD_COLLECTION_NAME = 'boards';
const BOARD_COLLECTION_SCHEMA = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict(),
    slug: Joi.string().required().min(3).max(50).trim().strict(),
    description: Joi.string().required().min(3).max(256).trim().strict(),
    type: Joi.string().valid(BOARD_TYPES.PRIVATE, BOARD_TYPES.PUBLIC).required(),
    ownerIds: Joi.array().items(Joi.string().uuid()).default([]),
    memberIds: Joi.array().items(Joi.string().uuid()).default([]),
    columnOrderIds: Joi.array().items(Joi.string().uuid()).default([]),
    _destroy: Joi.boolean().default(false)
});

const BOARD_UPDATE_SCHEMA = BOARD_COLLECTION_SCHEMA.fork(
    ['title', 'slug', 'description', 'type', 'ownerIds', 'memberIds', 'columnOrderIds', '_destroy'],
    (schema) => schema.optional()
);

const validataBeforeCreate = async (data) => {
    return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
}

const createNew = async (data) => {
    try {
        
        const validData = await validataBeforeCreate(data);
        const id = randomUUID();

        const insertQuery = `
            INSERT INTO boards (
                id, title, slug, description, type, owner_ids, member_ids, column_order_ids, _destroy
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *;
        `;

        const values = [
            id,
            validData.title,
            validData.slug,
            validData.description,
            validData.type,
            validData.ownerIds,
            validData.memberIds,
            validData.columnOrderIds,
            validData._destroy
        ];

        const result = await GET_DB().query(insertQuery, values);
        return result.rows[0];
    } catch (error) {
        throw new Error(error);
    }
};

const findOneById = async (id) => {
    try {
        const query = `
            SELECT
                b.*,
                COALESCE(
                    (
                        SELECT json_agg(c ORDER BY c.position)
                        FROM columns c
                        WHERE c.board_id = b.id
                    ),
                    '[]'::json
                ) AS columns,
                COALESCE(
                    (
                        SELECT json_agg(cd ORDER BY cd.position)
                        FROM cards cd
                        WHERE cd.board_id = b.id
                    ),
                    '[]'::json
                ) AS cards
            FROM boards b
            WHERE b.id = $1 AND b._destroy = FALSE
        `;
        const result = await GET_DB().query(query, [id]);
        return result.rows[0] || null;
    } catch (error) {
        throw new Error(error);
    }
};

const findAll = async () => {
    try {
        const query = `
            SELECT * FROM boards
            WHERE _destroy = FALSE
            ORDER BY created_at DESC
        `;
        const result = await GET_DB().query(query);
        return result.rows;
    } catch (error) {
        throw new Error(error);
    }
};

const updateById = async (id, data) => {
    try {
        const validData = await BOARD_UPDATE_SCHEMA.validateAsync(data, { abortEarly: false });
        const fieldMap = {
            title: 'title',
            slug: 'slug',
            description: 'description',
            type: 'type',
            ownerIds: 'owner_ids',
            memberIds: 'member_ids',
            columnOrderIds: 'column_order_ids',
            _destroy: '_destroy'
        };

        const setClauses = [];
        const values = [];
        let index = 1;

        for (const [key, column] of Object.entries(fieldMap)) {
            if (Object.prototype.hasOwnProperty.call(validData, key)) {
                setClauses.push(`${column} = $${index}`);
                values.push(validData[key]);
                index += 1;
            }
        }

        if (setClauses.length === 0) return null;

        setClauses.push('updated_at = NOW()');
        values.push(id);

        const query = `
            UPDATE boards
            SET ${setClauses.join(', ')}
            WHERE id = $${index} AND _destroy = FALSE
            RETURNING *;
        `;

        const result = await GET_DB().query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new Error(error);
    }
};

const deleteById = async (id) => {
    try {
        const query = `
            UPDATE boards
            SET _destroy = TRUE, updated_at = NOW()
            WHERE id = $1 AND _destroy = FALSE
            RETURNING *;
        `;
        const result = await GET_DB().query(query, [id]);
        return result.rows[0];
    } catch (error) {
        throw new Error(error);
    }
};

const pushColumnOrderIds = async (column) => {
    try {
        const query = `
            UPDATE boards
            SET column_order_ids = array_append(column_order_ids, $1),
                updated_at = NOW()
            WHERE id = $2 AND _destroy = FALSE
            RETURNING *;
        `
        const values = [column.id, column.board_id];
        const result = await GET_DB().query(query, values);
        return result.rows[0] || null;
    } catch (error) {
        throw new Error(error);
    }
}

const pullColumnOrderIds = async (column) => {
    try {
        const query = `
            UPDATE boards
            SET column_order_ids = array_remove(column_order_ids, $1)
            WHERE id = $2
            RETURNING *;
        `
        const values = [column.id, column.board_id];
        const result = await GET_DB().query(query, values);
        return result.rows[0] || null;
    } catch (error) {
        throw new Error(error);
    }
}

export const boardModel = {
    BOARD_COLLECTION_NAME,
    BOARD_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    findAll,
    updateById,
    deleteById,
    pushColumnOrderIds,
    pullColumnOrderIds
};