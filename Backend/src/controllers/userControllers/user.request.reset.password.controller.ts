import { ApiError,ApiResponse,generateTokens,options } from "../../utlis";
import { Request, Response } from "express";
import { sendEmail } from "../../helper";
import { UserModel } from "../../models";
import {z} from "zod";
import crypto from "crypto";

// Define the schema for the request body
const requestResetPasswordSchema = z.object({
    email: z.string().email("Invalid email format"),
});

const userRequestResetPasswordController = async (req: Request, res: Response) => {
    // Validate the request body against the schema
    const { data, error, success } = requestResetPasswordSchema.safeParse(req.body);
    // Check if the validation was successful
    if (!success) {
        const errorMessage = error.errors.map(err => err.message).join(', ');
        // If validation fails, throw an ApiError with the validation error message
        throw new ApiError("validation error",400, errorMessage);
    }
    const email = data.email;
    // Check if the user exists
    const user = await UserModel.findOne({ email: email });
    if (!user) {
        throw new ApiError("User not found", 404, "The user does not exist");
    }
    // Generate the reset password token
    const resetPasswordToken: string = (crypto.randomInt(1000, 10000)).toString();
    console.log("Generated reset password token:", resetPasswordToken);
    
    
    // Update the user's reset password token
    user.passwordResetToken = resetPasswordToken;
    user.passwordResetExpires =new Date( Date.now() + 3600000); // Token expires in 1 hour
    await user.save();
    // Send the reset password email
    const mailOptions = {
        to:email,
        subject: 'Reset Password',
        text: `the reset code is ${resetPasswordToken} use this code to reset your password. This link will expire in 1 hour.`,
        from: process.env.EMAIL_FROM! // Ensure EMAIL_FROM is defined in your environment variables
    };
const {passwordResetToken} =await generateTokens(user,"password reset requested");
   try {
  await sendEmail(mailOptions.to, mailOptions.subject, mailOptions.text, mailOptions.from);
    // If email sending is successful, respond with a success message
   res.status(200)
   .cookie("passwordResetToken", passwordResetToken, {...options,maxAge: 5 * 60 * 1000})
   .json(new ApiResponse("Reset password email sent successfully", [],200 ));

} catch (error) {
  console.error("Error sending email:", error);
  throw new ApiError("Email sending failed", 500, error instanceof Error ? error.message : "Unknown error");
}

}

export default userRequestResetPasswordController;