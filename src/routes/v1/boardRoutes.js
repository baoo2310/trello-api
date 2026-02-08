import express from 'express';
import StatusCodes from 'http-status-codes';
import { boardsValidation } from '../../validations/boardsValidation.js';
import { boardController } from '../../controllers/boardController.js';

const Router = express.Router();

Router.route('/')
    .get((req, res) => {
        res.status(StatusCodes.OK).json({ message: 'POST from validation. Note: API get list boards' });
    })
    .post(boardsValidation.createNew, boardController.createNew);

export const boardRoutes = Router;