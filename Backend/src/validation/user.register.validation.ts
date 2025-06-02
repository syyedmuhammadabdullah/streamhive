import {z} from 'zod';

const userRegisterSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
});

export default userRegisterSchema;


// optional if you want to use it for type checking
// export type UserRegisterType = z.infer<typeof userRegisterSchema>; 