import {Router, Request, Response} from 'express';	
import {ApiError,ApiResponse,createVideoFolder,processVideo} from "../utlis";
import { authMiddleware, uploadMiddleware } from '../middlewares';
import path from 'path';

const testRouter = Router();

testRouter.post('/test', uploadMiddleware.single('video'), async(req: Request, res: Response) => {
  
    if (!req.file) {
        throw new ApiError('No file uploaded', 400);
        
    }
    const fileName=req.file.originalname
    const time= new Date().toISOString()
   const { videoQualityFolder}= createVideoFolder(fileName,time);
   

   const inputPath=req.file.path
   const fileNameWithoutExt = path.parse(fileName).name.replace(/\s+/g, "_");
 const {thumbnailPath,masterPlaylist}=  await processVideo({
  inputPath,
  outputDir: videoQualityFolder,
  fileNameWithoutExt,
});
console.log("the master playlist is ",masterPlaylist,'THUMBNAIL',thumbnailPath);

    res.status(200).json(new ApiResponse('testing custom response',{thumbnailPath,masterPlaylist},200));

    // throw new ApiError('testing custom error',400);

});

export default testRouter;