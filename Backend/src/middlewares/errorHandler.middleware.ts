import { Request, Response, NextFunction } from 'express';
const apiHandlerMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const error= err.error
    const errorResponse = {
        status: 'error',
        statusCode,
        message,
        error,
    };
    res.status(statusCode).json(errorResponse);
    console.error(`Error: ${message}`, err);
}
// Export the error handler middleware
export default apiHandlerMiddleware;
// This middleware handles errors in the Express application.