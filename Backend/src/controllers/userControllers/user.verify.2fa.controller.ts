import { UserModel } from "../../models";
import { ApiError, ApiResponse } from "../../utlis";
import { Request, Response } from "express";
import { z } from "zod";
import {verifyTOTP,generateTokens,options,updateAuthToken,getDeviceInfo } from "../../utlis";
import crypto from "crypto";
import Jwt from "jsonwebtoken";

const userVerify2faSchema = z.object({
    email: z.string().email(),
    otp: z.string().min(6, "OTP must be at least 4 characters long"),
});

const userVerify2faController = async (req: Request, res: Response) => {
    const twoFaVerificationToken = req.cookies.twoFaVerificationToken;
    // Check if the twoFaVerificationToken is present
    if (!twoFaVerificationToken) {
        throw new ApiError("Unauthorized", 401, "Two-factor authentication verification token is missing");
    }
    // Verify the twoFaVerificationToken
    const decoded: any = await Jwt.verify(twoFaVerificationToken, process.env.JWT_2FA_SECRET!, (err: any, decoded: any) => {
        if (err) {
            throw new ApiError("Unauthorized", 401, "Two-factor authentication verification token is invalid");
        }
        return decoded;
    });
    if (!decoded) {
        throw new ApiError("Unauthorized", 401, "Two-factor authentication verification token is invalid");
    }
    if (decoded.action !== "login step completed" && decoded.is2faEnabled) {
        throw new ApiError("Unauthorized", 401, "Two-factor authentication verification token is not valid for this action");
        
    }
   
    // Validate the request body against the schema
    const { data, error, success } = userVerify2faSchema.safeParse(req.body);
    if (!success) {
        throw new ApiError("Validation error", 400, error);
    }
    const { email, otp } = data;
    // Check if the user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new ApiError("User not found", 404, "The user does not exist");
    }
    // 
    if (decoded.email !== email) {
  throw new ApiError("Unauthorized", 401, "Email mismatch");
}
    // Check if the user has 2FA enabled
    if (!user.totpSecret) {
        throw new ApiError("2FA not enabled", 400, "Two-factor authentication is not enabled for this user");
    }
    // Verify the TOTP
    const isValid = verifyTOTP(otp, user.totpSecret);
    if (!isValid) {
        throw new ApiError("Invalid OTP", 400, "The provided OTP is invalid");
    }
    if (!user.is2faEnabled) {
       // If the OTP is valid, update the user's 2FA status
    user.is2faEnabled = true; // Enable 2FA for the user
    await user.save();
    res.status(200).json(new ApiResponse("2FA enabled successfully", user, 200));
    
    }
    // Get device information from the request
    const deviceInfo = getDeviceInfo(req);

     const sessionId = crypto.randomBytes(16).toString('hex'); // Generate a random session ID
       // Create a session object with the device information
       const userSession={
           sessionId: sessionId,
           os: deviceInfo.os.name + " " + deviceInfo.os.version,
           ipAddress: deviceInfo.ip,
           userAgent: deviceInfo.ua,
           createdAt: new Date(),
       };  
      
       // Add the user session to the user's sessions array
       user.userSession.push(userSession);
       // Save the updated user
       await user.save().catch((error) => {
           throw new ApiError("Failed to save user session", 500,error.message);
       });
       // Generate new tokens
       const {authToken, refreshToken, sessionCleanupToken} = await generateTokens(user, sessionId);
       // Send the tokens in the response
       res.status(200)
       .clearCookie("twoFaVerificationToken")
       .cookie("authToken", authToken, {
           ...options,
           maxAge:24 * 60 * 60 * 1000, // 1 day in milliseconds
       })
       .cookie("refreshToken", refreshToken, {
           ...options,
           maxAge:7*24* 60 * 60 * 1000, // 7 day in milliseconds
       })
       .cookie("sessionCleanupToken", sessionCleanupToken, {...options})
       .json(new ApiResponse('Login successful', user, 200));
};

export default userVerify2faController;