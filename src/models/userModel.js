import Joi from 'joi';
import { randomUUID } from 'crypto';
import { GET_DB } from '../config/db.js';
import { EMAIL_RULE, EMAIL_RULE_MESSAGE } from '../utils/validators.js';

const USER_ROLES = {
    CLIENT: 'client',
    ADMIN: 'admin'
};

const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
    email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    password: Joi.string().required(),
    username: Joi.string().required().trim().strict(),
    displayName: Joi.string().required().trim().strict(),
    avatar: Joi.string().default(null),
    role: Joi.string().valid(USER_ROLES.CLIENT, USER_ROLES.ADMIN).default(USER_ROLES.CLIENT),

    isActive: Joi.boolean().default(false),
    verifyToken: Joi.string(),

    createdAt: Joi.date().timestamp('javascript').default(Date.now),
    updatedAt: Joi.date().timestamp('javascript').default(null),
    _destroy: Joi.boolean().default(false),
});

const INVALID_UPDATE_FIELDS = ['id', 'email', 'username', 'createdAt', 'updatedAt'];

const USER_UPDATE_SCHEMA = USER_COLLECTION_SCHEMA.fork(
    ['password', 'displayName', 'avatar', 'role', 'isActive', 'verifyToken', '_destroy'],
    (schema) => schema.optional()
);

const validataBeforeCreate = async (data) => {
    return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createNew = async (data) => {
    try {
        const validData = await validataBeforeCreate(data);
        const id = randomUUID();

        const insertQuery = `
            INSERT INTO users (
                id, email, password, username, display_name, avatar, role, is_active, verify_token, _destroy
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *;
        `;

        const values = [
            id,
            validData.email,
            validData.password,
            validData.username,
            validData.displayName,
            validData.avatar,
            validData.role,
            validData.isActive,
            validData.verifyToken,
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
            SELECT * FROM users
            WHERE id = $1 AND _destroy = FALSE
        `;
        const result = await GET_DB().query(query, [id]);
        return result.rows[0] || null;
    } catch (error) {
        throw new Error(error);
    }
};

const findOneByEmail = async (email) => {
    try {
        const query = `
            SELECT * FROM users
            WHERE email = $1 AND _destroy = FALSE
        `;
        const result = await GET_DB().query(query, [email]);
        return result.rows[0] || null;
    } catch (error) {
        throw new Error(error);
    }
};

const findAll = async () => {
    try {
        const query = `
            SELECT * FROM users
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
        const updateData = { ...data };
        INVALID_UPDATE_FIELDS.forEach((field) => delete updateData[field]);

        const validData = await USER_UPDATE_SCHEMA.validateAsync(updateData, { abortEarly: false });
        const fieldMap = {
            password: 'password',
            displayName: 'display_name',
            avatar: 'avatar',
            role: 'role',
            isActive: 'is_active',
            verifyToken: 'verify_token',
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
            UPDATE users
            SET ${setClauses.join(', ')}
            WHERE id = $${index} AND _destroy = FALSE
            RETURNING *;
        `;

        const result = await GET_DB().query(query, values);
        return result.rows[0] || null;
    } catch (error) {
        throw new Error(error);
    }
};

const deleteById = async (id) => {
    try {
        const query = `
            UPDATE users
            SET _destroy = TRUE, updated_at = NOW()
            WHERE id = $1 AND _destroy = FALSE
            RETURNING *;
        `;
        const result = await GET_DB().query(query, [id]);
        return result.rows[0] || null;
    } catch (error) {
        throw new Error(error);
    }
};

export const userModel = {
    USER_COLLECTION_NAME,
    USER_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    findOneByEmail,
    findAll,
    updateById,
    deleteById
};