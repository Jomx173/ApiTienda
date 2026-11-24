import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce
    .number()
    .int()
    .min(1)
    .max(65535)
    .default(3000),

  DATABASE_URL: z
    .url()
    .refine(
      (value) => {
        const protocol = new URL(value).protocol;
        return ["postgresql:", "postgres:"].includes(protocol);
      },
      "DATABASE_URL debe utilizar PostgreSQL"
    ),

  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET debe tener al menos 32 caracteres")
    .optional(),

  CORS_ORIGIN: z.string().default("http://localhost:5173"),

  TRUST_PROXY: z.enum(["none", "loopback"]).default("none"),

  RATE_LIMIT_WINDOW_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(900000),

  RATE_LIMIT_MAX: z.coerce
    .number()
    .int()
    .positive()
    .default(100),

  RATELIMIT_WINDOW_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(900000),

  RATELIMIT_MAX: z.coerce
    .number()
    .int()
    .positive()
    .default(100),
});

const rawEnv =
  (globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  }).process?.env ?? {};

const envToParse = {
  ...rawEnv,
  RATELIMIT_WINDOW_MS:
    rawEnv.RATELIMIT_WINDOW_MS ?? rawEnv.RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_WINDOW_MS:
    rawEnv.RATE_LIMIT_WINDOW_MS ?? rawEnv.RATELIMIT_WINDOW_MS,
  RATELIMIT_MAX: rawEnv.RATELIMIT_MAX ?? rawEnv.RATE_LIMIT_MAX,
  RATE_LIMIT_MAX: rawEnv.RATE_LIMIT_MAX ?? rawEnv.RATELIMIT_MAX,
  CORS_ORIGIN: rawEnv.CORS_ORIGIN ?? rawEnv.CORS_ORIGINS,
};

const result = envSchema.safeParse(envToParse);

if (!result.success) {
  console.error("Configuración de entorno inválida:");

  for (const issue of result.error.issues) {
    console.error(
      `- ${issue.path.join(".")}: ${issue.message}`
    );
  }

  throw new Error("No se pudo validar la configuración");
}

export const env = Object.freeze(result.data);

export type Env = typeof env;
