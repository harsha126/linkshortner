import { NextFunction, Response } from "express";
import { AuthRequest } from ".";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

export const AuthMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) res.status(401).json();

    const token = auth.split(" ")[1];
    try {
        const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
        req.user = { userId: new mongoose.Types.ObjectId((payload as JwtPayload).sub), name: '', email: '' }; // Ensure req.user is properly initialized
        next();
    } catch {
        res.status(401).json();
    }
};