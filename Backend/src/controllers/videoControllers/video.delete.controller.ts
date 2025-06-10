import { Request, Response } from "express";
import { ApiError, ApiResponse } from "../../utlis";
import { VideoModel } from "../../models";
import fs from "fs";

const videoDeleteController = async (req: Request, res: Response) => {
    if (!req.params.videoId) {
        throw new ApiError("Video ID is required", 400, "Bad Request");
    }

    const video = await VideoModel.findByIdAndDelete(req.params.videoId);

    if (video?.userId !== req.user?._id) {

        throw new ApiError("Unauthorized", 401, "Unauthorized access");  
    }
    fs.unlinkSync(video?.videoFolderId!);

    res.status(200).json(new ApiResponse("Video deleted successfully", video, 200));
};

export default videoDeleteController;