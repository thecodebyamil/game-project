import { NextResponse } from "next/server";
import { verifyToken, SESSION_COOKIE } from "@/lib/auth";

export async function proxy(request) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const payload = token ? await verifyToken(token) : null;

  const isAdminArea = request.nextUrl.pathname.startsWith("/admin");

  if (isAdminArea) {
    if (!payload) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    if (payload.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
