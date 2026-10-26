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
    { href: "/tentang", label: "Sumber & Catatan", icon: Info }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#fdfbf7]/95 dark:bg-[#12151c]/95 backdrop-blur border-b border-stone-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-[#8b1e1b] dark:bg-[#a62521] text-white flex items-center justify-center font-bold text-xl font-aksara shadow-xs group-hover:bg-[#6b1412] transition">
              ᯃ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-stone-900 dark:text-white tracking-tight">Rumah Hata</span>
              </div>
              <p className="text-xs text-stone-600 dark:text-slate-400 hidden sm:block">
                Lensa Linguistik Bahasa & Aksara Simalungun
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <nav className="flex items-center space-x-1 mr-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-medium transition ${
                      isActive
                        ? "bg-[#8b1e1b] dark:bg-[#a62521] text-white shadow-xs"
                        : "text-stone-700 dark:text-slate-300 hover:text-stone-950 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Ganti mode tampilan"
              className="min-h-[40px] min-w-[40px] p-2 rounded-lg text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 transition flex items-center justify-center border border-stone-200 dark:border-slate-700"
              title={theme === "dark" ? "Mode Terang" : "Mode Gelap"}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-stone-700" />
              )}
            </button>
          </div>

          {/* Mobile Right Bar: Theme Toggle */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Ganti mode tampilan"
              className="min-h-[44px] min-w-[44px] p-2.5 rounded-lg text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 transition flex items-center justify-center"
              title={theme === "dark" ? "Mode Terang" : "Mode Gelap"}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-stone-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation bar at top */}
      <div className="md:hidden border-t border-stone-200 dark:border-slate-800 bg-white/95 dark:bg-[#12151c]/95 overflow-x-auto">
        <div className="flex px-2 py-1.5 space-x-1 min-w-max">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`min-h-[44px] flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? "bg-[#8b1e1b] dark:bg-[#a62521] text-white shadow-xs"
                    : "text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
