import { test } from "node:test";
import assert from "node:assert/strict";
import { parseEdition } from "./gaceta";

const SAMPLE_HTML = `
<html><body>
<div id="ctl00_MainContentPlaceHolder_ContenidoGacetaDiv">
  <h1>AVISOS</h1>
  <h2>JUSTICIA Y PAZ</h2>
  <h3>Julián Pérez</h3>
  <p>Se solicita la inscripción de una marca de comercio ( IN202601090383 ).</p>
</div>
</body></html>
`;

test("parseEdition extrae section/subsection/entity/documentId de la estructura real", () => {
  const entries = parseEdition(SAMPLE_HTML, "https://example.com/edicion.pdf");

  assert.equal(entries.length, 1);
  assert.equal(entries[0].section, "AVISOS");
  assert.equal(entries[0].subsection, "JUSTICIA Y PAZ");
  assert.equal(entries[0].entity, "Julián Pérez");
  assert.equal(entries[0].documentId, "IN202601090383");
  assert.equal(entries[0].sourceUrl, "https://example.com/edicion.pdf");
});

test("parseEdition ignora contenido fuera del selector de la Gaceta", () => {
  const html = `<div id="otro-div">no debería aparecer<h1>Otra cosa</h1><p>texto</p></div>`;
  const entries = parseEdition(html);
  assert.equal(entries.length, 0);
});

test("parseEdition separa entradas nuevas cuando cambia la sección", () => {
  const html = `
    <div id="ctl00_MainContentPlaceHolder_ContenidoGacetaDiv">
      <h1>PRIMERA SECCIÓN</h1>
      <p>Texto uno.</p>
      <h1>SEGUNDA SECCIÓN</h1>
      <p>Texto dos.</p>
    </div>
  `;
  const entries = parseEdition(html);
  assert.equal(entries.length, 2);
  assert.equal(entries[0].section, "PRIMERA SECCIÓN");
  assert.equal(entries[1].section, "SEGUNDA SECCIÓN");
});
