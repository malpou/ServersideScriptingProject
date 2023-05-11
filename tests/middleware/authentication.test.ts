import {Response, NextFunction} from 'express';
import SessionRequest from "../../src/interfaces/SessionRequest";
import authenticationMiddleware from "../../src/middleware/authentication";

describe('authenticationMiddleware', () => {
    let mockReq: SessionRequest;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;
    let statusSpy: jest.SpyInstance;
    let sendSpy: jest.SpyInstance;

    beforeEach(() => {
        // Reset the mock objects before each test
        mockReq = {
            session: {},
            body: {},
        } as SessionRequest;
        mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        mockNext = jest.fn();
        statusSpy = jest.spyOn(mockRes, 'status');
        sendSpy = jest.spyOn(mockRes, 'send');
    });

    it('should call next when the client hash matches the session hash', () => {
        // Setup
        mockReq.session.serverHash = 'hash1';
        mockReq.body.key = 'hash1';

        // Act
        authenticationMiddleware(mockReq, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).toHaveBeenCalled();
        expect(statusSpy).not.toHaveBeenCalled();
        expect(sendSpy).not.toHaveBeenCalled();
    });

    it('should return 401 when the client hash does not match the session hash', () => {
        // Setup
        mockReq.session.serverHash = 'hash1';
        mockReq.body.key = 'hash2';

        // Act
        authenticationMiddleware(mockReq, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).not.toHaveBeenCalled();
        expect(statusSpy).toHaveBeenCalledWith(401);
        expect(sendSpy).toHaveBeenCalledWith('Unauthorized: Invalid KEY');
    });

    it('should return 401 when the client hash or session hash is missing', () => {
        // Setup - no client hash
        mockReq.session.serverHash = 'hash1';

        // Act
        authenticationMiddleware(mockReq, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).not.toHaveBeenCalled();
        expect(statusSpy).toHaveBeenCalledWith(401);
        expect(sendSpy).toHaveBeenCalledWith('Unauthorized: Missing KEY or session hash');

        // Reset
        mockReq.body.key = 'hash1';
        delete mockReq.session.serverHash;

        // Act
        authenticationMiddleware(mockReq, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).not.toHaveBeenCalled();
        expect(statusSpy).toHaveBeenCalledWith(401);
        expect(sendSpy).toHaveBeenCalledWith('Unauthorized: Missing KEY or session hash');
    });
});
