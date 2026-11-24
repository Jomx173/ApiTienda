import {rateLimit} from 'express-rate-limit';
import {env} from '../config/index.js';

export const ApiRateLimiter = rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,

    limit: env.RATE_LIMIT_MAX,

    standardHeaders: "draft-8",

    legacyHeaders: false,

    ipv6Subnet: 56,

    skip: (req) => req.path === "/health",

    handler: (req, res) => {
        req.log.warn(
            {
                requestId: req.id,
                ip: req.ip,
                path: req.path,
            },
            "Rate limit exceeded"
        );
        res.status(429).json({
            success: false,
            requestId: req.id,
            error: {
                code: "RATE_LIMIT_EXCEEDED",
                message: "Demasiadfas solicitudes.Inténtelo de nuevo más tarde.",
            },
        });
    },
});
