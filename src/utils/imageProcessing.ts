import * as sharp from 'sharp';

/**
 * Processes the profile picture by resizing and cropping it to a 200x200 square, and then converting it to a base64 string.
 * @param {Buffer} inputBuffer - The input image buffer.
 * @returns {Promise<string>} A promise that resolves to the base64 representation of the processed image.
 */
export const processProfilePicture = async (inputBuffer: Buffer): Promise<string> => {
    const resizedImage = await sharp(inputBuffer)
        .resize(200, 200, {
            fit: 'cover',
        })
        .toBuffer();

    return resizedImage.toString('base64');
};
