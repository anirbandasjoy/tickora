import crypto from "crypto";

export function randomToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("base64url");
}

export function sha256Hex(value: string): string {
  return crypto.createHash("sha256").update(value, "utf8").digest("hex");
}

export function timingSafeEqualHex(a: string, b: string): boolean {
  const ba = Buffer.from(a, "hex");
  const bb = Buffer.from(b, "hex");
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

export const API_KEY_PREFIX = "tk_live_";

export function generateApiKey(): {
  raw: string;
  prefix: string;
  hash: string;
} {
  const raw = `${API_KEY_PREFIX}${randomToken(32)}`;
  return { raw, prefix: raw.slice(0, 12), hash: sha256Hex(raw) };
}
