import type { RequestHandler } from "express";
import { AppError } from "../errors/index.js";

export const notFoundHandler: RequestHandler = (
    req,
    _res,
    next
) => {
    next(
        new AppError(
            `Ruta no encontrada: ${req.method} ${req.path}`,
            404,
            "ROUTE_NOT_FOUND"
        )
    );
};