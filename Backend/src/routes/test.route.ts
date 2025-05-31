import {Router, Request, Response} from 'express';	
import {ApiError,ApiResponse,getDeviceInfo} from "../utlis";

const testRouter = Router();

testRouter.get('/test', (req: Request, res: Response) => {
    const deviceInfo = getDeviceInfo(req);
    // Log the device information for debugging purposes
    console.log("Test request received:", req.body, " Device Info:", deviceInfo);

    res.status(200).json(new ApiResponse('testing custom response',[
        {name: 'Syed Muhammad Abdullah'},
        {name: 'Syed Muhammad Ali'},
    ],200));

    // throw new ApiError('testing custom error',400);

});

export default testRouter;