"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Languages, Sparkles, GraduationCap, Info, Users, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { href: "/", label: "Penerjemah", icon: Languages },
    { href: "/kamus", label: "Kamus", icon: BookOpen },
    { href: "/belajar", label: "Belajar Aksara", icon: Sparkles },
    { href: "/latihan", label: "Latihan", icon: GraduationCap },
    { href: "/kontribusi", label: "Kontribusi", icon: Users },
    { href: "/tentang", label: "Catatan Ejaan", icon: Info }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-black/[0.06] dark:border-white/[0.08] transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-12 sm:h-14">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <span className="w-8 h-8 rounded-full bg-[#1d1d1f] dark:bg-white text-white dark:text-[#1d1d1f] flex items-center justify-center font-bold text-base font-aksara transition group-hover:scale-95 duration-200">
              ᯃ
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold text-base sm:text-lg text-[#1d1d1f] dark:text-white tracking-tight">
                Rumah Hata
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <nav className="flex items-center space-x-1 mr-3">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition duration-200 ${
                      isActive
                        ? "bg-[#0066cc] text-white"
                        : "text-[#1d1d1f]/80 dark:text-[#f5f5f7]/80 hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Apple Style Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Ganti mode tampilan"
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition duration-200"
              title={theme === "dark" ? "Mode Terang" : "Mode Gelap"}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-[#2997ff]" />
              ) : (
                <Moon className="w-4 h-4 text-[#1d1d1f]" />
              )}
            </button>
          </div>

          {/* Mobile Right Bar */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Ganti mode tampilan"
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition"
              title={theme === "dark" ? "Mode Terang" : "Mode Gelap"}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-[#2997ff]" />
              ) : (
                <Moon className="w-4 h-4 text-[#1d1d1f]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation bar */}
      <div className="md:hidden border-t border-black/[0.04] dark:border-white/[0.06] bg-white/90 dark:bg-black/90 overflow-x-auto">
        <div className="flex px-3 py-1.5 space-x-1.5 min-w-max">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`min-h-[40px] flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                  isActive
                    ? "bg-[#0066cc] text-white"
                    : "text-[#1d1d1f]/80 dark:text-[#f5f5f7]/80 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
