import {Router} from 'express';
import { commentCreateController,commentDeleteController,commentGetAllController,commentUpdateController } from '../controllers/commentControllers';
const commentRouter = Router();
// Define your comment routes here
commentRouter.post("/create", commentCreateController);
commentRouter.delete("/delete", commentDeleteController);
commentRouter.get("/get/all/:query", commentGetAllController);
commentRouter.put("/update", commentUpdateController);
export default commentRouter;