import {Schema, model} from 'mongoose';

export interface ISubscription {
    userId: Schema.Types.ObjectId; // Reference to UserModel
    channelId: Schema.Types.ObjectId; // Reference to UserModel (the channel being subscribed to)
    
}

const subscriptionSchema = new Schema<ISubscription>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "UserModel",
        required: true,
    },
   channelId: {
        type: Schema.Types.ObjectId,
        ref: "UserModel",
        required: true,
    },
    
}, {
    timestamps: true,
});

export const SubscriptionModel = model<ISubscription>("SubscriptionModel", subscriptionSchema);
// Exporting the SubscriptionModel for use in other parts of the application