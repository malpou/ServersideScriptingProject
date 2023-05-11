import * as crypto from 'crypto';
import SessionRequest from "../../src/interfaces/SessionRequest";
import {setAndGetServerHash} from "../../src/utils/setAndGetServerHash";

jest.mock('crypto');

describe('setAndGetServerHash', () => {
    it('should correctly set and return the server hash', () => {
        // Mock implementation
        const mockRandomBytes = jest.fn().mockReturnValue(Buffer.from('mocked buffer').toString('hex'));
        const mockCreateHash = jest.fn();
        const mockUpdate = jest.fn().mockReturnThis();
        const mockDigest = jest.fn().mockReturnValue('mocked hash');

        (crypto.randomBytes as jest.MockedFunction<typeof crypto.randomBytes>) = mockRandomBytes;
        (crypto.createHash as jest.MockedFunction<typeof crypto.createHash>) = mockCreateHash;
        mockCreateHash.mockReturnValue({update: mockUpdate, digest: mockDigest});

        // Mock request object
        const req: SessionRequest = {session: {}} as SessionRequest;

        // Mock environment variable
        process.env.KEYTOKEN = 'test token';

        // Call the function
        const result = setAndGetServerHash(req);

        // Check that randomBytes was called with the correct argument
        expect(mockRandomBytes).toHaveBeenCalledWith(16);

        // Check that createHash was called with the correct argument
        expect(mockCreateHash).toHaveBeenCalledWith('sha256');

        // Check that update was called with the correct argument
        expect(mockUpdate).toHaveBeenCalledWith('test token' + Buffer.from('mocked buffer').toString('hex'));

        // Check that digest was called with the correct argument
        expect(mockDigest).toHaveBeenCalledWith('hex');

        // Check that the server hash was set on the session object
        expect(req.session.serverHash).toBe('mocked hash');

        // Check that the result is the server hash
        expect(result).toBe('mocked hash');
    });
});
