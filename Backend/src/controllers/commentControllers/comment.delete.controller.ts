import { Request, Response } from "express";
import { ApiError, ApiResponse } from "../../utlis";
import { CommentModel } from "../../models";
import {z} from "zod";

const commentDeleteSchema = z.object({
    userId: z.string(),
    videoId: z.string(),
})

export const commentDeleteController = async (req: Request, res: Response) => {
  
        const {data,error,success } = commentDeleteSchema.safeParse(req.body);

        if (!success) {
            throw new ApiError("validation error",400, error.errors[0].message);
        }
        const comment = await CommentModel.findOneAndDelete(data).catch((error) => {
            throw new ApiError("error while deleting comment",500, error.message);
        });
        if (!comment) {
            throw new ApiError("error while deleting comment",404, "Comment not found");
        }
        res.status(200).json(new ApiResponse("Comment deleted successfully", comment, 200));
    
};
export default commentDeleteController;
