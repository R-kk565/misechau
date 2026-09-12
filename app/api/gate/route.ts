import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  GATE_COOKIE,
  GATE_MAX_AGE_SEC,
  checkPassword,
  createToken,
  gatePassword,
} from "@/lib/gate";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");
  const rawFrom = String(form.get("from") ?? "/");
  const from = rawFrom.startsWith("/") && !rawFrom.startsWith("//") ? rawFrom : "/";

  const secret = gatePassword();
  if (!secret) return NextResponse.redirect(new URL("/", request.url), 303);

  if (!(await checkPassword(password))) {
    const url = new URL("/gate", request.url);
    url.searchParams.set("from", from);
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url, 303);
  }

  const response = NextResponse.redirect(new URL(from, request.url), 303);
  response.cookies.set({
    name: GATE_COOKIE,
    value: await createToken(secret),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: GATE_MAX_AGE_SEC,
  });
  return response;
}
