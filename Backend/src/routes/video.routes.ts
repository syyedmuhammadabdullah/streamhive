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
videoRouter.patch("/:id",authMiddleware,uploadMiddleware.fields([{name:"thumbnail",maxCount:1}]), videoUpdateController);
videoRouter.get("/all", videoGetAllController);
videoRouter.get("/:id", videoGetController);
videoRouter.delete("/:id",authMiddleware, videoDeleteController);

export default videoRouter;