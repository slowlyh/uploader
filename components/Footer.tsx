import Link from "next/link";
import { Github, ShieldAlert, Zap, HardDrive } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t-3 border-black bg-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[#FFD028] border-2 border-black flex items-center justify-center font-black text-base shadow-[2px_2px_0px_0px_#000]">
                ⚡
              </div>
              <span className="font-black text-xl tracking-tight text-black">
                Hyuu<span className="bg-[#A3E635] px-1.5 py-0.5 border border-black text-xs ml-1">CDN</span>
              </span>
            </div>
            <p className="text-sm font-medium text-neutral-700 max-w-sm mb-4 leading-relaxed">
              Neo-Brutalist Edge File Storage and CDN engine built with Next.js, Supabase Storage, and REST API automation.
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-mono font-bold">
              <span className="bg-[#FFD028]/30 border border-black px-2 py-0.5">
                MAX 10MB
              </span>
              <span className="bg-[#A3E635]/30 border border-black px-2 py-0.5">
                7D / PERMANENT
              </span>
              <span className="bg-[#38BDF8]/30 border border-black px-2 py-0.5">
                10 REQ/MIN
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-black text-sm uppercase tracking-wider mb-3 text-black border-b-2 border-black pb-1 inline-block">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm font-bold">
              <li>
                <Link href="/" className="hover:text-amber-600 hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/upload" className="hover:text-amber-600 hover:underline">
                  Upload File
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-amber-600 hover:underline">
                  REST API Docs
                </Link>
              </li>
              <li>
                <a
                  href="/v1/health"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-600 hover:underline font-mono text-xs"
                >
                  /v1/health
                </a>
              </li>
            </ul>
          </div>

          {/* System Specs */}
          <div>
            <h4 className="font-black text-sm uppercase tracking-wider mb-3 text-black border-b-2 border-black pb-1 inline-block">
              System Specs
            </h4>
            <div className="bg-[#F8F6F0] border-2 border-black p-3 font-mono text-xs space-y-1.5 shadow-[2px_2px_0px_0px_#000]">
              <div className="flex justify-between">
                <span className="text-neutral-600">Engine:</span>
                <span className="font-bold">Next.js App Router</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Database:</span>
                <span className="font-bold">Supabase PostgreSQL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Storage:</span>
                <span className="font-bold">Supabase S3 Edge</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Rate Limit:</span>
                <span className="font-bold">10 Uploads/Min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t-2 border-black pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-neutral-700">
          <div>
            © {new Date().getFullYear()} HyuuCdn. Dibuat dengan ❤️ oleh{" "}
            <a
              href="https://github.com/slowlyh"
              target="_blank"
              rel="noreferrer"
              className="text-black underline decoration-2 hover:bg-[#FFD028]"
            >
              Slowly / Hyuu
            </a>
          </div>

          <a
            href="https://github.com/slowlyh/uploader"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] hover:bg-[#FFD028] transition-all"
          >
            <Github className="w-4 h-4" />
            <span>GitHub Repository</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
