/**
 * 限定公開ゲート。
 * 環境変数 SITE_ACCESS_PASSWORD が未設定のときはゲートを無効にする
 * （ローカル開発・CI で閉め出されないように）。
 */

export const GATE_COOKIE = "site_access";
export const GATE_MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 日

export function gatePassword(): string | null {
  const value = process.env.SITE_ACCESS_PASSWORD;
  return value && value.length > 0 ? value : null;
}

export function isGateEnabled(): boolean {
  return gatePassword() !== null;
}

const encoder = new TextEncoder();

async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/** HMAC-SHA256 で署名したトークンを作る。中身は有効期限だけ。 */
export async function createToken(secret: string, now = Date.now()): Promise<string> {
  const expiresAt = Math.floor(now / 1000) + GATE_MAX_AGE_SEC;
  const payload = String(expiresAt);
  return `${payload}.${await hmac(secret, payload)}`;
}

export async function verifyToken(
  secret: string,
  token: string | undefined | null,
  now = Date.now(),
): Promise<boolean> {
  if (!token) return false;
  const separator = token.lastIndexOf(".");
  if (separator <= 0) return false;
  const payload = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || expiresAt * 1000 <= now) return false;
  return timingSafeEqual(signature, await hmac(secret, payload));
}

export async function checkPassword(input: string): Promise<boolean> {
  const secret = gatePassword();
  if (!secret) return false;
  // 長さ差から総当たりのヒントが出ないよう、突き合わせは HMAC 同士で行う。
  const [a, b] = await Promise.all([hmac(secret, input), hmac(secret, secret)]);
  return timingSafeEqual(a, b);
}
