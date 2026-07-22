import * as cheerio from "cheerio";

const EDITION_URL = "https://www.imprentanacional.go.cr/gaceta/";
const CONTENT_SELECTOR = "#ctl00_MainContentPlaceHolder_ContenidoGacetaDiv";
const DOCUMENT_ID_REGEX = /\(\s*(IN\d+)\s*\)/;

export type GacetaEntry = {
  section: string;
  subsection: string | null;
  entity: string | null;
  text: string;
  documentId: string | null;
};

export async function fetchTodayEdition(): Promise<{
  editionDate: string;
  entries: GacetaEntry[];
}> {
  const response = await fetch(EDITION_URL, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    },
  });

  if (!response.ok) {
    throw new Error(`La Gaceta respondió ${response.status}`);
  }

  const html = await response.text();
  const entries = parseEdition(html);

  return { editionDate: new Date().toISOString().slice(0, 10), entries };
}

export function parseEdition(html: string): GacetaEntry[] {
  const $ = cheerio.load(html);
  const root = $(CONTENT_SELECTOR);

  const entries: GacetaEntry[] = [];

  let section = "";
  let subsection: string | null = null;
  let entity: string | null = null;
  let buffer: string[] = [];

  const flush = () => {
    const text = buffer.join("\n").trim();
    if (text.length > 0) {
      const documentIdMatch = text.match(DOCUMENT_ID_REGEX);
      entries.push({
        section,
        subsection,
        entity,
        text,
        documentId: documentIdMatch ? documentIdMatch[1] : null,
      });
    }
    buffer = [];
  };

  root.find("h1, h2, h3, p").each((_, el) => {
    const tag = (el as { tagName?: string }).tagName?.toLowerCase();
    const content = $(el).text().replace(/\s+/g, " ").trim();

    if (!content) return;

    if (tag === "h1") {
      flush();
      section = content;
      subsection = null;
      entity = null;
    } else if (tag === "h2") {
      flush();
      subsection = content;
      entity = null;
    } else if (tag === "h3") {
      flush();
      entity = content;
    } else {
      buffer.push(content);
    }
  });
  flush();

  return entries;
}
