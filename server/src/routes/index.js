import { authRoutes } from "./auth.routes.js";

const prefix = "/api";

export const registerRoutes = async (fastify) => {
    fastify.register(authRoutes, { prefix });
};
