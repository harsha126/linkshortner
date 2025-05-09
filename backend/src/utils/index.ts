import jwt from "jsonwebtoken";
import { UserDetailsDTO } from "../dtos/User";

export const genRandString = (length: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        result += chars[randomIndex];
    }
    return result;
}

export function signAccessToken(user: Partial<UserDetailsDTO>) {
    if (!process.env.ACCESS_TOKEN_SECRET || !process.env.ACCESS_TOKEN_EXPIRES_IN) {
        throw new Error("Environment variables ACCESS_TOKEN_SECRET and ACCESS_TOKEN_EXPIRES_IN must be defined");
    }

    return jwt.sign(
        { sub: user.id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        {
            algorithm: "HS256",
            expiresIn: parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN, 10)
        }
    );
}