

export const PORT = 3000;
export const CLIENT_ADDR = '';

export const EMAIL_VERIFY_TIMEOUT = 30 * 60 * 1000;
export const EMAIL_TOKEN_TIMEOUT = 10 * 60 * 1000;

export const DEVELOPMENT = process.env.NODE_ENV === 'development' ? true : false;

export const JWT_EMAIL_TOKEN_EXPIRES_IN = '30m';
export const JWT_REFRESH_TOKEN_EXPIRES_IN = '6d';
export const JWT_ACCESS_TOKEN_EXPIRES_IN = '6h';