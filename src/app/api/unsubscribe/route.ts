import { NextRequest, NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import { verifyKeywordId } from "@/lib/unsubscribe-token";
import { clientIp, isRateLimited } from "@/lib/rate-limit";

const RATE_LIMIT = 20;
const RATE_LIMIT_WINDOW_MS = 60_000;

function page(message: string) {
  return new NextResponse(
    `<!doctype html><html><head><meta charset="utf-8" /><title>Gazette</title></head>` +
      `<body style="font-family:sans-serif;max-width:32rem;margin:4rem auto;padding:0 1rem;">` +
      `<p>${message}</p></body></html>`,
    { headers: { "content-type": "text/html; charset=utf-8" } }
  );
}

export async function GET(request: NextRequest) {
  const ip = clientIp(request.headers);
  if (isRateLimited(`unsubscribe:${ip}`, RATE_LIMIT, RATE_LIMIT_WINDOW_MS)) {
    return page("Demasiados intentos. Probá de nuevo en un rato.");
  }

  const keywordId = request.nextUrl.searchParams.get("keyword");
  const token = request.nextUrl.searchParams.get("token");

  if (!keywordId) {
    return page("Falta el parámetro de la keyword.");
  }

  if (!verifyKeywordId(keywordId, token)) {
    Sentry.captureMessage("Intento de unsubscribe con token inválido", {
      level: "warning",
      tags: { flow: "unsubscribe" },
      extra: { keywordId },
    });
    return page("Link inválido o vencido.");
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return page("El servicio no está disponible en este momento.");
  }

  await supabase.from("keywords").update({ active: false }).eq("id", keywordId);

  return page("Listo. Ya no vas a recibir más alertas de esta keyword.");
}
