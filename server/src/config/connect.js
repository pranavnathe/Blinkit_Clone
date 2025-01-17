import mongoose from "mongoose";

export const connectDB = async (uri) => {
    try {
        await mongoose.connect(uri);
        console.log("Database Connected Successfully ✅");
    } catch (error) {
        console.error("Database Connection Error: ", error);
    }
};
