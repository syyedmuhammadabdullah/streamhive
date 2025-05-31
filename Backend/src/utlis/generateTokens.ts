import { Request, Response } from "express";
import ApiError from "./apiError";
import jwt from "jsonwebtoken";
import { UserModel } from "../models";
import crypto from "crypto";


const generateTokens=async (user:any, sessionId:string) => {
    // Generate access token
    const authToken = user.generateAuthToken(sessionId);
    
    // Generate refresh token
    const refreshToken = user.generateRefreshToken(sessionId);

    return {
        authToken,
        refreshToken
    };
}

const updateAuthToken = async (req: Request, res: Response) => {
    // Generate new tokens
    const incomingRefreshToken  = req.cookies.refreshToken;

   if (!incomingRefreshToken) {
    throw new ApiError("Unauthorized", 401, "Refresh token is missing");
   }
  const decoded = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET, (err: any, decoded: any) => {
    if (err) {
        throw new ApiError("Invalid refresh token", 401, err.message);
    }
    return decoded;
})
    
    // Generate new tokens
    const sessionId =crypto.randomBytes(16).toString('hex'); // Generate a random session ID
    const user = await UserModel.findById(decoded.id).catch((error) => {
        throw new ApiError("Failed to find user", 500, `Error: ${error.message}`);
    });
   const userSession = user?.userSession?.find((session => session.sessionId === decoded.sessionId))
    if (!userSession) {
        throw new ApiError("Session not found", 404, "The session associated with the refresh token does not exist");
    }
    userSession.sessionId = sessionId; // Update session ID
    userSession.createdAt = new Date(); // Update session creation time
    // Save the updated user session
    await user?.save().catch((error) => {
        throw new ApiError("Failed to save user session", 500, `Error: ${error.message}`);
    });
    const { authToken, refreshToken } = await generateTokens(user,sessionId);
    // Set new tokens in cookies
    res.cookie("authToken", authToken, {
        httpOnly: false, // Set to true if you want to prevent client-side access
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    }).cookie("refreshToken", refreshToken, {
        httpOnly: false, // Set to true if you want to prevent client-side access
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    
}
export {generateTokens,  updateAuthToken }