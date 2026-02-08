import express from 'express';
import StatusCodes from 'http-status-codes';
import { boardsValidation } from '../../validations/boardsValidation.js';
import { boardController } from '../../controllers/boardController.js';

const Router = express.Router();

Router.route('/')
    .get(boardController.getAll)
    .post(boardsValidation.createNew, boardController.createNew);

Router.route('/:id')
    .get(boardController.getById)
    .put(boardController.updateById)
    .delete(boardController.deleteById);

export const boardRoutes = Router;