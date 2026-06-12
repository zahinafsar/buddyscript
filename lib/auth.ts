import "server-only";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, type User } from "@/db/schema";
import {
  SESSION_COOKIE,
  SESSION_DURATION_SECONDS,
  signToken,
  verifyToken,
} from "./session";

export async function createSession(user: User) {
  const token = await signToken({ sub: String(user.id), email: user.email });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUser(): Promise<Omit<User, "passwordHash"> | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  const user = await db.query.users.findFirst({
    where: eq(users.id, Number(payload.sub)),
    columns: { passwordHash: false },
  });
  return user ?? null;
}
