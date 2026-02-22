import nodemailer from 'nodemailer';
import { env } from '../config/environment.js';
import ApiError from '../utils/ApiError.js';
import { StatusCodes } from 'http-status-codes';

const transporter = nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    secure: false,
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    }
});

const sendMail = async(to, subject, htmlContent) => {
    try {
        const mailOptions = {
            from: `"Trello App" <${env.EMAIL_USER}>`, // Sender address
            to: to,
            subject: subject,
            html: htmlContent,
        }

        const info = await transporter.sendMail(mailOptions);
        return info;

    } catch (error) {
        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to send verification email.');
    }
};

export const mailProvider = {
    sendMail
};