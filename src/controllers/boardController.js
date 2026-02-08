import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import { boardService } from '../services/boardService.js';

const createNew = async (req, res, next) => {
    try {
        const createdBoard = await boardService.createNew(req.body);
        res.status(StatusCodes.CREATED).json(createdBoard);
    } catch (error) { next(error) } 
        // console.log(error);
        // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
        //     errors: error.message
        // }) 
        
};

const getAll = async (req, res, next) => {
    try {
        const boards = await boardService.getAll();
        res.status(StatusCodes.OK).json(boards);
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const board = await boardService.getById(req.params.id);
        if (!board) return next(new ApiError(StatusCodes.NOT_FOUND, 'Board not found'));
        res.status(StatusCodes.OK).json(board);
    } catch (error) {
        next(error);
    }
};

const updateById = async (req, res, next) => {
    try {
        const updatedBoard = await boardService.updateById(req.params.id, req.body);
        if (!updatedBoard) {
            return next(new ApiError(StatusCodes.BAD_REQUEST, 'No valid fields to update'));
        }
        res.status(StatusCodes.OK).json(updatedBoard);
    } catch (error) {
        next(error);
    }
};

const deleteById = async (req, res, next) => {
    try {
        const deletedBoard = await boardService.deleteById(req.params.id);
        if (!deletedBoard) return next(new ApiError(StatusCodes.NOT_FOUND, 'Board not found'));
        res.status(StatusCodes.OK).json(deletedBoard);
    } catch (error) {
        next(error);
    }
};

export const boardController = {
    createNew,
    getAll,
    getById,
    updateById,
    deleteById
};