import type { ErrorRequestHandler } from "express";
import { Prisma } from "../../generated/prisma/client.js";
import { ZodError } from "zod";
import { logger } from "../lib/logger.js";

import { env } from "../config/index.js";
import { AppError } from "../errors/index.js";

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  req,
  res,
  _next
) => {
  const requestId = (req as typeof req & { id?: string }).id;

  if (res.headersSent) {
    _next(error);
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      requestId,
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
      requestId,
      error: {
        code: "VALIDATION_ERROR",
        message: "Los datos enviados no son válidos",
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
      { status: number; code: string; message: string }
    > = {
      P2002: {
        status: 409,
        code: "UNIQUE_CONSTRAINT_ERROR",
        message: "El registro ya existe",
      },
      P2003: {
        status: 409,
        code: "FOREIGN_KEY_CONSTRAINT_ERROR",
        message: "La operación viola una relación existente",
      },
      P2025: {
        status: 404,
        code: "RESOURCE_NOT_FOUND",
        message: "El registro solicitado no existe",
      },
    };

    const known = knownErrors[error.code];

    if (known) {
      res.status(known.status).json({
        success: false,
        requestId,
        error: {
          code: known.code,
          message: known.message,
        },
      });
      return;
    }
  }

  const log = (req as typeof req & { log?: typeof logger }).log ?? logger;

  log.error({ err: error }, "Error no controlado");

  res.status(500).json({
    success: false,
    requestId,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message:
        env.NODE_ENV === "production"
          ? "Ha ocurrido un error interno"
          : error instanceof Error
            ? error.message
            : "Ha ocurrido un error interno",
    },
  });
};