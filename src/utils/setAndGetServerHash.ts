import SessionRequest from "../interfaces/SessionRequest";
import * as crypto from 'crypto';

/**
 * Generates a server hash using a randomly generated server token and the KEYTOKEN environment variable.
 * The server hash is then set to the session object of the provided request.
 *
 * @param {SessionRequest} req - The request object with a session property.
 * @returns {string} serverHash - The generated server hash.
 */
export const setAndGetServerHash = (req: SessionRequest) => {
    const serverToken = crypto.randomBytes(16).toString('hex');

    const serverHash = crypto
        .createHash('sha256')
        .update(process.env.KEYTOKEN + serverToken)
        .digest('hex');

    req.session.serverHash = serverHash;

    return serverHash;
}
