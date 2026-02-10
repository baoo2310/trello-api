import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '../utils/validators.js';

const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        board_id: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
        title: Joi.string().required().min(3).max(50).trim().strict()
    })

    try {
        console.log(req.body);
        await correctCondition.validateAsync(req.body, { abortEarly: false });
        return next();
    } catch (error) {
        // console.log(error);
        return next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
        // res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({// For validate data
        //     errors: new Error(error).message
        // }) 
    }
}

const removeOneById = async (req, res, next) => {
    const correctCondition = Joi.object({
        id: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    });

    try {
        await correctCondition.validateAsync(req.body, { abortEarly: false });
        return next();
    } catch (error) {
        return next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message));
    }
};

export const columnValidation = {
    createNew,
    removeOneById
};