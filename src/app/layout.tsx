import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Inter, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
  weight: ["500", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gazette-gamma.vercel.app";
const TITLE = "Gazette — Vigilancia de La Gaceta de Costa Rica";
const DESCRIPTION =
  "Gazette revisa La Gaceta todos los días hábiles y te avisa por email cuando aparece una empresa, persona o palabra clave que te importa.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Gazette",
    locale: "es_CR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${sourceSerif.variable} ${mono.variable}`}>
      <body className="bg-paper text-ink font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
