import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const app = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  if (!code || !process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.redirect(`${app}/login?error=google`);
  }
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${app}/api/auth/google/callback`,
      grant_type: "authorization_code",
    }),
  });
  const tokens = await tokenRes.json();
  if (!tokens.access_token) return NextResponse.redirect(`${app}/login?error=google`);
  const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  const profile = await profileRes.json();
  if (!profile.email) return NextResponse.redirect(`${app}/login?error=google`);

  let user = await db.user.findFirst({
    where: { OR: [{ googleId: profile.id }, { email: profile.email }] },
  });
  if (!user) {
    user = await db.user.create({
      data: {
        email: profile.email,
        name: profile.name,
        googleId: profile.id,
        image: profile.picture,
        emailVerified: new Date(),
        preferences: { create: {} },
      },
    });
  } else if (!user.googleId) {
    user = await db.user.update({
      where: { id: user.id },
      data: { googleId: profile.id, image: profile.picture || user.image },
    });
  }

  await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    onboardingCompleted: user.onboardingCompleted,
  });
  return NextResponse.redirect(`${app}${user.onboardingCompleted ? "/home" : "/onboarding"}`);
}
