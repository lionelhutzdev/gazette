import { createHmac, timingSafeEqual } from "crypto";

function sign(keywordId: string): string | null {
  const secret = process.env.UNSUBSCRIBE_SECRET;
  if (!secret) return null;
  return createHmac("sha256", secret).update(keywordId).digest("hex");
}

export function signKeywordId(keywordId: string): string {
  const token = sign(keywordId);
  if (!token) throw new Error("UNSUBSCRIBE_SECRET no está configurada");
  return token;
}

export function verifyKeywordId(keywordId: string, token: string | null): boolean {
  const expected = sign(keywordId);
  if (!expected || !token) return false;

  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(token);

  return (
    providedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(providedBuffer, expectedBuffer)
  );
}
