import { Response, Request } from "express";
import { ApiError, ApiResponse } from "../../utlis";
import { SubscriptionModel } from "../../models";
import { z } from "zod";


/** 
 * @description Get all subscribers of a channel
* @param {channelId} - The id of the channel(user)
*/

const subscriptionGetCountSchema = z.object({
    channelId: z.string(),
});



const subscriptionGetCountController = async (req: Request, res: Response) => {

    // Validate the request body against the schema
    const { data, error, success } = subscriptionGetCountSchema.safeParse(req.body);
    // Check if the validation was successful
    if (!success) {
        throw new ApiError("Validation error", 400, error.errors[0].message);
    }
    // Get all subscribers
    const subscribers = await SubscriptionModel.find({userId: data.channelId})
    .countDocuments()
    .catch((error) => {
        // Handle the error if the subscribers retrieval fails
        throw new ApiError("Error getting subscribers", 500, error.message);
    });
    // Send a response
    res.status(200).json(new ApiResponse("Subscribers retrieved successfully", subscribers, 200));
};

export default subscriptionGetCountController;