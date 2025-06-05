import { ApiError,ApiResponse, } from "../../utlis";
import { Request, Response } from "express";
import { UserModel } from "../../models";

const userRevokeAllSessionsController = async (req: Request, res: Response) => {
   
    const user = await UserModel.findById(req.user._id);

    if (!user) {
        throw new ApiError("User not found", 401, "Unauthorized access");
    }

    user.userSession = []; // Clear all user sessions
    await user.save();

    res.json(new ApiResponse("User session revoked successfully", [], 200));
}

export default userRevokeAllSessionsController;