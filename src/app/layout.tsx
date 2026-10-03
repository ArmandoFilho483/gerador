import type { Metadata } from "next";
import { Fraunces, Nunito } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gerador de Atividades Pro — 4º e 5º Ano (BNCC)",
  description: "Plataforma profissional de geração de atividades pedagógicas alinhadas à BNCC com Inteligência Artificial e download em PDF vetorial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${nunito.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-[#fcf9f2] text-[#1c2a33]">
        {children}
      </body>
    </html>
  );
}
