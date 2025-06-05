import { ApiError, ApiResponse } from "../../utlis";
import { Request, Response } from "express";
import { UserModel } from "../../models";
import { z } from "zod";

const userChangeNameSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
})

const userChangeNameController = async (req: Request, res: Response) => {
  
        const {data,success,error } = userChangeNameSchema.safeParse(req.body);
        
        if (!success) {
            throw new ApiError("Validation error", 400, error.errors[0].message);
        }
        const user = await UserModel.findByIdAndUpdate(req.user._id, { firstName:data.firstName, lastName:data.lastName }, { new: true });

        if (!user) {
            throw new ApiError("User not found", 404, "The user does not exist");     
        }
        // Send a response
        res.status(200).json(new ApiResponse("Name changed successfully", user, 200));
}

export default userChangeNameController;