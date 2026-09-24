import { NextResponse } from "next/server";
import { createUser, toPublicUser } from "@/lib/db";
import { signToken, SESSION_COOKIE, cookieOptions } from "@/lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    const { fullName, email, password } = body || {};

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { error: "Ad, e-poçt və şifrə tələb olunur." },
        { status: 400 },
      );
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: "Düzgün e-poçt ünvanı daxil edin." },
        { status: 400 },
      );
    }
    if (String(password).length < 6) {
      return NextResponse.json(
        { error: "Şifrə ən azı 6 simvoldan ibarət olmalıdır." },
        { status: 400 },
      );
    }

    const user = createUser({ fullName, email, password });
    const token = await signToken({ sub: user.id, role: user.role });

    const response = NextResponse.json({ user: toPublicUser(user) });
    response.cookies.set(SESSION_COOKIE, token, cookieOptions);
    return response;
  } catch (err) {
    if (err.message === "EMAIL_TAKEN") {
      return NextResponse.json(
        { error: "Bu e-poçt artıq qeydiyyatdan keçib." },
        { status: 409 },
      );
    }
    console.error("REGISTER_ERROR", err);
    return NextResponse.json(
      { error: "Server xətası. Yenidən cəhd edin." },
      { status: 500 },
    );
  }
}
