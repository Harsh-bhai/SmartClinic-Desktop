import { customAlphabet } from 'nanoid';

// Numeric only (0–9)
const numericAlphabet = '0123456789';
export const randomNumId = customAlphabet(numericAlphabet, 10);

// Alphanumeric (A–Z, a–z, 0–9)
const alphanumericAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
export const randomAlphaNumId = customAlphabet(alphanumericAlphabet, 10);


