import { StatusCodes } from "http-status-codes";
import { userService } from "../services/userService.js";
import ms from "ms";

const createNew = async (req, res, next) => {
    try {
        const newUser = await userService.createNew(req.body);
        res.status(StatusCodes.CREATED).json(newUser);
    } catch (error) { next(error); }
};

const verifyAccount = async(req, res, next) => { 
    try {
        const result = await userService.verifyAccount(req.body);
        res.status(StatusCodes.OK).json(result);
    } catch (error) { next(error); }
}

const login = async (req, res, next) => {
    try {
        const result = await userService.login(req.body);

        // handle return http only cookie for client
        res.cookie('accessToken', result.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: ms('14 days')
        });

        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: ms('14 days')
        });

        res.status(StatusCodes.OK).json(result);
    } catch (error) { next(error); }
}

export const userController = {
    createNew,
    verifyAccount,
    login
}