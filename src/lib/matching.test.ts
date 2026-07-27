import { test } from "node:test";
import assert from "node:assert/strict";
import { normalize, matchKeywords } from "./matching";
import type { GacetaEntry } from "./gaceta";

function entry(overrides: Partial<GacetaEntry>): GacetaEntry {
  return {
    section: "AVISOS",
    subsection: null,
    entity: null,
    text: "",
    documentId: null,
    sourceUrl: null,
    ...overrides,
  };
}

test("normalize ignora acentos y mayúsculas", () => {
  assert.equal(normalize("Fútbol"), normalize("FUTBOL"));
  assert.equal(normalize("Ñoño"), normalize("noNO"));
});

test("matchKeywords encuentra frases de varias palabras sin importar acentos", () => {
  const entries = [
    entry({
      text: "El Banco Nacional de Costa Rica informa sobre un cambio en la junta directiva.",
      documentId: "IN202601000001",
      sourceUrl: "https://example.com/edicion.pdf",
    }),
  ];

  const matches = matchKeywords(entries, [
    { id: "kw1", email: "a@b.com", term: "banco nácional" },
  ]);

  assert.equal(matches.length, 1);
  assert.equal(matches[0].documentId, "IN202601000001");
  assert.equal(matches[0].sourceUrl, "https://example.com/edicion.pdf");
  assert.match(matches[0].snippet, /Banco Nacional/);
});

test("matchKeywords no encuentra keywords que no aparecen en el texto", () => {
  const entries = [entry({ text: "Texto sin relación con ninguna keyword." })];

  const matches = matchKeywords(entries, [
    { id: "kw1", email: "a@b.com", term: "Empresa Inexistente S.A." },
  ]);

  assert.equal(matches.length, 0);
});

test("matchKeywords evalúa cada keyword contra cada entrada de forma independiente", () => {
  const entries = [
    entry({ text: "Mención de Acueductos Rurales." }),
    entry({ text: "Mención de Ferretería Central." }),
  ];

  const matches = matchKeywords(entries, [
    { id: "kw1", email: "a@b.com", term: "Acueductos" },
    { id: "kw2", email: "a@b.com", term: "Ferretería" },
  ]);

  assert.equal(matches.length, 2);
  assert.equal(matches[0].keywordId, "kw1");
  assert.equal(matches[1].keywordId, "kw2");
});
