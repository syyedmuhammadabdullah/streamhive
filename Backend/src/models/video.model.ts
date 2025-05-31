import {Schema, model} from "mongoose";

export interface IVideo extends Document {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  userId: Schema.Types.ObjectId; // Reference to UserModel
  likes?: number;
  dislikes?: number;
  views?: number;
  duration?: number; // Duration in seconds
  tags?: string[];
  isPublished?: boolean;
}

const videoSchema = new Schema<IVideo>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  videoUrl: {
    type: String,
    required: true,
    trim: true,
  },
  thumbnailUrl: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "UserModel",
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
    views: {
        type: Number,
        default: 0,
    },
    duration: {
        type: Number,
        default: 0,
    },
  tags: {
    type: [String],
    default: [],
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
});

videoSchema.index({ title: "text", description: "text", tags: "text" }, {
  weights: {
    title: 5,
    description: 3,
    tags: 1,
  },
  name: "VideoTextIndex",
});
export const VideoModel = model<IVideo>("VideoModel", videoSchema);