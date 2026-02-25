import { StatusCodes } from "http-status-codes";
import { userModel } from "../models/userModel.js";
import ApiError from "../utils/ApiError.js";
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { pickUser } from "../utils/formatters.js";
import { WEBSITE_DOMAIN } from "../utils/constant.js";
import { mailProvider } from "../providers/mailProvider.js";
import { JwtProvider } from "../providers/JwtProvider.js";
import { env } from "../config/environment.js";

const createNew = async (reqBody) => {
    try {
        const existUser = await userModel.findOneByEmail(reqBody.email);
        if(existUser) {
            throw new ApiError(StatusCodes.CONFLICT, 'User already exists!');
        }
        // if email is example@email.com will be 'example'
        const nameFromEmail = reqBody.email.split('@')[0];
        const newUser = { 
            email: reqBody.email,
            password: bcryptjs.hashSync(reqBody.password, 8),
            username: nameFromEmail,
            displayName: nameFromEmail,
            verifyToken: uuidv4(),
        }

        const createdUser = await userModel.createNew(newUser);

        const verificationLink = `${WEBSITE_DOMAIN}/account/verification?email=${createdUser.email}&token=${createdUser.verify_token}`;

        const customSubject = 'Trello App: Please verify your email before using our services!';
        const htmlContent = `
            <h3>Here is your verification link: </h3>
            <h3>${verificationLink}</h3>
            <h3>Sincerely, <br/> Trello Author - Ho Gia Bao</h3>
        `

        await mailProvider.sendMail(createdUser.email, customSubject, htmlContent);

        return pickUser(createdUser);

    } catch (error) { throw error; }
}

const verifyAccount = async (reqBody) => {
    try {
        const exitUser = await userModel.findOneByEmail(reqBody.email);
        if(!exitUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!');
        if(exitUser.is_active) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is already active!');
        if(reqBody.token !== exitUser.verify_token) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Token is invalid');
        const updateData = {
            isActive: true,
            verifyToken: null
        }
        const updatedUser = await userModel.updateById(exitUser.id, updateData);
        return pickUser(updatedUser);
    } catch (error) { throw error; }
}

const login = async (reqBody) => {
    try {
        const exitUser = await userModel.findOneByEmail(reqBody.email);
        if(!exitUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found!');
        if(!exitUser.is_active) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!');
        if(!bcryptjs.compareSync(reqBody.password, exitUser.password)){
            throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your email or password is invalid!');
        }

        // If ok -> create token return to FE
        // Info will be sign in JWT token are id and email of user

        const userInfo = { id: exitUser.id, email: exitUser.email };
        // Create access token and refresh token to return FE
        const accessToken = await JwtProvider.generateToken(
            userInfo, 
            env.ACCESS_TOKEN_SECRET_SIGNATURE,
            env.ACCESS_TOKEN_LIFE
        );

        const refreshToken = await JwtProvider.generateToken(
            userInfo, 
            env.REFRESH_TOKEN_SECRET_SIGNATURE,
            env.REFRESH_TOKEN_LIFE
        );

        return { accessToken, refreshToken, ...pickUser(exitUser) };

    } catch (error) { throw error; }
}

const refreshToken = async (clientRefreshToken) => {
    try {
        const refreshTokenDecoded = await JwtProvider.verifyToken(clientRefreshToken, env.REFRESH_TOKEN_SECRET_SIGNATURE);
        const userInfo = {
            id: refreshTokenDecoded.id,
            email: refreshTokenDecoded.email
        };
        const accessToken = await JwtProvider.generateToken(
            userInfo,
            env.ACCESS_TOKEN_SECRET_SIGNATURE,
            env.ACCESS_TOKEN_LIFE
        );
        return { accessToken };
    } catch (error) { throw error; }
}

const update = async(userId, reqBody) => {
    try {
        const exitUser = await userModel.findOneById(userId);
        if(!exitUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found');
        if(!exitUser.is_active) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your account is not active!');
        let updatedUser = {};
        // Change password
        if(reqBody.current_password && reqBody.new_password) {
            if(!bcryptjs.compareSync(reqBody.current_password, exitUser.password)) {
                throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your current password is invalid!');
            }
            updatedUser = await userModel.updateById(exitUser.id, {
                password: bcryptjs.hashSync(reqBody.new_password, 8)
            });
        } 
        else{
            updatedUser = await userModel.updateById(exitUser.id, reqBody);
        }
        return pickUser(updatedUser);
    } catch (error) { throw error }
}

export const userService = {
    createNew,
    verifyAccount,
    login,
    refreshToken,
    update
}