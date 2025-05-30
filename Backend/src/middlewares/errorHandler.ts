import { Request, Response, NextFunction } from 'express';
const apiHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const errors= err.errors || [];
    const errorResponse = {
        status: 'error',
        statusCode,
        message,
        errors,
    };
    res.status(statusCode).json(errorResponse);
    console.error(`Error: ${message}`, err);
}
// Export the error handler middleware
export default apiHandler;
// This middleware handles errors in the Express application.