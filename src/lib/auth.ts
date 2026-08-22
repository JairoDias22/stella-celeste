import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const SESSION_SECRET = process.env.SESSION_SECRET;

function getSecretKey() {
  if (!SESSION_SECRET) {
    throw new Error(
      "SESSION_SECRET não está definida no .env. Gere uma string aleatória longa e adicione lá."
    );
  }
  return new TextEncoder().encode(SESSION_SECRET);
}

export type SessionPayload = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "cliente";
};

const ADMIN_COOKIE = "stella_admin_session";
const CLIENTE_COOKIE = "stella_cliente_session";
const SESSION_DURATION = "7d";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

async function signSession(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getSecretKey());
}

async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// ---- Admin ----

export async function createAdminSession(payload: SessionPayload) {
  const token = await signSession(payload);
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

// ---- Cliente ----

export async function createClienteSession(payload: SessionPayload) {
  const token = await signSession(payload);
  const cookieStore = await cookies();
  cookieStore.set(CLIENTE_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getClienteSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CLIENTE_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function destroyClienteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(CLIENTE_COOKIE);
}

export { ADMIN_COOKIE, CLIENTE_COOKIE };
export { verifySessionToken };
