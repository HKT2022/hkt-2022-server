
import jwt from 'jsonwebtoken';
import { JWT_ACCESS_TOKEN_EXPIRES_IN, JWT_REFRESH_TOKEN_EXPIRES_IN } from '../const';
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from '../secret';

export interface UserAccessToken {
    id: string;
}

export function getUserAccessToken(jwtToken: string) {
    return jwt.verify(jwtToken, JWT_ACCESS_TOKEN_SECRET) as UserAccessToken;
}

export function getUserAccessJwt(userToken: UserAccessToken) {
    const user: UserAccessToken = {
        id: userToken.id
    };
    return jwt.sign(user, JWT_ACCESS_TOKEN_SECRET, { expiresIn: JWT_ACCESS_TOKEN_EXPIRES_IN });
}


export interface UserRefreshToken {
    id: string;
}

export function getUserRefreshToken(jwtToken: string) {
    return jwt.verify(jwtToken, JWT_REFRESH_TOKEN_SECRET) as UserRefreshToken;
}

export function getUserRefreshJwt(userToken: UserRefreshToken) {
    const user: UserRefreshToken = {
        id: userToken.id
    };
    return jwt.sign(user, JWT_REFRESH_TOKEN_SECRET, { expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN });
}


export function getUserJwtById(id: string) {
    return {
        accessToken: getUserAccessJwt({ id }),
        refreshToken: getUserRefreshJwt({ id })
    };
}