import {  ApiResponse }  from "../../utlis";
import { Request, Response } from "express";
import { VideoModel } from "../../models";

const videoGetAllController = async (req: Request, res: Response) => {
    
    const videos = await VideoModel.find();

    res.status(200).json(new ApiResponse("Videos fetched successfully", videos, 200));
};

export default videoGetAllController;