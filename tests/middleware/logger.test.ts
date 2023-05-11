import {Request, Response, NextFunction} from 'express';
import loggerMiddleware from "../../src/middleware/logger";

describe('loggerMiddleware', () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
        mockReq = {
            method: 'GET',
            path: '/test',
        };
        mockRes = {};
        mockNext = jest.fn();
        consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    it('should log the request method and path and call next', () => {
        loggerMiddleware(mockReq as Request, mockRes as Response, mockNext);

        expect(consoleSpy).toHaveBeenCalledWith('Request logged:', 'GET', '/test');
        expect(mockNext).toHaveBeenCalled();
    });
});
