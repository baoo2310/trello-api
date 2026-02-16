import express from 'express';
import { userValidation } from '../../validations/userValidation.js';
import { userController } from '../../controllers/userController.js';


const Router = express.Router();

Router.get('/ping', (req, res) => res.json({ ok: true }));

Router.route('/register')
    .post(userValidation.createNew, userController.createNew);

export const userRoutes = Router;