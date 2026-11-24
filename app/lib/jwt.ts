import jwt, { type SignOptions } from "jsonwebtoken";

const TOKEN_EXPIRATION_SECONDS = 60 * 60;

function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;

    if (!secret || Buffer.byteLength(secret, "utf8") < 32) {
        throw new Error(
            "JWT_SECRET debe contener al menos 32 bytes"
        );
    }

    return secret;
}

export function signAccessToken(userId: number): string {
    const options: SignOptions = {
        algorithm: "HS256",
        expiresIn: TOKEN_EXPIRATION_SECONDS,
        issuer: "webstore-api",
        audience: "webstore",
        subject: String(userId),
    };

    return jwt.sign({}, getJwtSecret(), options);
}

export function verifyAccessToken(token: string) {
    return jwt.verify(token, getJwtSecret(), {
        algorithms: ["HS256"],
        issuer: "webstore-api",
        audience: "webstore",
    });
}

export const ACCESS_TOKEN_EXPIRATION_SECONDS = TOKEN_EXPIRATION_SECONDS;
