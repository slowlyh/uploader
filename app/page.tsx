"use client";

import { useState } from "react";
import Link from "next/link";
import {
  UploadCloud,
  FileText,
  Zap,
  ShieldCheck,
  Clock,
  Terminal,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  Server,
} from "lucide-react";

export default function HomePage() {
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [activeTab, setActiveTab] = useState<"curl" | "js" | "python">("curl");

  const curlSnippet = `curl -X POST "https://your-domain.com/v1/upload" \\
  -F "file=@./document.pdf" \\
  -F "expired=7d"`;

  const jsSnippet = `const formData = new FormData();
formData.append("file", fileInput.files[0]);
formData.append("expired", "7d");

const res = await fetch("https://your-domain.com/v1/upload", {
  method: "POST",
  body: formData
});
const data = await res.json();
console.log(data.data.url);`;

  const pythonSnippet = `import requests

files = {'file': open('photo.jpg', 'rb')}
data = {'expired': '7d'}

response = requests.post('https://your-domain.com/v1/upload', files=files, data=data)
print(response.json()['data']['url'])`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const getActiveCode = () => {
    switch (activeTab) {
      case "js":
        return jsSnippet;
      case "python":
        return pythonSnippet;
      default:
        return curlSnippet;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center mb-16 sm:mb-24">
        {/* Left Column: Copy & Actions */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#FFD028] border-3 border-black px-3.5 py-1 text-xs font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_#000]">
            <Sparkles className="w-4 h-4" />
            <span>NEO-BRUTALIST EDGE FILE CDN</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-black tracking-tight leading-[1.05]">
            Host & Share Files with <span className="bg-[#A3E635] px-2 py-0.5 border-3 border-black shadow-[4px_4px_0px_0px_#000] inline-block mt-1">Zero BS.</span>
          </h1>

          <p className="text-base sm:text-lg font-bold text-neutral-800 leading-relaxed max-w-xl">
            Direct public CDN sharing backed by Supabase Edge Storage. Choose between <span className="underline decoration-2 decoration-black font-black">7-Day Self-Destruct</span> or <span className="underline decoration-2 decoration-black font-black">Permanent Retention</span>. Enforced 10MB limit, rate limiter, and a dead-simple REST API.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Link
              href="/upload"
              className="brutal-btn px-6 py-3.5 bg-[#FFD028] text-black font-black text-base flex items-center justify-center gap-2"
            >
              <UploadCloud className="w-5 h-5" />
              <span>UPLOAD FILE NOW</span>
            </Link>

            <Link
              href="/docs"
              className="brutal-btn px-6 py-3.5 bg-white text-black font-black text-base flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" />
              <span>READ API DOCS</span>
            </Link>
          </div>

          {/* Quick specs pills */}
          <div className="flex flex-wrap gap-2 pt-2 text-xs font-mono font-bold">
            <div className="bg-white border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_0px_#000]">
              📦 MAX SIZE: <span className="text-black font-black">10MB</span>
            </div>
            <div className="bg-white border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_0px_#000]">
              🕒 EXPIRY: <span className="text-black font-black">7D / PERMANENT</span>
            </div>
            <div className="bg-white border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_0px_#000]">
              🛡️ RATE LIMIT: <span className="text-black font-black">10 REQ/MIN</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Brutalist Interactive Preview */}
        <div className="lg:col-span-5">
          <div className="brutal-card bg-white p-5 sm:p-6 relative">
            <div className="absolute -top-3 -right-2 bg-[#FB7185] border-2 border-black px-3 py-0.5 text-xs font-black uppercase text-white shadow-[2px_2px_0px_0px_#000]">
              LIVE DEMO PREVIEW
            </div>

            <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 border border-black inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-400 border border-black inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-green-500 border border-black inline-block"></span>
              </div>
              <span className="font-mono text-xs font-bold text-neutral-500">
                hyuucdn-edge-node
              </span>
            </div>

            {/* Simulated file card */}
            <div className="border-2 border-black bg-[#F8F6F0] p-4 mb-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="font-black text-sm text-black block truncate">
                    system_architecture_2026.png
                  </span>
                  <span className="font-mono text-xs text-neutral-600">
                    2.45 MB • image/png
                  </span>
                </div>
                <span className="bg-[#A3E635] text-black text-[10px] font-black px-2 py-0.5 border border-black">
                  PERMANENT
                </span>
              </div>

              <div className="bg-white border-2 border-black p-2 font-mono text-[11px] text-neutral-700 truncate mb-3">
                https://supabase.co/storage/v1/object/public-files/...
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy("https://hyuucdn.com/v1/sample-file.png")}
                  className="w-full py-1.5 bg-[#FFD028] border-2 border-black text-xs font-black shadow-[2px_2px_0px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Public URL</span>
                </button>
              </div>
            </div>

            {/* Quick terminal */}
            <div className="bg-[#121110] border-2 border-black p-3 text-white font-mono text-xs">
              <div className="text-neutral-400 text-[10px] mb-1">
                $ POST /v1/upload HTTP/1.1
              </div>
              <div className="text-[#86efac]">
                {`HTTP/1.1 201 Created`}
              </div>
              <div className="text-neutral-300 text-[11px] mt-1">
                {`{ "success": true, "url": "https://..." }`}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Specs & Metric Counters */}
      <section className="mb-16 sm:mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="brutal-card bg-white p-4 sm:p-5">
            <div className="text-neutral-500 font-mono text-xs font-bold uppercase mb-1">
              Max Payload Size
            </div>
            <div className="text-3xl sm:text-4xl font-black text-black">
              10 <span className="text-lg">MB</span>
            </div>
            <p className="text-xs font-medium text-neutral-600 mt-1">
              Enforced on Edge & Client
            </p>
          </div>

          <div className="brutal-card bg-[#FFD028] p-4 sm:p-5">
            <div className="text-black font-mono text-xs font-bold uppercase mb-1">
              Retention Engine
            </div>
            <div className="text-3xl sm:text-4xl font-black text-black">
              7D <span className="text-lg">& PERM</span>
            </div>
            <p className="text-xs font-bold text-black mt-1">
              Auto-pruning or Forever
            </p>
          </div>

          <div className="brutal-card bg-[#A3E635] p-4 sm:p-5">
            <div className="text-black font-mono text-xs font-bold uppercase mb-1">
              Rate Limiter
            </div>
            <div className="text-3xl sm:text-4xl font-black text-black">
              10 <span className="text-lg">REQ/MIN</span>
            </div>
            <p className="text-xs font-bold text-black mt-1">
              IP-based Token Bucket
            </p>
          </div>

          <div className="brutal-card bg-white p-4 sm:p-5">
            <div className="text-neutral-500 font-mono text-xs font-bold uppercase mb-1">
              Public Storage
            </div>
            <div className="text-3xl sm:text-4xl font-black text-black">
              Supabase
            </div>
            <p className="text-xs font-medium text-neutral-600 mt-1">
              High Availability Edge
            </p>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="mb-16 sm:mb-24">
        <div className="border-b-3 border-black pb-4 mb-8">
          <div className="inline-block bg-black text-white px-2.5 py-0.5 font-mono text-xs font-bold uppercase mb-2">
            FEATURES OVERVIEW
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-black">
            Built for Speed, Reliability, and Simplicity
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feature 1 */}
          <div className="brutal-card bg-white p-6 relative overflow-hidden">
            <div className="w-12 h-12 bg-[#FFD028] border-2 border-black flex items-center justify-center font-black mb-4 shadow-[3px_3px_0px_0px_#000]">
              <Clock className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-black text-black mb-2">
              Dual Retention Engine
            </h3>
            <p className="text-sm font-medium text-neutral-700 leading-relaxed">
              Choose between 7-day auto-destruct for temporary testing, logs, and fast sharing, or permanent storage for production images, documentation assets, and media files.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="brutal-card bg-white p-6 relative overflow-hidden">
            <div className="w-12 h-12 bg-[#A3E635] border-2 border-black flex items-center justify-center font-black mb-4 shadow-[3px_3px_0px_0px_#000]">
              <Zap className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-black text-black mb-2">
              Supabase Storage & Global Edge
            </h3>
            <p className="text-sm font-medium text-neutral-700 leading-relaxed">
              Every uploaded file receives an instant, unthrottled public CDN URL. Backed by Supabase PostgreSQL metadata and S3-compatible cloud object storage.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="brutal-card bg-white p-6 relative overflow-hidden">
            <div className="w-12 h-12 bg-[#38BDF8] border-2 border-black flex items-center justify-center font-black mb-4 shadow-[3px_3px_0px_0px_#000]">
              <ShieldCheck className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-black text-black mb-2">
              Abuse Protection & Rate Limits
            </h3>
            <p className="text-sm font-medium text-neutral-700 leading-relaxed">
              Built-in sliding window rate limiter restricts uploads to 10 requests per minute per IP address, preventing spam and Denial of Service spikes.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="brutal-card bg-white p-6 relative overflow-hidden">
            <div className="w-12 h-12 bg-[#FB7185] border-2 border-black flex items-center justify-center font-black mb-4 shadow-[3px_3px_0px_0px_#000]">
              <Terminal className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-black text-black mb-2">
              Developer-First REST API
            </h3>
            <p className="text-sm font-medium text-neutral-700 leading-relaxed">
              Upload directly from your terminal, GitHub Actions, scripts, or apps using standard multipart form-data. Interactive 3-column documentation included.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Integration Terminal */}
      <section className="mb-16 sm:mb-24">
        <div className="brutal-card bg-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-black pb-4 mb-6">
            <div>
              <div className="inline-block bg-[#FFD028] text-black border border-black px-2 py-0.5 text-[10px] font-mono font-black uppercase mb-1">
                INSTANT INTEGRATION
              </div>
              <h3 className="text-2xl font-black text-black">
                Send Files Directly From Terminal or Code
              </h3>
            </div>

            {/* Language tabs */}
            <div className="flex items-center gap-1 border-2 border-black bg-[#F8F6F0] p-1">
              {(["curl", "js", "python"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 font-mono text-xs font-bold uppercase transition-all ${
                    activeTab === tab
                      ? "bg-black text-white"
                      : "text-neutral-700 hover:text-black"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Terminal Box */}
          <div className="border-3 border-black bg-[#121110] p-4 text-white font-mono text-xs relative">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
              <span className="text-neutral-400 text-[11px]">
                {activeTab === "curl"
                  ? "bash"
                  : activeTab === "js"
                  ? "upload.js"
                  : "upload.py"}
              </span>

              <button
                type="button"
                onClick={() => handleCopy(getActiveCode())}
                className="text-[#FFD028] hover:underline flex items-center gap-1 text-[11px]"
              >
                {copiedCurl ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#A3E635]" />
                    <span className="text-[#A3E635]">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Snippet</span>
                  </>
                )}
              </button>
            </div>

            <pre className="text-[#86efac] overflow-x-auto py-2">
              <code>{getActiveCode()}</code>
            </pre>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs font-bold">
            <span className="text-neutral-600">
              Need full documentation and parameters?
            </span>
            <Link
              href="/docs"
              className="text-black underline decoration-2 hover:bg-[#FFD028] flex items-center gap-1"
            >
              <span>Explore 3-Column API Docs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section>
        <div className="brutal-card bg-[#FFD028] p-8 sm:p-12 text-center relative overflow-hidden">
          <h2 className="text-3xl sm:text-5xl font-black text-black tracking-tight mb-4">
            Ready to Upload?
          </h2>
          <p className="text-base sm:text-lg font-bold text-black max-w-xl mx-auto mb-8">
            No registration, no tokens required for basic uploads. Choose your file and get a shareable CDN link in seconds.
          </p>

          <Link
            href="/upload"
            className="brutal-btn inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-black text-lg shadow-[5px_5px_0px_0px_#000]"
          >
            <UploadCloud className="w-6 h-6" />
            <span>START UPLOADING NOW</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
