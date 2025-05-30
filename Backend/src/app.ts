import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { apiHandler } from './middlewares';


dotenv.config({path: './.env'});
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// Import routes
import testRouter from './routes/test.route';
app.use('/api', testRouter);



app.use(apiHandler);
export {app};