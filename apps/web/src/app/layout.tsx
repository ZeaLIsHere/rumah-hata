import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

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
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('rumah_hata_theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#faf9f6] text-stone-900 dark:bg-[#0c0e12] dark:text-slate-100 antialiased selection:bg-[#8b1e1b] selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
