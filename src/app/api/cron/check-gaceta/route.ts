import { NextRequest, NextResponse } from "next/server";
import { fetchTodayEdition } from "@/lib/gaceta";
import { matchKeywords, type Keyword, type Match } from "@/lib/matching";
import { sendMatchEmail } from "@/lib/email";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

export const maxDuration = 60;

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "supabase not configured" }, { status: 500 });
  }

  const { data: keywordRows, error: keywordsError } = await supabase
    .from("keywords")
    .select("id, email, term")
    .eq("active", true);

  if (keywordsError) {
    return NextResponse.json({ error: keywordsError.message }, { status: 500 });
  }

  const keywords: Keyword[] = keywordRows ?? [];
  if (keywords.length === 0) {
    return NextResponse.json({ editionDate: null, matches: 0, emailsSent: 0 });
  }

  const { editionDate, entries } = await fetchTodayEdition();
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
    } catch {
      // Los matches quedan registrados igual; se puede reintentar el envío después.
    }
  }

  return NextResponse.json({ editionDate, entries: entries.length, matches: matches.length, emailsSent });
}
