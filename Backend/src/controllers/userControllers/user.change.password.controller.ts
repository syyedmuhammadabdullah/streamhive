import { ApiError, ApiResponse } from "../../utlis";
import { Request, Response } from "express";
import { UserModel } from "../../models";
import { z } from "zod";
import Jwt from "jsonwebtoken";
const userChangePasswordSchema = z.object({
    newPassword: z.string().min(6, "Password must be at least 6 characters long").trim(),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters long").trim(),
    oldPassword: z.string().min(6, "Password must be at least 6 characters long").trim(),
})

const userChangePasswordController = async (req: Request, res: Response) => {
    const { data, error, success } = userChangePasswordSchema.safeParse(req.body);
    if (!success) {
        const errorMessage = error.errors.map(err => err.message).join(', ');
        throw new ApiError("Validation error", 400, errorMessage);
    }

    const { newPassword, confirmPassword, oldPassword } = data;
    if (newPassword !== confirmPassword) {
        throw new ApiError("Validation error", 400, "Passwords do not match");
    }
    const user = await UserModel.findById(req.user._id);
  
    if (!user) {
    throw new ApiError("User not found", 404, "The user does not exist");    
   }

    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
        throw new ApiError("Validation error", 400, "Old password is incorrect");
    }
    const decodedToken: any = Jwt.verify(req.cookies.authToken, process.env.JWT_SECRET!, (err: any, decoded: any) => {
        if (err) {
            throw new ApiError("Invalid auth token", 401, err.message);
        }
        return decoded;
    });
   
    user.password = newPassword;
    user.userSession = user.userSession.filter(session => session.sessionId !== decodedToken.sessionId);
    await user.save();

    res.status(200).json(new ApiResponse("Password changed successfully", user, 200));
}

export default userChangePasswordController;