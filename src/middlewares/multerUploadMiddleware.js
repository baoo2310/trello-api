import multer from 'multer';
import { ALLOW_COMMON_FILE_TYPES, LIMIT_COMMON_FILE_SIZE } from '../utils/validators.js';
import ApiError from '../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';

const customFileFilter = (req, file, callback) => {
    if(!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)){
        const errMsg = 'File type is invalid. Only accept jpg, jpeg, png.';
        return callback(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errMsg), null);
    }
    return callback(null, true);
}

const upload = multer({
    limits: { fileSize: LIMIT_COMMON_FILE_SIZE },
    fileFilter: customFileFilter
})

export const multerUploadMiddleware = {
    upload
}