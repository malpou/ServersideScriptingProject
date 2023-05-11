import {Request, Response, NextFunction} from 'express';
import errorHandler from "../../src/middleware/error";

describe('errorHandler', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;
    let statusSpy: jest.SpyInstance;
    let sendSpy: jest.SpyInstance;
    let consoleSpy: jest.SpyInstance;
    const error = new Error('Test error');

    beforeEach(() => {
        mockReq = {};
        mockRes = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        mockNext = jest.fn();
        statusSpy = jest.spyOn(mockRes, 'status');
        sendSpy = jest.spyOn(mockRes, 'send');
        consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    it('should log the error stack, return status 400 and send the error message', () => {
        errorHandler(error, mockReq as Request, mockRes as Response, mockNext);

        expect(consoleSpy).toHaveBeenCalledWith(error.stack);
        expect(statusSpy).toHaveBeenCalledWith(400);
        expect(sendSpy).toHaveBeenCalledWith(error.message);
        expect(mockNext).not.toHaveBeenCalled();
    });
});
