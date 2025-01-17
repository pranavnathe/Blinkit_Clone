import dotenv from "dotenv";
import Fastify from "fastify";
import { connectDB } from "./src/config/connect.js";

dotenv.config();

const fastify = Fastify({
    logger: true,
});

// Declare a route
fastify.get("/", async function handler(request, reply) {
    return { hello: "world" };
});

const start = async () => {
    await connectDB(process.env.MONGO_URL);
    fastify.listen({ port: process.env.PORT || 3000 }, (err, address) => {
        if (err) {
            fastify.log.error(err);
            process.exit(1);
        } else {
            console.log(`Server listening on ${address}`);
        }
    });
};

// Run the server!
start();
