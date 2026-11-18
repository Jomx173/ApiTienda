import express from "express";
import cors from "cors";
import helmet from "helmet";
//import authRouter from "./routes/authRouter.js";
//import userRouter from "./routes/userRouter.js";

import {requestLogger} from "./middlewares/requestLogger.js";
import {errorHandler} from "./middlewares/errorHandler.js";
import {notFoundHandler } from "./middlewares/notFoundhandler.js";
import { corsOptions } from "./config/cors.js";
import {ApiRateLimiter} from "./middlewares/rateLimiter.js";
import {env} from "./config/index.js";

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(requestLogger);
app.use(ApiRateLimiter);
app.use(express.json({ limit: "1mb" }));


app.get("/health", (_req, res) => {
    res.status(200).json({
    status: "ok",
    service: "api",
    timestamp: new Date().toISOString(),
    });
});
app.set(
    "trust proxy",
    env.TRUST_PROXY === "loopback" ? "loopback" : false
);
app.get("/debug/ip", (req, res) => {
    res.json({
        ip: req.ip,
        ips: req.ips,
        trustProxy: req.app.get("trust proxy"),
        forwardedFor: req.headers["x-forwarded-for"] ?? null,
    });
});
// Las rutas de las Api se registraan aqui.
//app.use("/api/auth", authRouter);
//app.use("/api/users", userRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;