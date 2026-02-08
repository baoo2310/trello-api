import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError';

const createNew = async (req, res, next) => {
    try {
        res.status(StatusCodes.OK).json({ message: 'POST from controller. Note: API get list boards' });
    } catch (error) { next(error) } 
        // console.log(error);
        // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
        //     errors: error.message
        // }) 
    
}

export const boardController = {
    createNew,
};