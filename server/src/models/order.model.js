import mongoose from "mongoose";
import Counter from "./counter.model.js";

const orderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            required: true,
            unique: true,
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },
        deliveryPartner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DeliveryPartner",
        },
        branch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Branch",
            required: true,
        },
        items: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                items: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                count: {
                    type: Number,
                    required: true,
                },
            },
        ],
        deliveryLocation: {
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true },
            address: { type: String },
        },
        pickupLocation: {
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true },
            address: { type: String },
        },
        deliveryPersonLocation: {
            latitude: { type: Number },
            longitude: { type: Number },
            address: { type: String },
        },
        status: {
            type: String,
            enum: [
                "available",
                "confirmed",
                "arriving",
                "delivered",
                "cancelled",
            ],
            default: "available",
        },
        totalPrice: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

async function getNextSequenceValue(sequenceName) {
    const sequenceDocument = await Counter.findOneAndUpdate(
        { _id: sequenceName },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
    );
    return sequenceDocument.sequence_value;
}

orderSchema.pre("save", async function (next) {
    if (this.isNew) {
        const sequenceValue = await getNextSequenceValue("orderId");
        this.orderId = `ORD-${sequenceValue.toString().padStart(5, "0")}`;
    }
    next();
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
