import {ErrorRequestHandler} from 'express';

/**
 * errorHandler is a middleware function for handling errors in the Express.js application.
 * The function logs the error stack trace to the console and sends a 400 status code response
 * with the error message to the client.
 *
 * @param {Error} err - The error that occurred.
 * @param {Request} req - The Express.js request object.
 * @param {Response} res - The Express.js response object.
 * @param {NextFunction} _ - A callback function to pass control to the next middleware.
 */
const errorHandler: ErrorRequestHandler = (err, req, res, _) => {
    console.error(err.stack);
    res.status(400).send(err.message);
};

export default errorHandler;