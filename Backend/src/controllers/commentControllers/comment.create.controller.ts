import { Request, Response } from "express";
import { ApiError, ApiResponse } from "../../utlis";
import { CommentModel } from "../../models";
import {z} from "zod";

const commentCreateSchema = z.object({
    userId: z.string(),
    videoId: z.string(),
    comment: z.string().trim().min(1, "Comment is required"),
})

const commentCreateController = async (req: Request, res: Response) => {
    
        const { data, error, success } = commentCreateSchema.safeParse(req.body);

        if (!success) {
            throw new ApiError("Validation error", 400, error.errors[0].message);
        }
        const comment = await CommentModel.create(data)
        .catch((error) => {
            throw new ApiError("Error creating comment", 500, error.message);
        });
        res.status(200).json(new ApiResponse("Comment created successfully", comment, 200));
}

export default commentCreateController