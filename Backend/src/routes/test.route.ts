import {Router, Request, Response} from 'express';	
import {ApiError,ApiResponse} from "../index"

const testRouter = Router();

testRouter.get('/test', (req: Request, res: Response) => {

    res.status(200).json(new ApiResponse('testing custom response',[
        {name: 'Syed Muhammad Abdullah'},
        {name: 'Syed Muhammad Ali'},
    ],200));

    // throw new ApiError('testing custom error',400);

});

export default testRouter;