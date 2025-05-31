import {Router,Request,Response} from 'express';
import { userRegisterController } from '../controllers/userControllers';
const userRouter = Router();

// Define your user routes here

userRouter.post('/register', userRegisterController);

userRouter.get('/', (req: Request, res: Response) => {
    res.send('User route is working');
});
export default userRouter;