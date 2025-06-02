import { UserModel } from "../../models";

declare global{
    namespace Express {
        interface Request {
            user?: UserModel;
        }
    }
}

// Extend the Express Request interface to include a user property
export {}