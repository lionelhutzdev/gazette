import { Resend } from "resend";
import type { Match } from "@/lib/matching";

const DEFAULT_FROM_ADDRESS = "Gazette <onboarding@resend.dev>";

export async function sendMatchEmail(editionDate: string, matches: Match[]) {
  if (matches.length === 0) return;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY no está configurada");
  }

  const resend = new Resend(apiKey);
  const fromAddress = process.env.RESEND_FROM_ADDRESS ?? DEFAULT_FROM_ADDRESS;
  const { term, email } = matches[0];

  const count = matches.length;
  const subject =
    count === 1
      ? `Gazette: "${term}" apareció en La Gaceta del ${editionDate}`
      : `Gazette: "${term}" apareció ${count} veces en La Gaceta del ${editionDate}`;

  const body = matches
    .map((match, index) => {
      const header = `${index + 1}. Sección: ${match.section}${match.entity ? ` · ${match.entity}` : ""}`;
      const doc = match.documentId ? `Documento: ${match.documentId}` : null;
      return [header, doc, match.snippet].filter((line) => line !== null).join("\n");
    })
    .join("\n\n---\n\n");

  await resend.emails.send({
    from: fromAddress,
    to: email,
    subject,
    text: [
      `Tu palabra clave "${term}" aparece ${count === 1 ? "una vez" : `${count} veces`} en la edición de La Gaceta del ${editionDate}.`,
      "",
      body,
      "",
      "— Gazette",
    ].join("\n"),
  });
}
