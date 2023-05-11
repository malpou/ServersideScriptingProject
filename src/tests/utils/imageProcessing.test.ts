import * as sharp from 'sharp';
import {processProfilePicture} from "../../utils/imageProcessing";

jest.mock('sharp');

describe('processProfilePicture', () => {
    it('should call sharp with the correct arguments', async () => {
        // Mock implementation
        const mockResize = jest.fn().mockReturnThis();
        const mockToBuffer = jest.fn().mockResolvedValue(Buffer.from('mocked buffer'));
        (sharp as jest.Mocked<any>).mockReturnValue({
            resize: mockResize,
            toBuffer: mockToBuffer,
        });

        const inputBuffer = Buffer.from('test buffer');

        // Call the function
        const result = await processProfilePicture(inputBuffer);

        // Check that sharp was called with the input buffer
        expect(sharp).toHaveBeenCalledWith(inputBuffer);

        // Check that resize was called with the correct arguments
        expect(mockResize).toHaveBeenCalledWith(200, 200, {fit: 'cover'});

        // Check that toBuffer was called
        expect(mockToBuffer).toHaveBeenCalled();

        // Check that the result is the expected base64 string
        expect(result).toBe('bW9ja2VkIGJ1ZmZlcg==');
    });
});
