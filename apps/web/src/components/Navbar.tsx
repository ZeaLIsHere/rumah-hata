"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Languages,
  Sparkles,
  GraduationCap,
  Info,
  Users,
  Sun,
  Moon,
  Menu,
  X
} from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on page navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: "/", label: "Penerjemah", icon: Languages },
    { href: "/kamus", label: "Kamus", icon: BookOpen },
    { href: "/belajar", label: "Belajar Aksara", icon: Sparkles },
    { href: "/latihan", label: "Latihan", icon: GraduationCap },
    { href: "/kontribusi", label: "Kontribusi", icon: Users },
    { href: "/tentang", label: "Catatan Ejaan", icon: Info }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-black/85 backdrop-blur-md border-b border-black/[0.06] dark:border-white/[0.08] transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-12 sm:h-14">
            {/* Logo / Brand */}
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 relative flex items-center justify-center transition-transform group-hover:scale-95 duration-200">
                <Image
                  src="/logo.svg"
                  alt="Logo Rumah Hata"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
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
                          ? "bg-[#0066cc] text-white shadow-xs"
                          : "text-[#1d1d1f]/80 dark:text-[#f5f5f7]/80 hover:text-[#1d1d1f] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
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

            {/* Mobile Right Bar: Theme Toggle + Hamburger Toggle Button */}
            <div className="md:hidden flex items-center gap-1">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Ganti mode tampilan"
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition active:scale-90"
                title={theme === "dark" ? "Mode Terang" : "Mode Gelap"}
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-[#2997ff]" />
                ) : (
                  <Moon className="w-4 h-4 text-[#1d1d1f]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Buka menu navigasi"
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition active:scale-90"
              >
                <Menu className="w-5 h-5 text-[#1d1d1f] dark:text-white" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Drawer (Outside header to avoid stacking-context / backdrop-filter traps) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white dark:bg-[#000000] flex flex-col animate-slideDown overflow-y-auto">
          {/* Drawer Header */}
          <div className="flex items-center justify-between h-12 px-4 border-b border-black/[0.06] dark:border-white/[0.08] shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 relative flex items-center justify-center">
                <Image
                  src="/logo.svg"
                  alt="Logo Rumah Hata"
                  width={28}
                  height={28}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-semibold text-base text-[#1d1d1f] dark:text-white tracking-tight">
                Rumah Hata
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Ganti mode tampilan"
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 text-[#2997ff]" />
                ) : (
                  <Moon className="w-4 h-4 text-[#1d1d1f]" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Tutup menu"
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition"
              >
                <X className="w-5 h-5 text-[#1d1d1f] dark:text-white" />
              </button>
            </div>
          </div>

          {/* Drawer Links */}
          <div className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`min-h-[50px] flex items-center justify-between px-4 py-3 rounded-2xl text-[15px] font-medium transition duration-150 ${
                    isActive
                      ? "bg-[#0066cc] text-white shadow-xs"
                      : "text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 opacity-80" />
                    <span>{link.label}</span>
                  </div>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-black/[0.06] dark:border-white/[0.08] text-center text-xs text-[#7a7a7a] shrink-0">
            <p>Rumah Hata &middot; Pelestarian Aksara & Budaya Simalungun</p>
          </div>
        </div>
      )}
    </>
  );
}
