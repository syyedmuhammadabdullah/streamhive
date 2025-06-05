import { ApiError,ApiResponse, } from "../../utlis";
import { Request, Response } from "express";
import { UserModel } from "../../models";

 const userLogoutController = async (req: Request, res: Response) => {
   
        const user = await UserModel.findById(req.user?._id);
        if (!user) {
            throw new ApiError("User not found", 401, "Unauthorized access");
        }
        user.userSession = user.userSession.filter((session) => session.sessionId !== req.user?.sessionId);
        await user.save();
        res.clearCookie("authToken");
        res.clearCookie("refreshToken");
        res.clearCookie("sessionCleanupToken")
        .json( new ApiResponse("User logged out successfully",[],200));
   
}
export default userLogoutController;