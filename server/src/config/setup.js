import AdminJS from "adminjs";
import AdminJSFastify from "@adminjs/fastify";
import * as AdminJSMongoose from "@adminjs/mongoose";
import { Admin, Customer, DeliveryPartner } from "../models/user.model.js";
import { Branch } from "../models/branch.model.js";
import { authenticate, COOKIE_SECRET, sessionStore } from "./config.js";
import { dark, light } from "@adminjs/themes";
import Product from "../models/product.model.js";
import Category from "../models/category,model.js";
import Order from "../models/order.model.js";
import Counter from "../models/counter.model.js";

AdminJS.registerAdapter(AdminJSMongoose);

export const admin = new AdminJS({
    resources: [
        {
            resource: Customer,
            options: {
                listProperties: ["phone", "isActicated", "role"],
                filterProperties: ["phone", "role"],
            },
        },
        {
            resource: DeliveryPartner,
            options: {
                listProperties: ["email", "isActicated", "role"],
                filterProperties: ["email", "role"],
            },
        },
        {
            resource: Admin,
            options: {
                listProperties: ["email", "isActicated", "role"],
                filterProperties: ["email", "role"],
            },
        },
        {
            resource: Branch,
        },
        {
            resource: Product,
        },
        {
            resource: Category,
        },
        {
            resource: Order,
        },
        {
            resource: Counter,
        },
    ],
    branding: {
        companyName: "Blinkit",
        withMadeWithLove: false,
    },
    defaultTheme: dark.id,
    availableThemes: [dark, light],
    rootPath: "/admin",
});

export const buildAdminRouter = async (app) => {
    await AdminJSFastify.buildAuthenticatedRouter(
        admin,
        {
            authenticate,
            cookiePassword: COOKIE_SECRET,
            cookieName: "adminjs",
        },
        app,
        {
            store: sessionStore,
            saveUnintaialized: true,
            secret: COOKIE_SECRET,
            cookie: {
                httpOnly: process.env.NODE_ENV === "production",
                secure: process.env.NODE_ENV === "production",
            },
        }
    );
};
