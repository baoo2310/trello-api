import { boardModel } from "../models/boardModel.js";
import { slugify } from "../utils/formatters.js";
import lodash from 'lodash';

const { cloneDeep } = lodash;

const createNew = async (reqBody) => {
    try {
        const newBoard = {
            ...reqBody,
            slug: slugify(reqBody.title)
        }

        const createdBoard = await boardModel.createNew(newBoard);

        return createdBoard;
    } catch (error) { throw error; }
};

const getAll = async () => {
    try {
        return await boardModel.findAll();
    } catch (error) {
        throw error;
    }
};

const getById = async (id) => {
    try {
        const board = await boardModel.findOneById(id);
        if (!board) return null;

        const resBoard = cloneDeep(board);
        if (Array.isArray(resBoard.columns) && Array.isArray(resBoard.cards)) {
            resBoard.columns.forEach((column) => {
                // column.cards = resBoard.cards.filter((card) => card.column_id.equals(column.id));
                column.cards = resBoard.cards.filter((card) => card.column_id.toString() === column.id.toString());
            });
        }

        delete resBoard.cards;

        return resBoard;
    } catch (error) {
        throw error;
    }
};

const updateById = async (id, reqBody) => {
    try {
        const updateData = { ...reqBody };
        if (updateData.title && !updateData.slug) {
            updateData.slug = slugify(updateData.title);
        }
        return await boardModel.updateById(id, updateData);
    } catch (error) {
        throw error;
    }
};

const deleteById = async (id) => {
    try {
        return await boardModel.deleteById(id);
    } catch (error) {
        throw error;
    }
};

export const boardService = {
    createNew,
    getAll,
    getById,
    updateById,
    deleteById
};