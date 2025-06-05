import { CookieOptions, Request, Response } from "express";
import {ApiError,sessionCleanup} from "./index";
import { UserModel } from "../models";
import crypto from "crypto";
import { verifyJwt } from "./verify.jwt";


const generateTokens=async (user:any, sessionId:string) => {
    // Generate access token
    const authToken = user.generateAuthToken(sessionId);
    
    // Generate refresh token
    const refreshToken = user.generateRefreshToken(sessionId);
    // Generate session cleanup token
    const sessionCleanupToken = user.generateSessionCleanupToken(sessionId);
    // password reset token
    const passwordResetToken = user.generatePasswordResetToken(sessionId);
    // 2fa verification token
    const twoFaVerificationToken = user.generate2faVerificationToken(sessionId);

    return {
        authToken,
        refreshToken,
        sessionCleanupToken,
        passwordResetToken,
        twoFaVerificationToken
    };
}
// Define options for cookies
const options:CookieOptions={

        httpOnly: false, // Set to true if you want to prevent client-side access
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",    
}

const updateAuthToken = async (req: Request, res: Response) => {
    // Generate new tokens
    const incomingRefreshToken  = req.cookies.refreshToken;

    // Check if the refresh token is present
   if (!incomingRefreshToken) {
    await sessionCleanup(req, res); // Cleanup session if refresh token is missing
    // If the refresh token is missing, throw an error
    throw new ApiError("Unauthorized", 401, "Refresh token is missing");
   }
    // Verify the refresh token
    const refreshTokenSecret:string = process.env.JWT_REFRESH_SECRET!;
 const decoded:any=await verifyJwt(incomingRefreshToken,refreshTokenSecret)
 .catch(async(err) => {
    // If the token is invalid, cleanup session and throw an error
    await sessionCleanup(req, res); // Cleanup session if refresh token is invalid
    throw new ApiError("Invalid refresh token", 401, err.message); 
 })
    
    // Generate new tokens
    const sessionId:string =crypto.randomBytes(16).toString('hex'); // Generate a random session ID
    const user = await UserModel.findById(decoded?.id).catch((error) => {
        throw new ApiError("Failed to find user", 500, `Error: ${error.message}`);
    });
// Check if user exists
if (!user) {
    throw new ApiError("User not found", 404, "The user associated with the refresh token does not exist");
}
     
  const userSession = user?.userSession?.find((session) => {
  return session.sessionId === decoded.sessionId;
});

   
    if (!userSession) {
        throw new ApiError("Session not found", 404, "The session associated with the refresh token does not exist");
    }
    userSession.sessionId = sessionId; // Update session ID
    userSession.createdAt = new Date(); // Update session creation time
    // Save the updated user session
    await user?.save().catch((error) => {
        throw new ApiError("Failed to save user session", 500, `Error: ${error.message}`);
    });

    // pass the user to request object so that we can access it
    req.user = user;
    // Generate new auth and refresh tokens
    const { authToken, refreshToken, sessionCleanupToken } = await generateTokens(user,sessionId);
    // Set new tokens in cookies
    res.cookie("authToken", authToken,{
       ...options,
        maxAge:60*24* 60 * 1000, // 1 day in milliseconds
    }).cookie("refreshToken", refreshToken, {
       ...options,
       maxAge: 60*7* 24 * 60 * 1000, // 7 day in milliseconds
    })
    .cookie("sessionCleanupToken", sessionCleanupToken, {...options});

    
}
export {generateTokens,  updateAuthToken, options }