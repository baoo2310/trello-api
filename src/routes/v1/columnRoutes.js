import express from 'express';
import { columnValidation } from '../../validations/columnValidation.js';
import { columnController } from '../../controllers/columnController.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';

const Router = express.Router();

Router.route('/')
    .post(authMiddleware.isAuthorized, columnValidation.createNew, columnController.createNew)

Router.route('/:id')
    .put(authMiddleware.isAuthorized, columnController.updateById)
    .delete(authMiddleware.isAuthorized, columnValidation.removeOneById, columnController.deleteColumnById)

export const columnRoutes = Router;