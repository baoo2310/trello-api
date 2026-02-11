import Joi from 'joi';
import { randomUUID } from 'crypto';
import { GET_DB } from '../config/db.js';

const CARD_COLLECTION_NAME = 'cards';
const CARD_COLLECTION_SCHEMA = Joi.object({
    board_id: Joi.string().uuid().required(),
    column_id: Joi.string().uuid().required(),
    title: Joi.string().required().min(3).max(50).trim().strict(),
    description: Joi.string().allow(null, '').max(1024).default(null),
    cover: Joi.string().allow(null, '').max(1024).default(null),
    position: Joi.number().integer().min(0).default(0)
});

const validataBeforeCreate = async (data) => {
    return await CARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
}

const createNew = async (data) => {
    try {
        const validData = await validataBeforeCreate(data);
        const id = randomUUID();

        const insertQuery = `
            INSERT INTO cards (
                id, board_id, column_id, title, description, cover, position
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;

        const values = [
            id,
            validData.board_id,
            validData.column_id,
            validData.title,
            validData.description,
            validData.cover,
            validData.position
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
            SELECT * FROM cards
            WHERE id = $1
        `;
        const result = await GET_DB().query(query, [id]);
        return result.rows[0] || null;
    } catch (error) {
        throw new Error(error);
    }
};

const updateById = async (id, data) => {
    try {
        const query = `
            UPDATE cards
            SET column_id = $1
            WHERE id = $2
            RETURNING *;
        `;
        const values = [data.column_id, id];
        const result = await GET_DB().query(query, values);
        return result.rows[0] || null;
    } catch (error) {
        throw new Error(error);
    }
};

const removeOneById = async (id) => {
    try {
        const query = `
            DELETE FROM cards
            WHERE id = $1
            RETURNING *;
        `;
        const result = await GET_DB().query(query, [id]);
        return result.rows[0] || null;
    } catch (error) {
        throw new Error(error);
    }
}

export const cardModel = {
    CARD_COLLECTION_NAME,
    CARD_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    updateById,
    removeOneById
};