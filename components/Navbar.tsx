"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { UploadCloud, FileText, Home, Menu, X, Github, ExternalLink } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Upload File", href: "/upload", icon: UploadCloud },
    { name: "API Docs", href: "/docs", icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#F8F6F0] border-b-3 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-[#FFD028] border-3 border-black flex items-center justify-center font-black text-xl shadow-[3px_3px_0px_0px_#000] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-[1px_1px_0px_0px_#000] transition-all">
              ⚡
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl sm:text-2xl tracking-tight text-black">
                  Hyuu
                </span>
                <span className="bg-[#A3E635] text-black font-black text-xs px-2 py-0.5 border-2 border-black shadow-[1.5px_1.5px_0px_0px_#000]">
                  CDN
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-600 hidden sm:inline">
                EDGE STORAGE ENGINE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 border-2 border-black font-bold text-sm transition-all ${
                    isActive
                      ? "bg-[#FFD028] shadow-[3px_3px_0px_0px_#000] translate-x-[-1px] translate-y-[-1px]"
                      : "bg-white hover:bg-[#F1EDE4] shadow-[2px_2px_0px_0px_#000] hover:shadow-[3px_3px_0px_0px_#000]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {/* Status indicator */}
            <div className="flex items-center gap-2 px-3 py-2 border-2 border-black bg-[#A3E635]/20 font-mono text-xs font-bold shadow-[2px_2px_0px_0px_#000] ml-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span>CDN ONLINE</span>
            </div>

            {/* GitHub link */}
            <a
              href="https://github.com/slowlyh/uploader"
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] hover:bg-[#FFD028] hover:shadow-[3px_3px_0px_0px_#000] transition-all"
              title="GitHub Repository"
            >
              <Github className="w-5 h-5 text-black" />
            </a>
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1 border-2 border-black bg-[#A3E635]/30 font-mono text-[10px] font-black">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              ONLINE
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-[#FFD028] border-2 border-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-black" />
              ) : (
                <Menu className="w-6 h-6 text-black" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-3 border-black bg-white p-4 shadow-[0_8px_0px_0px_#000]">
          <div className="flex flex-col gap-2.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-3 border-2 border-black font-black text-base shadow-[2px_2px_0px_0px_#000] ${
                    isActive ? "bg-[#FFD028]" : "bg-[#F8F6F0] hover:bg-neutral-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <span className="font-mono text-xs">● ACTIVE</span>}
                </Link>
              );
            })}

            <a
              href="https://github.com/slowlyh/uploader"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between p-3 border-2 border-black bg-[#E2E8F0] font-black text-sm shadow-[2px_2px_0px_0px_#000]"
            >
              <div className="flex items-center gap-3">
                <Github className="w-5 h-5" />
                <span>GitHub Repository</span>
              </div>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
