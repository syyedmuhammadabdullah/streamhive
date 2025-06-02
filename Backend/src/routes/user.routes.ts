import {Router,Request,Response} from 'express';
import { userRegisterController, userLoginController } from '../controllers/userControllers';
const userRouter = Router();

// Define your user routes here
// register route for user registration
userRouter.post('/register', userRegisterController);
// login route for user login
userRouter.post('/login', userLoginController);


// Example route to test if the user router is working
userRouter.get('/', (req: Request, res: Response) => {
    res.send('User route is working');
});
export default userRouter;