import { Response, Request } from "express";
import { ApiError, ApiResponse } from "../../utlis";
import { ReactionModel } from "../../models";
import { z } from "zod";

const reactionGetCountSchema = z.object({
    videoId: z.string(),
})

const reactionGetCountController = async (req: Request, res: Response) => {
    // Validate the request body against the schema
    const { success, data, error } = reactionGetCountSchema.safeParse(req.body);
    // Check if the validation was successful
    if (!success) {
        throw new ApiError("Validation error", 400, error.errors[0].message);
    }
    // Get all reactions
   const reactions = await ReactionModel.aggregate([
  { $match: { videoId: data.videoId } },
  {
    $group: {
      _id: "$type",
      count: { $sum: 1 }
    }
  }
])
.catch((error) => {
  // Handle the error if the reactions retrieval fails
    throw new ApiError("Error getting reactions", 500, error.message);
});
    // Send a response
    res.status(200).json(new ApiResponse("Reactions retrieved successfully", reactions, 200));
};

export default reactionGetCountController