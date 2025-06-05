import { ApiError, ApiResponse } from "../../utlis";
import { Request, Response } from "express";
import { UserModel } from "../../models";
import { z } from "zod";

const userChangeEmailSchema = z.object({
    email: z.string().email("Invalid email format"),
});

const userChangeEmailController = async (req: Request, res: Response) => {
   
        // Validate the request body against the schema
        const { data, error, success } = userChangeEmailSchema.safeParse(req.body);

        if (!success) {
            throw new ApiError("Invalid request body", 400, error.errors[0].message);
        }

        const user = await UserModel.findByIdAndUpdate(req.user._id, { email: data.email }, { new: true });

        if (!user) {
            throw new ApiError("User not found", 404, "The user does not exist");
        }
        // Send a response
        res.status(200).json(new ApiResponse("Email changed successfully", user, 200));
}

export default userChangeEmailController;