import express from 'express';
import { cardValidation } from '../../validations/cardValidation.js';
import { cardController } from '../../controllers/cardController.js';

const Router = express.Router();

Router.route('/')
    .post(cardValidation.createNew, cardController.createNew);
Router.route('/:id')
    .put(cardValidation.updateById, cardController.updateCard)
    .delete(cardValidation.removeOneById, cardController.deleteCard);

export const cardRoutes = Router;