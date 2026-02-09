import express from 'express';
import StatusCodes from 'http-status-codes';
import { boardRoutes } from './boardRoutes.js';
import { columnRoutes } from './columnRoutes.js';
import { cardRoutes } from './cardRoutes.js';

const Router = express.Router();

Router.get('/status', (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use.' });
});

Router.use('/boards', boardRoutes);
Router.use('/columns', columnRoutes);
Router.use('/cards', cardRoutes);

export const APIs_V1 = Router;