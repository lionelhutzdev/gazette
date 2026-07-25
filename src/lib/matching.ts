import type { GacetaEntry } from "@/lib/gaceta";

export type Keyword = {
  id: string;
  email: string;
  term: string;
};

export type Match = {
  keywordId: string;
  email: string;
  term: string;
  section: string;
  entity: string | null;
  documentId: string | null;
  snippet: string;
  sourceUrl: string | null;
};

const SNIPPET_RADIUS = 220;
const COMBINING_DIACRITICS_START = String.fromCharCode(0x0300);
const COMBINING_DIACRITICS_END = String.fromCharCode(0x036f);
const COMBINING_DIACRITICS = new RegExp(
  `[${COMBINING_DIACRITICS_START}-${COMBINING_DIACRITICS_END}]`,
  "g"
);

function normalize(value: string): string {
  return value.normalize("NFD").replace(COMBINING_DIACRITICS, "").toLowerCase();
}

function buildSnippet(text: string, matchIndex: number, matchLength: number): string {
  const start = Math.max(0, matchIndex - SNIPPET_RADIUS);
  const end = Math.min(text.length, matchIndex + matchLength + SNIPPET_RADIUS);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < text.length ? "…" : "";
  return `${prefix}${text.slice(start, end).trim()}${suffix}`;
}

export function matchKeywords(entries: GacetaEntry[], keywords: Keyword[]): Match[] {
  const matches: Match[] = [];

  for (const entry of entries) {
    const normalizedText = normalize(entry.text);

    for (const keyword of keywords) {
      const normalizedTerm = normalize(keyword.term);
      if (!normalizedTerm) continue;

      const matchIndex = normalizedText.indexOf(normalizedTerm);
      if (matchIndex === -1) continue;

      matches.push({
        keywordId: keyword.id,
        email: keyword.email,
        term: keyword.term,
        section: entry.section,
        entity: entry.entity,
        documentId: entry.documentId,
        snippet: buildSnippet(entry.text, matchIndex, normalizedTerm.length),
        sourceUrl: entry.sourceUrl,
      });
    }
  }

  return matches;
}
