import {isValidEmail} from "../../utils/validation";

describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
        expect(isValidEmail('test@example.com')).toBe(true);
        expect(isValidEmail('firstname.lastname@example.co.uk')).toBe(true);
        expect(isValidEmail('12345@example.com')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
        expect(isValidEmail('test@.com')).toBe(false);
        expect(isValidEmail('test@example')).toBe(false);
        expect(isValidEmail('test@example..com')).toBe(false);
        expect(isValidEmail('test@@example.com')).toBe(false);
        expect(isValidEmail('test')).toBe(false);
        expect(isValidEmail('test@')).toBe(false);
        expect(isValidEmail('test.com')).toBe(false);
    });

    it('should return false for email addresses with invalid characters', () => {
        expect(isValidEmail('test@exa$mple.com')).toBe(false);
        expect(isValidEmail('test@exa#mple.com')).toBe(false);
        expect(isValidEmail('test@exa%mple.com')).toBe(false);
        expect(isValidEmail('test@exa^mple.com')).toBe(false);
        expect(isValidEmail('test@exa&mple.com')).toBe(false);
        expect(isValidEmail('test@exa*mple.com')).toBe(false);
    });

    it('should return false for email addresses with leading or trailing spaces', () => {
        expect(isValidEmail(' test@example.com')).toBe(false);
        expect(isValidEmail('test@example.com ')).toBe(false);
    });
});
