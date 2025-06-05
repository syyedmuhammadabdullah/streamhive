import { UserModel } from "../../models";
import { ApiError, ApiResponse } from "../../utlis";
import { Request, Response } from "express";

import { generateSecret, generateQRCode } from "../../utlis/totp.utlis";

const userEnable2faController = async (req: Request, res: Response) => {

    // Check if the user exists
    const user = await UserModel.findOne({ email: req.user.email });
    // Validate the user's email
    if (!user) {
        throw new ApiError("User not found", 404, "The user does not exist");
    }

    // Generate a TOTP secret and QR code
    const {secret, otpauthUrl} = generateSecret(email);
    const qrCodeUrl = generateQRCode( otpauthUrl);

    // Update the user's TOTP secret
    user.totpSecret = secret;
    await user.save();

    // Send the QR code URL in the response
    res.status(200).json(new ApiResponse("2FA enabled successfully", { qrCodeUrl: qrCodeUrl,secret:secret }, 200));
}
export default userEnable2faController;
// This controller enables two-factor authentication (2FA) for a user by generating a TOTP secret and QR code.