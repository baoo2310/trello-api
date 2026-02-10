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

const removeOneById = async (columnId) => {
    try {
        const deletedColumn = await columnModel.removeOneById(columnId);
        if(!deletedColumn) return null;
        await boardModel.pullColumnOrderIds({
            id: deletedColumn.id,
            board_id: deletedColumn.board_id
        });
        return deletedColumn;
    } catch (error) { throw error; 
    }
}

export const columnService = {
    createNew,
    updateById,
    removeOneById
};