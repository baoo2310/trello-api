import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import { columnService } from '../services/columnService.js';

const createNew = async (req, res, next) => {
    try {
        const createdColumn = await columnService.createNew(req.body);
        res.status(StatusCodes.CREATED).json(createdColumn);
    } catch (error) { next(error) } 
        // console.log(error);
        // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
        //     errors: error.message
        // }) 
        
};

const updateById = async (req, res, next) => {
  try {
    const updated = await columnService.updateById(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const columnController = {
    createNew,
    updateById
};