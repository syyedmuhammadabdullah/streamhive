import { Router } from "express";
import { authMiddleware } from "../middlewares";
import { reactionCreateController, reactionDeleteController, reactionGetCountController } from "../controllers/reactionControllers";

const reactionRouter = Router();
// Define your reaction routes here
reactionRouter.post("/create",authMiddleware, reactionCreateController);
reactionRouter.delete("/delete",authMiddleware, reactionDeleteController);
reactionRouter.get("/get/count", reactionGetCountController);


export default reactionRouter;