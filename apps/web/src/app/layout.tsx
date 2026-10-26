import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Rumah Hata: Belajar Terjemahan & Aksara Batak Simalungun",
  description:
    "Rumah belajar terjemahan Indonesia ⇄ Simalungun ⇄ Aksara Batak Simalungun dengan Lensa Linguistik ilmiah, deterministik, dan berlandaskan sumber baku.",
  keywords: [
    "Simalungun",
    "Aksara Batak",
    "Surat Sisimolungun",
    "Kamus Simalungun",
    "Transliterasi Batak",
    "Lensa Linguistik"
  ]
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-[#faf9f6] text-stone-900 antialiased selection:bg-[#8b1e1b] selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
