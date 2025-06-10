import { Request, Response } from "express";
import { ApiError, ApiResponse } from "../../utlis";
import { VideoModel } from "../../models";

const videoGetController = async (req: Request, res: Response) => {

    if (!req.params.videoId) {
        throw new ApiError("Video ID is required", 400, "Bad Request");
    }

    const videos = await VideoModel.findById(req.params.videoId);

    res.status(200).json(new ApiResponse("Video fetched successfully", videos, 200));
};

export default videoGetController ;