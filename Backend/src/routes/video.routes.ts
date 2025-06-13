import {Router} from 'express';
import {
    videoCreateController,
    videoDeleteController,
    videoGetAllController,
    videoGetController,
    videoUpdateController
} from '../controllers/videoControllers';
import { uploadMiddleware,authMiddleware } from '../middlewares';


const videoRouter = Router();
// Define your video routes here
videoRouter.post("/create",authMiddleware,uploadMiddleware.fields([{name:"video",maxCount:1},{name:"thumbnail",maxCount:1}]), videoCreateController);
videoRouter.patch("update/:id",authMiddleware,uploadMiddleware.fields([{name:"thumbnail",maxCount:1}]), videoUpdateController);
videoRouter.get("get/all", videoGetAllController);
videoRouter.get("get/:id", videoGetController);
videoRouter.delete("/delete/:videoId",authMiddleware, videoDeleteController);

export default videoRouter;