import { cardModel } from "../models/cardModel.js";
import { columnModel } from "../models/columnModel.js";

const createNew = async (reqBody) => {
    try {
        const newCard = {
            ...reqBody
        }
        const createdCard = await cardModel.createNew(newCard);
        const getNewCard = await cardModel.findOneById(createdCard.id);

        if(getNewCard){
            await columnModel.pushCardOrderIds(getNewCard);
        }

        return getNewCard;
    } catch (error) { throw error; }
};

const removeOneById = async (cardId) => {
    try {
        const deletedCard = await cardModel.removeOneById(cardId);
        if(!deletedCard) return null;
        await columnModel.pullCardOrderIds({
            id: deletedCard.id,
            column_id: deletedCard.column_id
        });
        return deletedCard;
    } catch (error) { throw error; 
    }
}

export const cardService = {
    createNew,
    removeOneById
};