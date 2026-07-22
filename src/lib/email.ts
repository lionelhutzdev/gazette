import { Resend } from "resend";
import type { Match } from "@/lib/matching";

const DEFAULT_FROM_ADDRESS = "Gazette <onboarding@resend.dev>";

export async function sendMatchEmail(editionDate: string, match: Match) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY no está configurada");
  }

  const resend = new Resend(apiKey);
  const fromAddress = process.env.RESEND_FROM_ADDRESS ?? DEFAULT_FROM_ADDRESS;

  await resend.emails.send({
    from: fromAddress,
    to: match.email,
    subject: `Gazette: "${match.term}" apareció en La Gaceta del ${editionDate}`,
    text: [
      `Tu palabra clave "${match.term}" aparece en la edición de La Gaceta del ${editionDate}.`,
      "",
      `Sección: ${match.section}${match.entity ? ` · ${match.entity}` : ""}`,
      match.documentId ? `Documento: ${match.documentId}` : null,
      "",
      match.snippet,
      "",
      "— Gazette",
    ]
      .filter((line) => line !== null)
      .join("\n"),
  });
}
