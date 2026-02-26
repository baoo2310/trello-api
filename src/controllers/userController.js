import { StatusCodes } from "http-status-codes";
import { userService } from "../services/userService.js";
import ms from "ms";
import ApiError from "../utils/ApiError.js";

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

const logout = async (req, res, next) => {
    try {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(StatusCodes.OK).json({ loggedOut: true })
    } catch (error) { next(error); }
}

const refreshToken = async (req, res, next) => {
    try {
        const result = await userService.refreshToken(req.cookies?.refreshToken);
        res.cookie(
            'accessToken', 
            result.accessToken, 
            { 
                httpOnly: true, 
                secure: true, 
                samSite: 'none', 
                maxAge: ms('14 days') 
            }
        )
    } catch (error) {
        next(new ApiError(StatusCodes.UNAUTHORIZED, 'Please Sign In!'))
    }
}

const update = async (req, res, next) => {
    try {
        console.log('req.file:', req.file);
        console.log('req.body:', req.body);
        const userId = req.jwtDecoded.id;
        const userAvatarFile = req.file;
        const updatedUser = await userService.update(userId, req.body, userAvatarFile);
        res.status(StatusCodes.OK).json(updatedUser);
    } catch (error) { next(error); }
}

export const userController = {
    createNew,
    verifyAccount,
    login,
    logout,
    refreshToken,
    update
}