import express from 'express';
import StatusCodes from 'http-status-codes';
import { boardsValidation } from '../../validations/boardsValidation.js';
import { boardController } from '../../controllers/boardController.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';

const Router = express.Router();

Router.route('/')
    .get(boardController.getAll)
    .post(authMiddleware.isAuthorized, boardsValidation.createNew, boardController.createNew);

Router.route('/:id')
    .get(authMiddleware.isAuthorized, boardController.getById)
    .put(authMiddleware.isAuthorized, boardController.updateById)
    .delete(authMiddleware.isAuthorized, boardController.deleteById);

export const boardRoutes = Router;