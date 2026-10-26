"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Languages, Sparkles, GraduationCap, Info, Users } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Penerjemah", icon: Languages },
    { href: "/kamus", label: "Kamus", icon: BookOpen },
    { href: "/belajar", label: "Belajar Aksara", icon: Sparkles },
    { href: "/latihan", label: "Latihan", icon: GraduationCap },
    { href: "/kontribusi", label: "Kontribusi", icon: Users },
    { href: "/tentang", label: "Sumber & Catatan", icon: Info }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#fdfbf7]/95 backdrop-blur border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-[#8b1e1b] text-white flex items-center justify-center font-bold text-xl font-aksara shadow-sm group-hover:bg-[#6b1412] transition">
              ᯃ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-stone-900 tracking-tight">Rumah Hata</span>
              </div>
              <p className="text-xs text-stone-700 hidden sm:block">
                Lensa Linguistik Bahasa & Aksara Simalungun
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-sm font-medium transition ${
                    isActive
                      ? "bg-[#8b1e1b] text-white shadow-sm"
                      : "text-stone-700 hover:text-stone-950 hover:bg-stone-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Navigation bar at top */}
      <div className="md:hidden border-t border-stone-200 bg-white/95 overflow-x-auto">
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
                    ? "bg-[#8b1e1b] text-white shadow-xs"
                    : "text-stone-700 hover:bg-stone-100"
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
