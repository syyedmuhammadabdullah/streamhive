import { ApiError,ApiResponse,generateTokens,options } from "../../utlis";
import { Request, Response } from "express";
import { UserModel } from "../../models";
import {z} from "zod";
import  Jwt  from "jsonwebtoken";
const userVerifyOtpSchema = z.object({
    email: z.string().email(),
    otp: z.string().min(4, "OTP must be at least 4 characters long"),
});

const userVerifyPasswordOtpController = async (req: Request, res: Response) => {

    const resetToken = req.cookies.passwordResetToken;
    // Check if the passwordResetToken is present
    if (!resetToken) {
        throw new ApiError("Unauthorized", 401, "Password reset token is missing");
    }
    // Verify the passwordResetToken
    const secretKey = process.env.Jwt_PASSWORD_RESET_SECRET!;
    const decoded: any = Jwt.verify(resetToken, secretKey, (err: any, decoded:any) => {
        if (err) {
            throw new ApiError("Invalid password reset token", 401, err.message);
        }
        return decoded;
    }
    );
   
    if (decoded.action !== "password reset requested" ) {
        throw new ApiError("Unauthorized", 401, "Invalid action for password reset token");
        
    }
    if (decoded.email !== req.body.email) {
        throw new ApiError("Unauthorized", 401, "Email is incorrect or missing in the token");
    }
    // Validate the request body against the schema
    const { data, error, success } = userVerifyOtpSchema.safeParse(req.body);
    if (!success) {
        throw new ApiError("the email and otp are required",400, error.errors[0].message);
    }

    const user = await UserModel.findOne({ email:data.email });
    if (!user) {
       throw new ApiError("unauthorized", 401, "User not found");
    }
    if (user.passwordResetToken !== data.otp) {
       throw new ApiError("unauthorized", 401, "Invalid OTP");
    }
    if (user.passwordResetExpires && user.passwordResetExpires < new Date()) {
       throw new ApiError("unauthorized", 401, "OTP has expired");
    }
    const {passwordResetToken}= await generateTokens(user, "otp verified");
    // OTP is valid, proceed with verification
    user.passwordResetToken = undefined; // Clear the OTP
    user.passwordResetExpires = undefined; // Clear the expiration time
    await user.save();
    // Send a success response
    const response = new ApiResponse("OTP verified successfully", {}, 200);
    res.status(200)
    .cookie("passwordResetToken", passwordResetToken, {...options,maxAge: 5 * 60 * 1000})
    .json(response);
}

export default userVerifyPasswordOtpController 