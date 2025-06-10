import { Request, Response } from "express";
import {
  ApiError,
  ApiResponse,
  createVideoFolder,
  processVideo,
} from "../../utlis";
import { VideoModel } from "../../models";
import videoCreateValidation from "../../validation/video.create.validation";
import path from "path";

const videoCreateController = async (req: Request, res: Response) => {
  const files = req.files as {
    video?: Express.Multer.File[];
    thumbnail?: Express.Multer.File[];
  };

  const videoFile = files.video?.[0]!;
  if (!videoFile) {
    throw new ApiError("Video file is required", 400);
  }

  const thumbnailFile = files.thumbnail?.[0] || null;
  const { data, error, success } = videoCreateValidation.safeParse({
    ...req.body,
    video: videoFile,
    thumbnail: thumbnailFile,
  });
  if (!success) {
    throw new ApiError("Validation error", 400, error.errors[0].message);
  }

  const fileName = videoFile.originalname;
  const time = new Date().toISOString();
  const { videoQualityFolder } = createVideoFolder(fileName, time);

  const inputPath = videoFile.path;
  const fileNameWithoutExt = path.parse(fileName).name.replace(/\s+/g, "_");
  const { thumbnailPath, masterPlaylist, videoFolderId } = await processVideo({
    inputPath,
    outputDir: videoQualityFolder,
    fileNameWithoutExt,
    newThumbnailPath: data.thumbnail?.path || "",
  });

  const video = await VideoModel.create({
    userId: req.user._id,
    title: data.title,
    description: data.description,
    thumbnailUrl: thumbnailPath,
    videoUrl: masterPlaylist,
    videoFolderId,
  });

  res
    .status(200)
    .json(new ApiResponse("Video uploaded successfully", video, 200));
};

export default videoCreateController;
