import type { CorsOptions } from "cors";
import { env } from "./index.js";

const allowedOrigins = new Set(
    env.CORS_ORIGIND
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
);

export const corsOption: CorsOptions = {
    origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin)) {
            callback(null, true);
            return;
        }

        callback(null, false);
    },

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],

    allowedHeaders: [
        "Content-Type",
        "Authrization",
    ],

    exposedHeaders: [
        "X-Request-ID",
        "RateLimit",
        "RateLimit-Policy",
        "Retry-After",
    ],

    credentials: false,

    optionsSuccessStatus: 204,
};