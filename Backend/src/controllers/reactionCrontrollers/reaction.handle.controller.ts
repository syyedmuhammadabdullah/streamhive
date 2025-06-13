import { Response, Request } from "express";
import { ApiError, ApiResponse } from "../../utlis";
import { ReactionModel } from "../../models";
import { z } from "zod";

const reactionHandleSchema = z.object({
    userId: z.string(),
    channelId: z.string(),
    type: z.string(),
})


const reactionHandleController = async (req: Request, res: Response) => {
  
        const { success, data, error } = reactionHandleSchema.safeParse(req.body);

        if (!success) {
            throw new ApiError("Validation error", 400, error.errors[0].message);
        }

   const reaction = await ReactionModel.findOneAndUpdate(
        { userId: data.userId, channelId: data.channelId },
         { $set: { type: data.type } },
         { upsert: true, new: true }
    ).catch((error) => {
        throw new ApiError("Error creating reaction", 500, error.message);
    });
      
        res.status(200).json(new ApiResponse("Reaction created successfully", reaction, 200));
       
        
}

export default reactionHandleController;