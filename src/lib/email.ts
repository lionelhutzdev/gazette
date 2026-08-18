import { Resend } from "resend";
import type { Match } from "@/lib/matching";
import { signKeywordId } from "@/lib/unsubscribe-token";

const DEFAULT_FROM_ADDRESS = "Gazette <onboarding@resend.dev>";
const DEFAULT_SITE_URL = "https://gazette-gamma.vercel.app";
const VOWEL_VARIANTS: Record<string, string> = {
  a: "aáàâãä",
  e: "eéèêë",
  i: "iíìîï",
  o: "oóòôõö",
  u: "uúùûü",
  n: "nñ",
  c: "cç",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildTermRegex(term: string): RegExp {
  const pattern = term
    .split("")
    .map((char) => {
      const variants = VOWEL_VARIANTS[char.toLowerCase()];
      if (variants) return `[${variants.toUpperCase()}${variants}]`;
      return char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    })
    .join("");
  return new RegExp(pattern, "gi");
}

function highlightTerm(snippet: string, term: string): string {
  const escaped = escapeHtml(snippet);
  return escaped.replace(
    buildTermRegex(term),
    (match) =>
      `<mark style="background-color:#fde68a;color:#111827;padding:0 2px;border-radius:2px;">${match}</mark>`
  );
}

export async function sendAdminAlert(subject: string, message: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_ALERT_EMAIL;

  if (!apiKey || !adminEmail) {
    console.error(`[admin alert no enviada] ${subject}: ${message}`);
    return;
  }

  const resend = new Resend(apiKey);
  const fromAddress = process.env.RESEND_FROM_ADDRESS ?? DEFAULT_FROM_ADDRESS;

  try {
    await resend.emails.send({
      from: fromAddress,
      to: adminEmail,
      subject: `[Gazette] ${subject}`,
      text: message,
    });
  } catch (error) {
    console.error("Fallo al enviar la alerta de administrador", error);
  }
}

export async function sendMatchEmail(editionDate: string, matches: Match[]) {
  if (matches.length === 0) return;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY no está configurada");
  }

  const resend = new Resend(apiKey);
  const fromAddress = process.env.RESEND_FROM_ADDRESS ?? DEFAULT_FROM_ADDRESS;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL;
  const { term, email, keywordId } = matches[0];
  const unsubscribeUrl = `${siteUrl}/api/unsubscribe?keyword=${keywordId}&token=${signKeywordId(keywordId)}`;

  const count = matches.length;
  const subject =
    count === 1
      ? `Gazette: "${term}" apareció en La Gaceta del ${editionDate}`
      : `Gazette: "${term}" apareció ${count} veces en La Gaceta del ${editionDate}`;

  const intro = `Tu palabra clave "${term}" aparece ${count === 1 ? "una vez" : `${count} veces`} en la edición de La Gaceta del ${editionDate}.`;

  const textBody = matches
    .map((match, index) => {
      const header = `${index + 1}. Sección: ${match.section}${match.entity ? ` · ${match.entity}` : ""}`;
      const doc = match.documentId ? `Documento: ${match.documentId}` : null;
      const source = match.sourceUrl ? `Fuente: ${match.sourceUrl}` : null;
      return [header, doc, match.snippet, source].filter((line) => line !== null).join("\n");
    })
    .join("\n\n---\n\n");

  const htmlBody = matches
    .map((match, index) => {
      const header = `${index + 1}. Sección: ${escapeHtml(match.section)}${
        match.entity ? ` · ${escapeHtml(match.entity)}` : ""
      }`;
      const doc = match.documentId ? `Documento: ${escapeHtml(match.documentId)}` : null;
      const source = match.sourceUrl
        ? `Fuente: <a href="${escapeHtml(match.sourceUrl)}">${escapeHtml(match.sourceUrl)}</a>`
        : null;
      return [
        `<p><strong>${header}</strong></p>`,
        doc ? `<p>${doc}</p>` : null,
        `<p>${highlightTerm(match.snippet, term)}</p>`,
        source ? `<p>${source}</p>` : null,
      ]
        .filter((line) => line !== null)
        .join("\n");
    })
    .join("<hr />\n");

  await resend.emails.send({
    from: fromAddress,
    to: email,
    subject,
    text: [
      intro,
      "",
      textBody,
      "",
      "— Gazette",
      "",
      "Este aviso es informativo y no constituye asesoría legal — verificá siempre el PDF oficial antes de tomar una decisión.",
      "",
      `Si no querés seguir recibiendo alertas de "${term}": ${unsubscribeUrl}`,
    ].join("\n"),
    html: [
      `<p>${escapeHtml(intro)}</p>`,
      htmlBody,
      "<p>— Gazette</p>",
      `<p style="font-size:12px;color:#6b7280;">Este aviso es informativo y no constituye asesoría legal — verificá siempre el PDF oficial antes de tomar una decisión.</p>`,
      `<p style="font-size:12px;color:#6b7280;">Si no querés seguir recibiendo alertas de "${escapeHtml(
        term
      )}": <a href="${escapeHtml(unsubscribeUrl)}">cancelar esta keyword</a></p>`,
    ].join("\n"),
  });
}
