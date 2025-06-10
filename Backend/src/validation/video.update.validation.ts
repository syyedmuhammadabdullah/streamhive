import { z } from "zod";

const videoUpdateSchema = z.object({
    thumbnail: z
    .any()
    .optional()
    .refine((file) => {

        if (!file) {
            return true;            
        }
        return file?.mimetype && ['image/jpeg', 'image/png'].includes(file.mimetype)}, {
            message: "Invalid file type. Only image files are allowed.",
          })
    .refine((file) => {
        
        if (!file) {
            return true;
        }
        return file?.size && file.size <= 5 * 1024 * 1024}, {
            message: "Image must be under 5MB",
          }),
    title: z.string().min(1, "Title is required").optional(),
    description: z.string().min(1, "Description is required").optional(),
    tags: z.array(z.string()).optional(),
    isPublished: z.boolean().optional().default(true),
});

export default videoUpdateSchema;