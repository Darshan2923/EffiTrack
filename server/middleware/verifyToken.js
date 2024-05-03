import jwt from 'jsonwebtoken';
import { createError } from '../error.js';

export const verifyToken = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return next(createError(401, "You are not authenticated"))
        }
        // get Token from header
        const token = req.headers.authorization.split(" ")[1];

        // Check if token exists
        if (!token) return next(createError(401, "You are not authenticated"));
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        return next();

    } catch (error) {
        return next(createError(402, error.message));
    }
}