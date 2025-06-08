import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { apiHandlerMiddleware } from './middlewares';
import path from 'path';


// Load environment variables from .env file
dotenv.config({path: './.env'});
// Initialize the Express application
const app = express();
// Set the port from environment variables
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
// Middleware to parse JSON and URL-encoded data
app.use(express.json());
// Middleware to parse cookies
app.use(cookieParser());
// Middleware to parse URL-encoded data
app.use(express.urlencoded({extended: true}));
// Serve static files from the 'processed' directory
app.use('/processed', express.static(path.join(__dirname,"..", 'processed')))

// Import routes
import testRouter from './routes/test.route';
app.use('/api', testRouter);

import { userRouter, commentRouter, videoRouter, subscriptionRouter } from './routes';
//user routes
app.use('/api/users', userRouter);
// comment routes
app.use('/api/comments', commentRouter);
// video routes
app.use('/api/videos', videoRouter);
// subscription routes
app.use('/api/subscriptions', subscriptionRouter);


app.use(apiHandlerMiddleware);
export {app};