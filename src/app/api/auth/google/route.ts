import { NextResponse } from "next/server";

export async function GET() {
  const id = process.env.GOOGLE_CLIENT_ID;
  const app = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  if (!id) {
    return NextResponse.json(
      { error: "Google authentication is not configured on this instance." },
      { status: 501 },
    );
  }
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", id);
  url.searchParams.set("redirect_uri", `${app}/api/auth/google/callback`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("prompt", "select_account");
  return NextResponse.redirect(url);
}
