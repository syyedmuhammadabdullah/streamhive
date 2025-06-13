import { Response, Request } from "express";
import { ApiError, ApiResponse } from "../../utlis";
import { ReactionModel } from "../../models";
import { z } from "zod";

const reactionDeleteSchema = z.object({
    userId: z.string(),
    videoId: z.string(),
})

const reactionDeleteController = async (req: Request, res: Response) => {
    // Validate the request body against the schema
    const { success, data, error } = reactionDeleteSchema.safeParse(req.body);
    // Check if the validation was successful
    if (!success) {
        throw new ApiError("Validation error", 400, error.errors[0].message);
    }
    // Delete the reaction
    const reaction = await ReactionModel.findOneAndDelete({ userId: data.userId, videoId: data.videoId })
    .catch((error) => {
        // Handle the error if the reaction deletion fails
        throw new ApiError("Error deleting reaction", 500, error.message);
    });
    // Check if the reaction was deleted
    if (!reaction) {
        throw new ApiError("Reaction not found", 404, "The reaction does not exist");
    }
    // Send a response
    res.status(200).json(new ApiResponse("Reaction deleted successfully", reaction, 200));
}

export default reactionDeleteController