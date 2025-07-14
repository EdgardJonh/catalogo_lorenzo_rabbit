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
  title: "Catálogo de Conejos - Criadero Lorenzo Rabbit",
  description: "Catálogo web de conejos disponibles del Criadero Lorenzo Rabbit. Mini Lop, Holland Lop y más razas disponibles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/logos/logopes.svg" type="image/svg+xml" />
      </head>
      <body className="font-sans bg-gray-50 text-gray-900">
        {children}
        <WhatsappButton />
      </body>
    </html>
  );
}
