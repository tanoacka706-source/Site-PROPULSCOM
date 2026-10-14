import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque/wght.css";
import "@fontsource-variable/instrument-sans/wght.css";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { NAV, SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Propuls Com | Communication et événementiel à Abidjan",
    template: "%s | Propuls Com",
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    locale: "fr_CI",
    siteName: SITE.nom,
    title: "Propuls Com | Communication et événementiel à Abidjan",
    description: SITE.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#F6F7F9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen flex-col">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[6px] focus:bg-ink focus:px-4 focus:py-3 focus:text-white"
        >
          Aller au contenu
        </a>
        <Header liens={NAV} />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
