import type { RequestHandler} from "express";

import { AppError } from "../errors/index.js";

export const notFoundHandler: RequestHandler = (_req, _res, _next) => {
    _next(
        new AppError(
            `Ruta no encontrada: ${_req.method} ${_req.path}`,
            404,
            "Route_Not_Found"
        )
    );
};