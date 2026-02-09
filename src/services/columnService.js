import { boardModel } from "../models/boardModel.js";
import { columnModel } from "../models/columnModel.js";

const createNew = async (reqBody) => {
    try {
        const newColumn = {
            ...reqBody
        }
        const createdColumn = await columnModel.createNew(newColumn);
        const getNewColumn = await columnModel.findOneById(createdColumn.id);

        if(getNewColumn){
            await boardModel.pushColumnOrderIds(getNewColumn);
        }

        return getNewColumn;
    } catch (error) { throw error; }
};

const updateById = async (id, data) => {
  return await columnModel.updateById(id, data);
};

export const columnService = {
    createNew,
    updateById
};