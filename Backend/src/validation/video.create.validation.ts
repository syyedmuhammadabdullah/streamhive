import {z} from 'zod';


const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/mkv"];




const videoCreateValidation = z.object({
    thumbnail: z
    .any()
    .optional()
    .refine((file) => {

        if (!file) {
            return true;            
        }
        return file?.mimetype && ACCEPTED_IMAGE_TYPES.includes(file.mimetype)}, {
      message: "Only JPEG/PNG images are allowed",
    })
    .refine((file) => {
        
        if (!file) {
            return true;
        }
        return file?.size && file.size <= 5 * 1024 * 1024}, {
      message: "Image must be under 5MB",
    }),

  video: z
    .any()
    .refine((file) => file?.mimetype && ACCEPTED_VIDEO_TYPES.includes(file.mimetype), {
      message: "Only MP4/MKV videos are allowed",
    })
    .refine((file) => file?.size && file.size <= MAX_FILE_SIZE, {
      message: "Video must be under 50MB",
    }),
    title: z.string().trim().min(1, {message: 'Title is required'}),
    description: z.string().min(1, {message: 'Description is required'}),
    tags: z.array(z.string()).optional(),
    isPublished: z.boolean().optional(),


});
export default videoCreateValidation