import { Response, Request } from "express";
import { ApiError, ApiResponse } from "../../utlis";
import { SubscriptionModel } from "../../models";
import { z } from "zod";

const subscriptionCreateSchema = z.object({
    userId: z.string(),
    channelId: z.string(),
})
 const subscriptionCreateController = async (req: Request, res: Response) => {
        // Validate the request body against the schema
        const { data, error, success } =  subscriptionCreateSchema.safeParse(req.body);
        // Check if the validation was successful
        if (!success) {
            throw new ApiError("Validation error", 400, error.errors[0].message);
        }
        // Create the subscriber
        const subscriber = await SubscriptionModel.create(data)
        .catch((error) => {
            // Handle the error if the subscriber creation fails
            throw new ApiError("Error creating subscriber", 500, error.message);
        });
       // Send a response
        res.status(200).json(new ApiResponse("Subscriber created successfully", subscriber, 200));
};

export default subscriptionCreateController