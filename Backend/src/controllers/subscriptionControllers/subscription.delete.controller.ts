import { Response, Request } from "express";
import { ApiError, ApiResponse } from "../../utlis";
import { SubscriptionModel } from "../../models";
import { z } from "zod";

const subscriptionDeleteSchema = z.object({
    userId: z.string(),
    channelId: z.string(),
})

const subscriptionDeleteController = async (req: Request, res: Response) => {
        // Validate the request body against the schema
        const { data, error, success } = subscriptionDeleteSchema.safeParse(req.body);
        // Check if the validation was successful
        if (!success) {
            throw new ApiError("Validation error", 400, error.errors[0].message);
        }
        // Delete the subscriber
        const subscriber = await SubscriptionModel.findOneAndDelete({ userId: data.userId, channelId: data.channelId })
        .catch((error) => {
            throw new ApiError("Error deleting subscriber", 500, error.message);
        });
        // Check if the subscriber was deleted
        if (!subscriber) {
            throw new ApiError("Subscriber not found", 404, "The subscriber does not exist");
        }
        // Send a response
        res.status(200).json(new ApiResponse("Subscriber deleted successfully", subscriber, 200));
}

export default subscriptionDeleteController