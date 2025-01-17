import dotenv from "dotenv";
import Fastify from "fastify";
import { connectDB } from "./src/config/connect.js";
import { PORT } from "./src/config/config.js";
import { admin, buildAdminRouter } from "./src/config/setup.js";

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

    await buildAdminRouter(fastify);

    fastify.listen({ port: PORT }, (err, address) => {
        if (err) {
            fastify.log.error(err);
            process.exit(1);
        } else {
            console.log(
                `Server listening on ${address}${admin.options.rootPath}`
            );
        }
    });
};

// Run the server!
start();
