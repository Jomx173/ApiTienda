import type { RequestHandler } from "express";
import { rbacService } from "../services/rbacService.js";

export function requirePermission(
  permission: string
): RequestHandler {
  if (!permission.trim()) {
    throw new Error(
      "requirePermission necesita un permiso válido"
    );
  }

  return async (_req, res, next) => {
    try {
      const userId = res.locals.authenticatedUserId;

      if (
        typeof userId !== "number" ||
        !Number.isSafeInteger(userId) ||
        userId <= 0
      ) {
        res.status(401).json({
          success: false,
          requestId: res.req.id,
          error: {
            code: "UNAUTHORIZED",
            message: "Autenticación requerida",
          },
        });

        return;
      }

      const allowed = await rbacService.hasPermission(
        userId,
        permission
      );

      if (!allowed) {
        res.status(403).json({
          success: false,
          requestId: res.req.id,
          error: {
            code: "FORBIDDEN",
            message:
              "No tienes permisos para esta operación",
          },
        });

        return;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}