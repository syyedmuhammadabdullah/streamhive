import cron,{ NodeCron } from "node-cron";
import { UserModel } from "../models";

    cron.schedule("*/4 * * * *", async () => {
    console.log("Running user session cleanup task...");

    // const date=new Date(Date.now() - 1000 * 60 * 60 * 24 * 30); // 30 days ago
    const date=new Date(Date.now() - 1000 * 60 * 5);
    // Find users with sessions and remove the first session
       await UserModel.updateMany(
      {},
      {
        $pull: {
         userSession: {
            createdAt: { $lt: date } // Remove sessions older than 30 days
          }
        }
      }
    );
        console.log("User sessions cleaned up successfully.");
  
});