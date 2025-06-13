import {Router} from 'express';
import { authMiddleware } from '../middlewares';
import { subscriptionCreateController,subscriptionDeleteController,subscriptionGetCountController
 } from '../controllers/subscriptionControllers';

const subscriptionRouter = Router();
// Define your subscription routes here
subscriptionRouter.post("/create",authMiddleware, subscriptionCreateController);
subscriptionRouter.delete("/delete",authMiddleware, subscriptionDeleteController);
subscriptionRouter.get("/get/count", subscriptionGetCountController);


export default subscriptionRouter;