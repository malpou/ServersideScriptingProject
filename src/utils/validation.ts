/**
 * Utility function to check if an email address is valid.
 * @param {string} email - The email address to check.
 * @returns {boolean} - True if the email is valid, false otherwise.
 */
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return emailRegex.test(email);
};