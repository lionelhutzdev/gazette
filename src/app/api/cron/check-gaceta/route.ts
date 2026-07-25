import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { fetchTodayEdition } from "@/lib/gaceta";
import { matchKeywords, type Keyword, type Match } from "@/lib/matching";
import { sendMatchEmail, sendAdminAlert } from "@/lib/email";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

export const maxDuration = 60;

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const provided = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);

  return (
    providedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(providedBuffer, expectedBuffer)
  );
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "supabase not configured" }, { status: 500 });
  }

  const logRun = async (fields: {
    editionDate?: string | null;
    entriesCount?: number;
    matchesCount?: number;
    emailsSent?: number;
    error?: string;
  }) => {
    try {
      await supabase.from("cron_runs").insert({
        edition_date: fields.editionDate ?? null,
        entries_count: fields.entriesCount ?? null,
        matches_count: fields.matchesCount ?? null,
        emails_sent: fields.emailsSent ?? null,
        error: fields.error ?? null,
      });
    } catch (error) {
      console.error("No se pudo registrar la corrida del cron", error);
    }
  };

  const { data: keywordRows, error: keywordsError } = await supabase
    .from("keywords")
    .select("id, email, term")
    .eq("active", true);

  if (keywordsError) {
    await logRun({ error: keywordsError.message });
    return NextResponse.json({ error: keywordsError.message }, { status: 500 });
  }

  const keywords: Keyword[] = keywordRows ?? [];
  if (keywords.length === 0) {
    await logRun({ editionDate: null, entriesCount: 0, matchesCount: 0, emailsSent: 0 });
    return NextResponse.json({ editionDate: null, matches: 0, emailsSent: 0 });
  }

  let editionDate: string;
  let entries: Awaited<ReturnType<typeof fetchTodayEdition>>["entries"];

  try {
    const edition = await fetchTodayEdition();
    editionDate = edition.editionDate;
    entries = edition.entries;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    console.error("Fallo al obtener la edición de La Gaceta", error);
    await logRun({ error: message });
    await sendAdminAlert(
      "Gazette: falló el scraper de La Gaceta",
      `El cron no pudo obtener la edición de hoy.\n\nError: ${message}`
    );
    return NextResponse.json({ error: message }, { status: 500 });
  }

  if (entries.length === 0) {
    console.error("La Gaceta devolvió 0 entradas: el scraper puede estar roto");
    await logRun({ editionDate, entriesCount: 0, matchesCount: 0, emailsSent: 0 });
    await sendAdminAlert(
      "Gazette: el scraper no encontró contenido",
      `fetchTodayEdition() devolvió 0 entradas para la edición del ${editionDate}. Es probable que imprentanacional.go.cr haya cambiado su estructura HTML.`
    );
    return NextResponse.json({ editionDate, entries: 0, matches: 0, emailsSent: 0 });
  }

  const { data: lastRun } = await supabase
    .from("cron_runs")
    .select("edition_date")
    .is("error", null)
    .order("ran_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const staleEdition = lastRun?.edition_date === editionDate;
  if (staleEdition) {
    console.warn(
      `La edición del ${editionDate} es la misma que en la corrida anterior: no hay edición nueva (fin de semana o feriado).`
    );
  }

  const matches = matchKeywords(entries, keywords);

  const newMatchesByKeyword = new Map<string, { rowId: string; match: Match }[]>();

  for (const match of matches) {
    const { data: insertedRow, error: insertError } = await supabase
      .from("matches")
      .insert({
        keyword_id: match.keywordId,
        document_id: match.documentId,
        edition_date: editionDate,
        section: match.section,
        snippet: match.snippet,
      })
      .select("id")
      .single();

    if (insertError || !insertedRow) {
      continue; // ya notificado (violación de unique) u otro error
    }

    const group = newMatchesByKeyword.get(match.keywordId) ?? [];
    group.push({ rowId: insertedRow.id, match });
    newMatchesByKeyword.set(match.keywordId, group);
  }

  let emailsSent = 0;

  for (const group of Array.from(newMatchesByKeyword.values())) {
    try {
      await sendMatchEmail(
        editionDate,
        group.map((item) => item.match)
      );
      emailsSent += 1;
      await supabase
        .from("matches")
        .update({ notified_at: new Date().toISOString() })
        .in(
          "id",
          group.map((item) => item.rowId)
        );
    } catch (error) {
      // Los matches quedan registrados igual; se puede reintentar el envío después.
      console.error("Fallo al enviar email de matches", error);
    }
  }

  await logRun({
    editionDate,
    entriesCount: entries.length,
    matchesCount: matches.length,
    emailsSent,
  });

  return NextResponse.json({
    editionDate,
    entries: entries.length,
    matches: matches.length,
    emailsSent,
    staleEdition,
  });
}
