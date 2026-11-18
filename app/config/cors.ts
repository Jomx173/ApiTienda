import type { CorsOptions } from "cors";
import { env } from "./index.js";

const allowedOringins = new Set(
    env.CORS_ORIGIN
        .split(",")
        .map((origin) => origin.trim())
        .filter (Boolean)
);

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOringins.has(origin)) {
            callback(null, true);
            return; 
        }
            callback(null, false);
    },
    methods: ["GET", "POST", "PUT","PATCH" ,"DELETE"],

    allowedHeaders: [
        "Content-Type", 
        "Authorization"
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