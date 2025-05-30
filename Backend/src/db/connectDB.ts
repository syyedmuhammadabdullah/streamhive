import {dbName,app} from "../index";
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // This code connects to a MongoDB database using Mongoose.
        await mongoose.connect(`mongodb://localhost/${dbName}`);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

export default connectDB;
