import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth";
import { findUserById, toPublicUser } from "@/lib/db";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ user: null });
  }

  const user = findUserById(payload.sub);
  if (!user || user.banned) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({ user: toPublicUser(user) });
}
