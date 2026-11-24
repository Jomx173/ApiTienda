import type { CorsOptions } from "cors";
import { env } from "./index.js";

const allowedOrigins = new Set(
    env.CORS_ORIGIN
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
);

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.has(origin)) {
            callback(null, true);
            return;
        }
        callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],

    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ],

    exposedHeaders: [
        "Content-Range",
        "X-Content-Range",
        "X-Request-Id",
        "RateLimit-Limit",
        "RateLimit-Remaining",
        "RateLimit-Reset",
    ],

    credentials: false,

    optionsSuccessStatus: 204,
};
