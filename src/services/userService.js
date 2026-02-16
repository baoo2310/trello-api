import { StatusCodes } from "http-status-codes";
import { userModel } from "../models/userModel.js";
import ApiError from "../utils/ApiError.js";
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { pickUser } from "../utils/formatters.js";

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
        return pickUser(createdUser);

    } catch (error) { throw error; }
}

export const userService = {
    createNew
}