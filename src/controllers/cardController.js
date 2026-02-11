import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import { cardService } from '../services/cardService.js';

const createNew = async (req, res, next) => {
    try {
        const createdCard = await cardService.createNew(req.body);
        res.status(StatusCodes.CREATED).json(createdCard);
    } catch (error) { next(error) } 
        // console.log(error);
        // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
        //     errors: error.message
        // }) 
        
};

const deleteCard = async (req, res, next) => {
    try {
        const deletedCard = await cardService.removeOneById(req.params.id);
        res.status(StatusCodes.OK).json(deletedCard);
    } catch (error) { next(error) } 
        // console.log(error);
        // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
        //     errors: error.message
        // }) 
};

const updateCard = async (req, res, next) => {
    try {
        const updatedCard = await cardService.updateById(req.params.id, req.body);
        res.status(StatusCodes.OK).json(updatedCard);
    } catch (error) { next(error) } 
};

export const cardController = {
    createNew,
    deleteCard,
    updateCard
};