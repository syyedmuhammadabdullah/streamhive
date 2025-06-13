import {Schema, model} from 'mongoose';

export interface IReaction extends Document {
    userId: Schema.Types.ObjectId;
    videoId: Schema.Types.ObjectId;
    type: string;
}

const ReactionSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true,
    },
    videoId: {
        type: Schema.Types.ObjectId,
        ref: 'VideoModel',
        required: true,
    },
    type: {
        type: String,
        enum: ['like', 'dislike'],
        required: true,
    },
}, {
    timestamps: true,
});

export const ReactionModel = model<IReaction>('ReactionModel', ReactionSchema);