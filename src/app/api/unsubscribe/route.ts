import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

function page(message: string) {
  return new NextResponse(
    `<!doctype html><html><head><meta charset="utf-8" /><title>Gazette</title></head>` +
      `<body style="font-family:sans-serif;max-width:32rem;margin:4rem auto;padding:0 1rem;">` +
      `<p>${message}</p></body></html>`,
    { headers: { "content-type": "text/html; charset=utf-8" } }
  );
}

export async function GET(request: NextRequest) {
  const keywordId = request.nextUrl.searchParams.get("keyword");

  if (!keywordId) {
    return page("Falta el parámetro de la keyword.");
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return page("El servicio no está disponible en este momento.");
  }

  await supabase.from("keywords").update({ active: false }).eq("id", keywordId);

  return page("Listo. Ya no vas a recibir más alertas de esta keyword.");
}
