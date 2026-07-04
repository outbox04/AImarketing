import { NextRequest, NextResponse } from "next/server";
import { canAccessHref } from "@/lib/auth/access";
import { authCookieName } from "@/lib/auth/constants";
import { findEmployeeByCode, sanitizeEmployee } from "@/lib/auth/users";

const publicPaths = ["/login", "/api/auth/login"];

function isPublicPath(pathname: string) {
  return publicPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const employeeCode = request.cookies.get(authCookieName)?.value;
  const employee = employeeCode ? findEmployeeByCode(employeeCode) : null;
  const user = employee ? sanitizeEmployee(employee) : null;

  if (pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!user && !isPublicPath(pathname)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && !pathname.startsWith("/api/") && !canAccessHref(user, pathname) && pathname !== "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.svg|media).*)"]
};
