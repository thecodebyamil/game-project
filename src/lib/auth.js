import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "gx_session";
const ALG = "HS256";
const EXPIRES_IN = "7d";

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET .env.local faylında təyin olunmayıb. Zəhmət olmasa .env.example-a baxın.",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(EXPIRES_IN)
    .sign(getSecretKey());
}

export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = COOKIE_NAME;

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 gün
};
