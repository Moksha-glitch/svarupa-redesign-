import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC = new Set([
  "/",
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/explore",
]);

function secret() {
  return new TextEncoder().encode(
    process.env.AUTH_SECRET || "svarupa-dev-secret-change-in-production",
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("svarupa_session")?.value;
  let session: { sub?: string; onboardingCompleted?: boolean; role?: string } | null = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret());
      session = payload;
    } catch {
      session = null;
    }
  }

  const isPublic =
    PUBLIC.has(pathname) ||
    pathname.startsWith("/explore/") ||
    pathname.startsWith("/wisdom");

  if (!session && !isPublic && !pathname.startsWith("/api/")) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (session && (pathname === "/login" || pathname === "/signup")) {
    const url = req.nextUrl.clone();
    url.pathname = session.onboardingCompleted ? "/home" : "/onboarding";
    return NextResponse.redirect(url);
  }

  if (session && pathname === "/" ) {
    const url = req.nextUrl.clone();
    url.pathname = session.onboardingCompleted ? "/home" : "/onboarding";
    return NextResponse.redirect(url);
  }

  if (session && !session.onboardingCompleted && pathname !== "/onboarding" && !pathname.startsWith("/api/")) {
    if (!isPublic) {
      const url = req.nextUrl.clone();
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/admin") && session?.role !== "admin") {
    const url = req.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  const res = NextResponse.next();
  if (pathname.startsWith("/journal") || pathname.startsWith("/reflect") || pathname.startsWith("/me")) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|ico)$).*)"],
};
