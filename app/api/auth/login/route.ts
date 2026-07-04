import { NextRequest, NextResponse } from "next/server";
import { authCookieName } from "@/lib/auth/constants";
import { authenticateEmployee } from "@/lib/auth/users";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { employeeCode?: string; password?: string };
  const user = authenticateEmployee(body.employeeCode ?? "", body.password ?? "");

  if (!user) {
    return NextResponse.json({ ok: false, message: "Mã nhân viên hoặc mật khẩu không đúng." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, user });
  response.cookies.set(authCookieName, user.employeeCode, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12
  });

  return response;
}
