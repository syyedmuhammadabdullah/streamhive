import { ApiError,ApiResponse } from "../../utlis";
import { Request, Response } from "express";
import { UserModel } from "../../models";
import { z } from "zod";
import Jwt from "jsonwebtoken";
const userResetPasswordSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters long"),
});

const userResetPasswordController = async (req: Request, res: Response) => {
    const resetToken = req.cookies.passwordResetToken;
    // Check if the passwordResetToken is present
    if (!resetToken) {
        throw new ApiError("Unauthorized", 401, "Password reset token is missing");
    }
    // Verify the passwordResetToken
    const secretKey = process.env.Jwt_PASSWORD_RESET_SECRET!;
    const decoded: any = Jwt.verify(resetToken, secretKey, (err: any, decoded: any) => {
        if (err) {
            throw new ApiError("Invalid password reset token", 401, err.message);
        }
        return decoded;
    })
    if (decoded.action !== "otp verified") {
        throw new ApiError("Unauthorized", 401, "Invalid action for password reset token");
    }
    const { data, error, success } = userResetPasswordSchema.safeParse(req.body);
    if (!success) {
        throw new ApiError("Validation error", 400, error.errors[0].message);
    }

    const { email, password, confirmPassword } = data;

    if (password !== confirmPassword) {
        throw new ApiError("Validation error", 400, "Passwords do not match");
    }
    if (decoded.email !== email) {
        throw new ApiError("Unauthorized", 401, "Email mismatch");
    }

    // Check if the user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
        throw new ApiError("Unauthorized", 401, "User not found");
    }

    user.password = password; // Update the user's password
    user.passwordResetToken = undefined; // Clear the reset token
    user.passwordResetExpires = undefined; // Clear the expiration time
    user.userSession = [];
    await user.save();

    const response = new ApiResponse("Password reset successfully", {}, 200);
    res.status(200)
    .clearCookie("passwordResetToken") // Clear the password reset token cookie
    .json(response);
};
export default userResetPasswordController;