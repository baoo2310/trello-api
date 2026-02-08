import { boardModel } from "../models/boardModel.js";
import { slugify } from "../utils/formatters.js";

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
        return await boardModel.findOneById(id);
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