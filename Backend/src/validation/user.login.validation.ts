import {z} from 'zod';

const userLoginValidation = z.object({
  email: z.string().email({message: 'Invalid email format'}),
  password: z.string().min(6, {message: 'Password must be at least 6 characters long'}),
});
export default userLoginValidation;

// optional if you want to use it for type checking
// export type UserLoginValidationType = z.infer<typeof userLoginValidation>;