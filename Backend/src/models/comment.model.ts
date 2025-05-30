import {Schema, model} from 'mongoose';

export interface IComment {
    content: string;
    userId: Schema.Types.ObjectId; // Reference to UserModel
    videoId: Schema.Types.ObjectId; // Reference to VideoModel
    likes?: number;
    dislikes?: number;
}

const commentSchema = new Schema<IComment>({
    content: {
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
    likes: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

export const CommentModel = model<IComment>("CommentModel", commentSchema);