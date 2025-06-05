import { ApiError, ApiResponse } from "../../utlis";
import { Request, Response } from "express";
import { UserModel } from "../../models";

const userRevokeSessionsController = async (req: Request, res: Response) => {
    // Extract sessionId from request body
 const sessionId = req.body.sessionId;

    if (!sessionId) {
        throw new ApiError("Session ID is required", 400, "Bad Request");
    }

    if (!req.user || !req.user._id) {
        throw new ApiError("Unauthorized", 401, "User not authenticated");
    }

    const user = await UserModel.findById(req.user._id);

    if (!user) {
        throw new ApiError("User not found", 401, "Unauthorized access");
    }

    const sessionExists = user.userSession.some(session => session.sessionId === sessionId);
    if (!sessionExists) {
        throw new ApiError("Session not found", 404, "No such session exists");
    }

    user.userSession = user.userSession.filter(session => session.sessionId !== sessionId);
    
    await user.save();

    res.json(new ApiResponse("User session revoked successfully", [], 200));
};

export default userRevokeSessionsController;
