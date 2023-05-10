import {NextFunction, Response} from 'express';
import SessionRequest from "../interfaces/SessionRequest";

/**
 * Authentication middleware to check if requests have a valid KEY.
 * This middleware compares the client-provided hash (KEY) with the server-stored hash in the session.
 * If they don't match or any of them is missing, the request is considered unauthorized.
 *
 * @param {SessionRequest} req - The incoming request with the session object.
 * @param {Response} res - The outgoing Express response.
 * @param {NextFunction} next - The next function in the Express middleware chain.
 */
const authenticationMiddleware = (req: SessionRequest, res: Response, next: NextFunction) => {
    const clientHash = req.body.key;

    if (!clientHash || !req.session.serverHash) {
        res.status(401).send('Unauthorized: Missing KEY or session hash');
        return;
    }

    if (clientHash !== req.session.serverHash) {
        res.status(401).send('Unauthorized: Invalid KEY');
        return;
    }

    next();
};

export default authenticationMiddleware;
