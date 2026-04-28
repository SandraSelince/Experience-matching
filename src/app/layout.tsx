import type { Metadata } from "next";
import "./globals.css";
import { LangProvider } from "@/lib/i18n/context";

export const metadata: Metadata = {
  title: "Experience Matching — Trouvez votre match parfait",
  description: "La plateforme qui connecte les talents et les entreprises grâce à un matching intelligent des compétences et de la personnalité.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full flex flex-col bg-white">
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
