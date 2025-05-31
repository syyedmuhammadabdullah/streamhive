
import {app} from "./app";
import connectDB from "./db/connectDB";

// Connect to the database
connectDB().then(() => {
    // Start the server after connecting to the database
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // Exit the process if the connection fails
});

