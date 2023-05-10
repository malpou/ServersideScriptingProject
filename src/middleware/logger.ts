import { NextFunction, Request, Response } from 'express';

/**
 * Middleware function for logging requests to the console.
 * @param {Request} req - The incoming request object.
 * @param {Response} resp - The outgoing response object.
 * @param {NextFunction} next - The next function in the middleware chain.
 */
const loggerMiddleware = (req: Request, resp: Response, next: NextFunction) => {
    console.log('Request logged:', req.method, req.path);
    next();
};

export default loggerMiddleware;
