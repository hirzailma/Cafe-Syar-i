import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://cafesyari.id"),
  title: `${siteConfig.name} - ${siteConfig.tagline}`,
  description: siteConfig.description,
  keywords: [
    "Cafe Syar'i",
    "Kedai Kopi Kediri",
    "Kopi Halal Kediri",
    "Artisan Coffee Banjaran",
    "Kafe Ramah Keluarga Kediri",
    "Kajian Kediri",
    "Roastery Halal",
  ],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: "https://cafesyari.id",
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.logo,
        width: 800,
        height: 600,
        alt: siteConfig.name,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#fff8f1] text-[#352f2b] font-sans selection:bg-[#F2C46A] selection:text-[#2F2B28] antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
