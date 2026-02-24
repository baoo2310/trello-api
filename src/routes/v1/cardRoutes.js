import express from 'express';
import { cardValidation } from '../../validations/cardValidation.js';
import { cardController } from '../../controllers/cardController.js';
import { authMiddleware } from '../../middlewares/authMiddleware.js';

const Router = express.Router();

Router.route('/')
    .post(authMiddleware.isAuthorized, cardValidation.createNew, cardController.createNew);
Router.route('/:id')
    .put(authMiddleware.isAuthorized, cardValidation.updateById, cardController.updateCard)
    .delete(authMiddleware.isAuthorized, cardValidation.removeOneById, cardController.deleteCard);

export const cardRoutes = Router;