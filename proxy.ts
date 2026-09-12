/**
 * Next.js 16 では middleware.ts は proxy.ts にリネームされている（機能は同じ、既定は Node.js ランタイム）。
 * 画像への直リンクも含めて保護する。
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { GATE_COOKIE, gatePassword, verifyToken } from "@/lib/gate";

export const config = {
  // _next/static（ゲート画面自身の CSS/JS）と favicon だけ通す。
  // /photos/* や /_next/image は通さない＝画像への直リンクも保護される。
  matcher: ["/((?!_next/static|favicon.ico).*)"],
};

export async function proxy(request: NextRequest) {
  const secret = gatePassword();
  if (!secret) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  if (pathname === "/gate" || pathname === "/api/gate") return NextResponse.next();

  const token = request.cookies.get(GATE_COOKIE)?.value;
  if (await verifyToken(secret, token)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/gate";
  url.search = "";
  url.searchParams.set("from", `${pathname}${search}`);
  return NextResponse.redirect(url);
}
