import { randomUUID } from "node:crypto";
import pinoHttp from "pino-http";

import { logger } from "../lib/logger.js";

export const requestLogger = pinoHttp({
    logger,

    genReqId: (req, res) => {
        const requestId = randomUUID();
        res.setHeader("X-Request-ID", requestId);
        return requestId;
    },

    customProps: (req) => ({
        requestId: req.id,
    }),

    serializers: {
    req: (req) => ({
        method: req.method,
        url: req.url,
    }),

    res: (res) => ({
        statusCode: res.statusCode,
    }),
},
})