import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Rumah Hata: Belajar Terjemahan & Aksara Batak Simalungun",
  description:
    "Platform presisi terjemahan dan alih aksara Batak Simalungun dengan Lensa Linguistik berbasis kaidah ortografi baku.",
  keywords: [
    "Simalungun",
    "Aksara Batak",
    "Surat Sisimolungun",
    "Kamus Simalungun",
    "Transliterasi Batak"
  ],
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/logo.png", type: "image/png" }
    ],
    apple: "/logo.png"
  }
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
      <body className="min-h-screen flex flex-col bg-white text-[#1d1d1f] dark:bg-black dark:text-[#f5f5f7] antialiased selection:bg-[#0066cc] selection:text-white transition-colors duration-200">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
