import type { RequestHandler } from "express";
import { AppError } from "../errors/AppError.js";
import { verifyAccessToken } from "../lib/jwt.js";
import { prisma } from "../lib/prisma.js";

// Sustituye el middleware anterior: comprueba estado en DB en cada petición protegida.
export const authenticate: RequestHandler = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization)
      throw new AppError(
        "Token de autenticación requerido",
        401,
        "AUTH_TOKEN_REQUIRED"
      );

    const match = /^Bearer ([^\s]+)$/i.exec(authorization);

    if (!match)
      throw new AppError(
        "Formato de autorización inválido",
        401,
        "AUTH_TOKEN_INVALID"
      );

    let payload: ReturnType<typeof verifyAccessToken>;

    try {
      payload = verifyAccessToken(match[1]!);
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "TokenExpiredError"
      )
        throw new AppError(
          "El token ha expirado",
          401,
          "AUTH_TOKEN_EXPIRED"
        );

      if (
        error instanceof Error &&
        (
          error.name === "JsonWebTokenError" ||
          error.name === "NotBeforeError" ||
          error instanceof SyntaxError
        )
      )
        throw new AppError(
          "Token de autenticación inválido",
          401,
          "AUTH_TOKEN_INVALID"
        );

      throw error;
    }

    if (
      typeof payload === "string" ||
      typeof payload.sub !== "string" ||
      !/^[1-9]\d*$/.test(payload.sub)
    )
      throw new AppError(
        "Token de autenticación inválido",
        401,
        "AUTH_TOKEN_INVALID"
      );

    const userId = Number(payload.sub);

    if (!Number.isSafeInteger(userId))
      throw new AppError(
        "Identificador de usuario inválido",
        401,
        "AUTH_TOKEN_INVALID"
      );

    const user =
      (await (prisma as any).users?.findUnique?.({
        where: { id: userId },
        select: { status: true },
      })) ??
      (await prisma.usuarios.findUnique({
        where: { id_usuario: userId },
        select: { estado: true },
      }));

    const isAvailable =
      (user && "status" in user && (user as { status?: string }).status === "active") ||
      (user && "estado" in user && (user as { estado?: boolean | null }).estado === true);

    if (!user || !isAvailable)
      throw new AppError(
        "Usuario inactivo o inexistente",
        401,
        "USER_NOT_AVAILABLE"
      );

    res.locals.auth = { userId };

    // Compatibilidad con requirePermission actual
    res.locals.authenticatedUserId = userId;

    next();

  } catch (error) {
    next(error);
  }
};
