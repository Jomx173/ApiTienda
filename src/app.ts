import express from "express";
import cors from "cors";
import helmet from "helmet";
//import authRouter from "./routes/authRouter.js";
//import userRouter from "./routes/userRouter.js";

import { requestLogger } from "./middlewares/requestLogger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { corsOptions } from "./config/cors.js";
import { ApiRateLimiter } from "./middlewares/rateLimiter.js";
import { env } from "./config/index.js";

const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(ApiRateLimiter);

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
// LAS RUTAS DE LA API SE REGISTRAN AQUI
// app.use("/api/auth", authRouter);
//app.use("/api/users", userRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;