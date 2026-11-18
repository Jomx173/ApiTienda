import type { Request, RequestHandler } from "express";
import { jwtVerify, SignJWT, type JWTPayload } from "jose";
import { AppError } from "../../src/errors/index.js";
import { env } from "../../src/config/index.js";
import { logger } from "../../src/lib/logger.js";

export interface AuthenticatedUser {
  id_usuario: number;
  id_cliente: number;
  usuario: string;
  rol: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export const authenticate: RequestHandler = async (
  req: AuthenticatedRequest,
  _res,
  next
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Token de acceso requerido", 401, "UNAUTHORIZED");
    }

    const token = authHeader.slice(7);

    const secret = new TextEncoder().encode(env.JWT_SECRET);

    const { payload } = await jwtVerify(token, secret, {
      clockTolerance: 30,
    });

    const p = payload as Record<string, unknown>;

    req.user = {
      id_usuario: Number(p.sub),
      id_cliente: Number(p.id_cliente),
      usuario: String(p.usuario),
      rol: String(p.rol),
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    logger.warn({ err: error }, "Autenticación fallida");
    next(new AppError("Token inválido o expirado", 401, "UNAUTHORIZED"));
  }
};

export const signToken = (payload: JWTPayload, expiresIn: string) => {
  const secret = new TextEncoder().encode(env.JWT_SECRET);

  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresIn)
    .sign(secret);
};
