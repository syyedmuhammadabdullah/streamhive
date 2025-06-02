import { ApiError,ApiResponse,getDeviceInfo,generateTokens,options } from "../../utlis";
import { Request, Response } from "express";
import { UserModel } from "../../models";
import loginUserSchema from "../../validation/user.login.validation";
import crypto from "crypto";

const userLoginController = async (req: Request, res: Response) => {
    const deviceInfo = getDeviceInfo(req);
    
    // Validate the request body against the schema
    const {success, data, error} = loginUserSchema.safeParse(req.body);
    
    // Check if the validation was successful
    if (!success) {
        const errorMessage = error.errors.map(err => err.message).join(', ')
        // If validation fails, throw an ApiError with the validation error message
        throw new ApiError("validation error",400, errorMessage);
    }
    // If validation passes, proceed to find the user
    const user = await UserModel.findOne({email: data.email})
    // Check if the user exists
    if (!user) {
        throw new ApiError("User not found", 404, "The user does not exist");
    }
    // Check if the password is correct
    const isPasswordValid = await user.comparePassword(data.password);
    if (!isPasswordValid) {
        throw new ApiError("Invalid credentials", 401, "The password is incorrect");
    }
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
    .cookie("authToken", authToken, {
        ...options,
        maxAge: 0.5 * 60 * 1000, // 1 day in milliseconds
    })
    .cookie("refreshToken", refreshToken, {
        ...options,
        maxAge: 1 * 60 * 1000, // 1 day in milliseconds
    })
    .cookie("sessionCleanupToken", sessionCleanupToken, {...options})
    .json(new ApiResponse('Login successful', user, 200));

    }
export default userLoginController;
// This code defines a user login controller for an Express.js application.