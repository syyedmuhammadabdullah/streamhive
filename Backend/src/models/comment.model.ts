import {Schema, model} from 'mongoose';

export interface IComment extends Document {	
    comment: string;
    userId: Schema.Types.ObjectId; // Reference to UserModel
    videoId: Schema.Types.ObjectId; // Reference to VideoModel
}

const commentSchema = new Schema<IComment>({
    comment: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500, // Limit comment length to 500 characters
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "UserModel",
        required: true,
    },
    videoId: {
        type: Schema.Types.ObjectId,
        ref: "VideoModel",
        required: true,
    },
   
}, {
    timestamps: true,
});

export const CommentModel = model<IComment>("CommentModel", commentSchema);