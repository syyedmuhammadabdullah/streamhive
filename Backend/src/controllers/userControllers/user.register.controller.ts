import {ApiError,ApiResponse,getDeviceInfo,generateTokens,options} from "../../utlis"
import {Request, Response} from "express";
import { UserModel } from "../../models";
import registerUserSchema from "../../validation/user.register.validation";
import crypto from "crypto";


const userRegisterController = async (req: Request, res: Response) => {
    const deviceInfo = getDeviceInfo(req);
    // Log the device information for debugging purposes
   
    // Validate the request body against the schema
    const {success, data, error} = registerUserSchema.safeParse(req.body);
    // Check if the validation was successful
    if (!success) {
        const errorMessage = error.errors.map(err => err.message).join(', ');
        // If validation fails, throw an ApiError with the validation error message
        throw new ApiError("validation error",400, errorMessage);
    }
    // If validation passes, proceed to create the user
    const user = await UserModel.create(data).catch((error) => {
        console.error("Error creating user:", error);
        // Handle duplicate key error (MongoDB error code 11000)
        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyValue)[0];
            throw new ApiError("User already exists", 400,  `Duplicate field: ${duplicateField}`);
        }
        throw error;
    });
    const sessionId = crypto.randomBytes(16).toString('hex'); // Generate a random session ID
    // Create a session object with the device information
    const userSession={
        sessionId: sessionId,
        os: deviceInfo.os.name + " " + deviceInfo.os.version,
        ipAddress: deviceInfo.ip,
        userAgent: deviceInfo.ua,
        createdAt: new Date(),
    }
  
    // Add the session to the user's session array
    user.userSession.push(userSession);
    // user.generateAuthToken 
    // Save the user with the updated information
    await user.save().catch((error) => {
        console.error("Error saving user session:", error);
        throw new ApiError("Internal server error", 500, "Failed to save user session");
    });
    const response = new ApiResponse('User registered successfully',user,200);
    const { authToken, refreshToken, sessionCleanupToken } = await generateTokens(user, sessionId);
    res.status(200)
    .cookie("authToken", authToken, {
        ...options,
        maxAge: 24* 60*60 * 1000, // 1 day in milliseconds
    })
    .cookie("refreshToken", refreshToken, {
        ...options,
        maxAge: 24*7* 60 * 60 * 1000, // 7 days in milliseconds
    })
    .cookie("sessionCleanupToken", sessionCleanupToken, {...options})
    .json(response);
}

export default userRegisterController
    