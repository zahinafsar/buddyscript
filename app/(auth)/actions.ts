"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, destroySession } from "@/lib/auth";

export type AuthFormState = {
  error: string | null;
  values?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
};

function submittedValues(formData: FormData): AuthFormState["values"] {
  return {
    firstName: String(formData.get("firstName") ?? ""),
    lastName: String(formData.get("lastName") ?? ""),
    email: String(formData.get("email") ?? ""),
  };
}

const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required."),
    lastName: z.string().trim().min(1, "Last name is required."),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .pipe(z.email("Please enter a valid email address.")),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Invalid email or password.")),
  password: z.string().min(1, "Invalid email or password."),
});

export async function register(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const values = submittedValues(formData);

  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, values };
  }
  const { firstName, lastName, email, password } = parsed.data;

  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
    columns: { id: true },
  });
  if (existing) {
    return { error: "Email already in use.", values };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [user] = await db
    .insert(users)
    .values({ firstName, lastName, email, passwordHash })
    .returning();

  await createSession(user);
  redirect("/feed");
}

export async function login(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const values = submittedValues(formData);

  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: "Invalid email or password.", values };
  }
  const { email, password } = parsed.data;

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (!user) {
    return { error: "Invalid email or password.", values };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { error: "Invalid email or password.", values };
  }

  await createSession(user);
  redirect("/feed");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}
