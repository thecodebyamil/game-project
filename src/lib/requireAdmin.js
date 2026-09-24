import { cookies } from "next/headers";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth";
import { findUserById } from "@/lib/db";

// Returns the admin user object, or null if the caller isn't an authenticated admin.
export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload) return null;

  const user = findUserById(payload.sub);
  if (!user || user.banned || user.role !== "admin") return null;

  return user;
}
