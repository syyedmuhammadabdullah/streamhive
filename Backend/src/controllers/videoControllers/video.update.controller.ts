import { ApiError, ApiResponse,processVideo } from "../../utlis";
import { Request, Response } from "express";
import { VideoModel } from "../../models";
import videoUpdateValidation from "../../validation/video.update.validation";
import fs from "fs";
import path from "path";


const videoUpdateController = async (req: Request, res: Response) => {
    const videoId=req.params.videoId
    if (!videoId) {
        throw new ApiError("Video ID is required", 400, "Bad Request");
    }
    const files = req.files as {
        thumbnail?: Express.Multer.File[];
    };
    const thumbnailFile = files.thumbnail?.[0] || null;
    
    const { data, error, success } = videoUpdateValidation.safeParse({...req.body,thumbnail: thumbnailFile});
    if (!success) {
        throw new ApiError("Validation error", 400, error.errors[0].message);
    }

    const video = await VideoModel.findById(videoId);

    if (!video) {
        throw new ApiError("Video not found", 404, "The video does not exist");
    }

    if (video?.userId !== req.user?._id) {
        throw new ApiError("Unauthorized", 401, "Unauthorized access");
    }
    if (data.title) {
        video.title = data.title;
    }

    if (data.description) {
        video.description = data.description;
    }

    if (data.tags) {
        video.tags = data.tags;
    }

    if (typeof data.isPublished === "boolean") {
        video.isPublished = data.isPublished;
    }

    if (data.thumbnail) {
        if (video.thumbnailUrl) {
            fs.unlinkSync(video.thumbnailUrl);
        }
        const thumbnailPath=path.join(video.videoFolderId, 'thumb.jpg')
        fs.renameSync(data.thumbnail.path, thumbnailPath);
        video.thumbnailUrl = thumbnailPath;
    }
    const updatedVideo = await video.save();

  
    res.status(200).json(new ApiResponse("Video updated successfully", updatedVideo, 200));
};

export default videoUpdateController;