import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "./db";

const COOKIE = "svarupa_session";
const WEEK = 60 * 60 * 24 * 30;

function secret() {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET || "svarupa-dev-secret-change-in-production",
  );
}

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  onboardingCompleted: boolean;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    onboardingCompleted: user.onboardingCompleted,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: WEEK,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    const user = await db.user.findUnique({
      where: { id: String(payload.sub) },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        onboardingCompleted: true,
        deletedAt: true,
      },
    });
    if (!user || user.deletedAt) return null;
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      onboardingCompleted: user.onboardingCompleted,
    };
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getSession();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export function toSessionUser(user: {
  id: string;
  email: string;
  name: string | null;
  role: string;
  onboardingCompleted: boolean;
}): SessionUser {
  return user;
}
