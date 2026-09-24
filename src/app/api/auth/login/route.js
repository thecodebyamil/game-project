import { NextResponse } from "next/server";
import { findUserByEmail, verifyPassword, toPublicUser } from "@/lib/db";
import { signToken, SESSION_COOKIE, cookieOptions } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-poçt və şifrə tələb olunur." },
        { status: 400 },
      );
    }

    const user = findUserByEmail(email);
    if (!user || !verifyPassword(password, user.password)) {
      return NextResponse.json(
        { error: "E-poçt və ya şifrə yanlışdır." },
        { status: 401 },
      );
    }

    if (user.banned) {
      return NextResponse.json(
        { error: "Bu hesab bloklanıb. Dəstək xidməti ilə əlaqə saxlayın." },
        { status: 403 },
      );
    }

    const token = await signToken({ sub: user.id, role: user.role });

    const response = NextResponse.json({ user: toPublicUser(user) });
    response.cookies.set(SESSION_COOKIE, token, cookieOptions);
    return response;
  } catch (err) {
    console.error("LOGIN_ERROR", err);
    return NextResponse.json(
      { error: "Server xətası. Yenidən cəhd edin." },
      { status: 500 },
    );
  }
}
