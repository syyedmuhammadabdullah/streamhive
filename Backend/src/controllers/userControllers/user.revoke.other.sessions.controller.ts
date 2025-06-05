import { ApiError,ApiResponse, } from "../../utlis";
import { Request, Response } from "express";
import { UserModel } from "../../models";
import jwt from "jsonwebtoken";

const userRevokeOtherSessionsController = async (req: Request, res: Response) => {
 
    const authToken = req.cookies.authToken;

    if (!authToken) {
        throw new ApiError("Unauthorized", 401, "Auth token is missing");
    }
    const decoded: any = jwt.verify(authToken, process.env.JWT_SECRET!);
    if (!decoded || !decoded.id) {
        throw new ApiError("Invalid auth token", 401, "Auth token is invalid");
    }
    const sessionId = decoded.sessionId;
    if (!sessionId) {
        throw new ApiError("Session ID is required", 400, "Bad Request");
    }
    const user = await UserModel.findById(req.user._id);

    if (!user) {
        throw new ApiError("User not found", 401, "Unauthorized access");
    }

    user.userSession = user.userSession.filter(session => session.sessionId === sessionId);
    await user.save();

    res.json(new ApiResponse("User session revoked successfully", [], 200));
}

export default userRevokeOtherSessionsController;