import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import Background from "@/components/layout/Background";
import { SITE_URL } from "@/lib/config/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Stella Celeste — Consultas Espirituais e Leitura de Cartas",
    template: "%s | Stella Celeste",
  },
  description:
    "Consultas espirituais e leitura de cartas com a Stella Celeste. Agende seu atendimento online, com acolhimento, sigilo e orientação personalizada.",
  keywords: [
    "cartomante",
    "leitura de cartas",
    "tarot",
    "consulta espiritual",
    "cartomancia",
    "Stella Celeste",
  ],
  openGraph: {
    title: "Stella Celeste — Consultas Espirituais e Leitura de Cartas",
    description:
      "Agende sua consulta espiritual com a Stella Celeste. Acolhimento, sigilo e orientação personalizada.",
    url: SITE_URL,
    siteName: "Stella Celeste",
    locale: "pt_BR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} ${cinzel.variable}`}>
        <Background />
        {children}
      </body>
    </html>
  );
}
