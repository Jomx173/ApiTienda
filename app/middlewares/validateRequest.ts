import type { RequestHandler } from "express";
import { z } from "zod";

type RequestSchemas = {
    body?: z.ZodType;
    params?: z.ZodType;
    query?: z.ZodType;
};

export const validateRequest = (
    schemas: RequestSchemas
): RequestHandler => {
    return (req, res, next) => {
        try {
            const validated: Record<string, unknown> = {};

            if (schemas.body) {
                validated.body = schemas.body.parse(req.body);
            }

            if (schemas.params) {
                validated.params = schemas.params.parse(req.params);
            }

            if (schemas.query) {
                validated.query = schemas.query.parse(req.query);
            }
            res.locals.validated = validated;
            // Express 5 expone res.query y mantiene 
            // un getters
            //guardamos los valores validados en res.locals,
            // sin sobreescribir las propiedades de Express

            next();
        } catch (error) {
            next(error);
        }
    };
};