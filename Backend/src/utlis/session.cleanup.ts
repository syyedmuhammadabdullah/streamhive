import { Request, Response } from "express";
import { UserModel} from "../models";
import {ApiError,options} from "./index";
import jwt from "jsonwebtoken";
const sessionCleanup = async (req: Request, res: Response) => {
    // Define options for clearing the cookie
const sessionCleanupToken= req.cookies.sessionCleanupToken;

        if (!sessionCleanupToken) {
         throw new ApiError("Unauthorized", 401, "Session cleanup token is missing");
        }
        // Verify the session cleanup token
         const decodedToken:any =  jwt.decode(sessionCleanupToken);
              const user =await  UserModel.findById(decodedToken?.id).catch((error) => {
                throw new ApiError("Failed to find user", 500, `Error: ${error.message}`);
              });
              if (!user) {
                throw new ApiError("User not found", 404, "The user associated with the session cleanup token does not exist");
                
              }
             user.userSession = user.userSession.filter((session) => session.sessionId !== decodedToken?.sessionId);
          
              
             await user?.save().catch((error) => {
                throw new ApiError("Failed to save user", 500, `Error: ${error.message}`);
              });
            res.clearCookie("sessionCleanupToken", options);
}
export default sessionCleanup;