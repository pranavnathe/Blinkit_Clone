import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: { type: String },
    location: {
        latitude: { type: Number },
        longitude: { type: Number },
    },
    deliveryParterns: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DeliveryPartner",
        },
    ],
});

export const Branch = mongoose.model("Branch", branchSchema);
