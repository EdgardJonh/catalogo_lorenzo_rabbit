import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@fontsource/inter";
import WhatsappButton from "./components/WhatsappButton";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Criadero LorenZo Rabbit",
  description: "Catálogo web de conejos disponibles del Criadero Lorenzo Rabbit. Mini Lop, Holland Lop y más razas disponibles.",
};

const SITE_URL = "https://catalogo-lorenzo-rabbit.vercel.app";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/logos/logopes.svg" type="image/svg+xml" />
        {/* Open Graph y Twitter Card */}
        <meta property="og:title" content="Criadero LorenZo Rabbit" />
        <meta property="og:description" content="Catálogo web de conejos disponibles del Criadero Lorenzo Rabbit. Mini Lop, Holland Lop y más razas disponibles." />
        <meta property="og:image" content={`${SITE_URL}/logos/logolorenzo.png`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Criadero LorenZo Rabbit" />
        <meta name="twitter:description" content="Catálogo web de conejos disponibles del Criadero Lorenzo Rabbit. Mini Lop, Holland Lop y más razas disponibles." />
        <meta name="twitter:image" content={`${SITE_URL}/logos/logolorenzo.png`} />
      </head>
      <body className="font-sans bg-gray-50 text-gray-900">
        {children}
        <WhatsappButton />
      </body>
    </html>
  );
}
  