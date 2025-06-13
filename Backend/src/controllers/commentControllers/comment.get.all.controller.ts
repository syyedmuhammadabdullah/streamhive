import { Request, Response } from "express";
import { ApiError, ApiResponse } from "../../utlis";
import { CommentModel } from "../../models";
import {z} from "zod";

const commentGetAllSchema = z.object({
    videoId: z.string(),
    page: z.number().optional(),
    limit: z.number().optional(),
})

const commentGetAllController = async (req: Request, res: Response) => {
   
    const {data,success, error} = commentGetAllSchema.safeParse(req.query);

    if (!success) {
        throw new ApiError("Validation error", 400, error.errors[0].message);
    }
    const limit=data.limit?data.limit:10
    const page=data.page?data.page-1*limit:0

    
    const comments = await CommentModel.find({ videoId: data.videoId })
    .skip(page)
    .limit(limit)
    .sort({ createdAt: -1 })
    .catch((error) => {
        throw new ApiError("Error getting comments", 500, error.message);
    });
    res.status(200).json(new ApiResponse("Comments retrieved successfully", comments, 200));
}

export default commentGetAllController;