import { Request, Response } from "express";
import { ApiError, ApiResponse } from "../../utlis";
import { CommentModel } from "../../models";
import {z} from "zod";

const commentupdateSchema = z.object({
    userId: z.string(),
    videoId: z.string(),
    comment: z.string().trim().min(1, "Comment is required"),
})

const commentUpdateController = async (req: Request, res: Response) => {
   
        const { success,error,data } = commentupdateSchema.safeParse(req.body);

        if (!success) {
            throw new ApiError("Validation error", 400, error.errors[0].message);
        }
        const commentData = await CommentModel.findOneAndUpdate(
            { userId:data.userId, videoId: data.videoId },
            { comment: data.comment },
            { new: true }).catch((error) => {
                throw new ApiError("Error updating comment", 500, error.message);
            });
        if (!commentData) {
            throw new ApiError("Comment not found", 404, "The comment does not exist");
        }
        res.status(200).json(new ApiResponse("Comment updated successfully", commentData, 200));
}
export default commentUpdateController;