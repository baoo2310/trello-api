import Joi from 'joi';
import { randomUUID } from 'crypto';
import { GET_DB } from '../config/db.js';

const COLUMN_COLLECTION_NAME = 'columns';
const COLUMN_COLLECTION_SCHEMA = Joi.object({
    board_id: Joi.string().uuid().required(),
    title: Joi.string().required().min(3).max(50).trim().strict(),
    cardOrderIds: Joi.array().items(Joi.string().uuid()).default([]),
    position: Joi.number().integer().min(0).default(0)
});

const validataBeforeCreate = async (data) => {
    return await COLUMN_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
}

const createNew = async (data) => {
    try {
        const validData = await validataBeforeCreate(data);
        const id = randomUUID();

        const insertQuery = `
            INSERT INTO columns (
                id, board_id, title, card_order_ids, position
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;

        const values = [
            id,
            validData.board_id,
            validData.title,
            validData.cardOrderIds,
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
            SELECT * FROM columns
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
        const cardOrderIds = data.card_order_ids ?? [];
        const query = `
            UPDATE columns
            SET card_order_ids = $1
            WHERE id = $2
            RETURNING *;
        `;
        const result = await GET_DB().query(query, [cardOrderIds, id]);
        return result.rows[0] || null;
    } catch (error) {
        throw new Error(error);
    }
};

const removeOneById = async (id) => {
    try {
        const query = `
            DELETE FROM columns
            WHERE id = $1
            RETURNING *;
        `;
        const result = await GET_DB().query(query, [id]);
        return result.rows[0] || null;
    } catch (error) {
        throw new Error(error);
    }
}

const pushCardOrderIds = async (card) => {
    try {
        const query = `
            UPDATE columns
            SET card_order_ids = array_append(card_order_ids, $1)
            WHERE id = $2
            RETURNING *;
        `
        const values = [card.id, card.column_id];
        const result = await GET_DB().query(query, values);
        return result.rows[0] || null;
    } catch (error) {
        throw new Error(error);
    }
}

const pullCardOrderIds = async (card) => {
    try {
        const query = `
            UPDATE columns
            SET card_order_ids = array_remove(card_order_ids, $1)
            WHERE id = $2
            RETURNING *;
        `
        const values = [card.id, card.column_id];
        const result = await GET_DB().query(query, values);
        return result.rows[0] || null;
    } catch (error) {
        throw new Error(error);
    }
}

export const columnModel = {
    COLUMN_COLLECTION_NAME,
    COLUMN_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    pushCardOrderIds,
    updateById,
    removeOneById,
    pullCardOrderIds
};