import type { ErrorRequestHandler } from "express";
import { Prisma } from "../../generated/prisma/client";
import { ZodError } from "zod";
import {logger} from "../lib/logger.js"

import { env } from "../config/index.js";
import { AppError } from "../errors/index.js";
import { error } from "node:console";

export const errorHandler: ErrorRequestHandler = (
    error: unknown,
    req,
    res,
    _next
) => {
    if (res.headersSent) {
        _next(error);
        return;
    }

    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            success: false,
            requestId: req.id,
            error: {
                code: error.code,
                message: error.message,
                ...(error.details !== undefined && {
                    details: error.details,
                }),
            },
        });
    return;
}

if (error instanceof ZodError) {
    res.status(400).json({
        success: false,
        requestId: req.id,
        error: {
            code: "VALIDATION_ERROR",
            message: "Los datos envidados no son válidos",
            details: error.issues.map((issue) => ({
                path: issue.path.join("."),
                message: issue.message,
            })),
        },
    });
    return;
}

if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const knownErrors: Record<
        string,
        { statusCode: number; code: string; message: string }
    > = {
        P2002: {
            statusCode: 409,
            code: "UNIQUE_CONSTRAINT_VIOLATION",
            message: "El registro ya existe",
        },
        P2003: {
            statusCode: 400,
            code: "FOREIGN_KEY_CONSTRAINT_ERROR0",
            message: "La operación viola una relacion existente",
        },
        P2025: {
            statusCode: 404,
            code: "RECORD_NOT_FOUND",
            message: "El registro solicitado no existe",
        },
    };

    const known = knownErrors[error.code];

    if (known) {
        res.status(known.statusCode).json({
            success: false,
            requestId: req.id,
            error: {
                code: known.code,
                message: known.message,
            },
        });
        return;
    }
}

const log = req.log ?? logger;

log.error({err: error }, "Error no encontardo");

res.status(500).json({
    success: false,
    requestId: req.id,
    error: {
        code: "INTERNAL_SERVER_ERROR",
        message: env.NODE_ENV === "production"
         ? "Ha ocurrido un error interno"
          : error instanceof Error 
          ? error.message 
          : "Error desconocido",
    },
});
}   