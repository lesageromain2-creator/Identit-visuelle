import type { Metadata } from "next";
import "./globals.css";
import { GOOGLE_FONTS_STYLESHEET } from "@/lib/explorer-data";

export const metadata: Metadata = {
  title: "Direction artistique — Explorateur web",
  description:
    "Compose polices (titres, corps, signature) et palette joyeuse avec aperçu site type galerie. Outil de direction artistique, 100 % frontend.",
  robots: "index, follow",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={GOOGLE_FONTS_STYLESHEET} rel="stylesheet" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
