import dotenv from "dotenv";
import fastifySession from "@fastify/session";
import ConnectMongoDBSession from "connect-mongodb-session";
import { Admin } from "../models/user.model.js";

dotenv.config();

const MongoDBStore = ConnectMongoDBSession(fastifySession);

export const sessionStore = new MongoDBStore({
    uri: process.env.MONGO_URL,
    collection: "sessions",
});

sessionStore.on("error", function (error) {
    console.error(error);
});

export const authenticate = async (email, password) => {
    if (email && password) {
        const user = await Admin.findOne({ email });
        if (!user) return null;
        if (user.password === password) {
            return Promise.resolve({ email: email, password: password });
        } else {
            return null;
        }
    }
    return null;
};

export const PORT = process.env.PORT || 3000;
export const COOKIE_SECRET = process.env.COOKIE_SECRET;
