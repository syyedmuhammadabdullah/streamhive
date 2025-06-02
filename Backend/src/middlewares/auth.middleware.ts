import { UserModel } from "../models";
import { Request, Response, NextFunction } from "express";
import {ApiError,updateAuthToken} from "../utlis";
import jwt from "jsonwebtoken";


const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    
    const authToken = req.cookies.authToken;
    
    // Check if the auth token is present
    if (!authToken) {
       // If not, update the auth token using the refresh token
       await updateAuthToken(req, res);
        return next();
    }

    const decoded: any = jwt.verify(authToken, process.env.JWT_AUTH_SECRET!, (err: any, decoded: any) => {
        if (err) {
            // If the token is invalid, update the auth token using the refresh token
            if (err.name === 'TokenExpiredError') {
                // Token expired, update auth token
                return updateAuthToken(req, res).then(() => next());
            }
            else{   
                throw new ApiError("Invalid auth token", 401, err.message);
            }
        }
        return decoded;
    });
    
    // If the token is valid, attach the user information to the request object
   const user= await UserModel.findById(decoded.id).catch((error) => {
        throw new ApiError("Failed to find user", 500, `Error: ${error.message}`);
    });
    if(!user){
        throw new ApiError("User not found", 404, "The user does not exist");
    }
    const session=user?.userSession?.find((session) => session.sessionId === decoded.sessionId);
    if(!session){
        throw new ApiError("Session not found", 404, "The session associated with the auth token does not exist");
    }
    // Proceed to the next middleware or route handler
    next();
}
export default authMiddleware;