"use client";

import { useState, useEffect } from "react";
import {
  Copy,
  Check,
  Terminal,
  Shield,
  Clock,
  Layers,
  Code2,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import DocsPlayground from "@/components/DocsPlayground";

export default function DocsPage() {
  const [baseUrl, setBaseUrl] = useState("https://your-domain.com/v1");
  const [copiedBaseUrl, setCopiedBaseUrl] = useState(false);
  const [activeSnippetTab, setActiveSnippetTab] = useState<"curl" | "js" | "python">("curl");
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(`${window.location.origin}/v1`);
    }
  }, []);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    if (id === "base_url") {
      setCopiedBaseUrl(true);
      setTimeout(() => setCopiedBaseUrl(false), 2000);
    } else {
      setCopiedSnippetId(id);
      setTimeout(() => setCopiedSnippetId(null), 2000);
    }
  };

  const codeExamples = {
    upload: {
      curl: `curl -X POST "${baseUrl}/upload" \\
  -F "file=@./photo.jpg" \\
  -F "expired=7d"`,
      js: `const formData = new FormData();
formData.append("file", fileInputElement.files[0]);
formData.append("expired", "7d"); // '7d' or 'permanent'

const response = await fetch("${baseUrl}/upload", {
  method: "POST",
  body: formData,
});

const data = await response.json();
console.log("CDN URL:", data.data.url);`,
      python: `import requests

url = "${baseUrl}/upload"
files = {'file': open('photo.jpg', 'rb')}
data = {'expired': '7d'}  # '7d' or 'permanent'

response = requests.post(url, files=files, data=data)
result = response.json()
print("CDN URL:", result['data']['url'])`,
      response: `{
  "success": true,
  "message": "File uploaded successfully to HyuuCdn",
  "data": {
    "id": "c89f53e2-89b1-4f81-a9f2-51a8eb82f142",
    "name": "photo.jpg",
    "size": 1048576,
    "type": "image/jpeg",
    "url": "https://xyz.supabase.co/storage/v1/object/public/public-files/1726300000_abc123.jpg",
    "storage_path": "1726300000_abc123.jpg",
    "expired": "7d",
    "expires_at": "2026-09-21T08:00:00.000Z",
    "created_at": "2026-09-14T08:00:00.000Z"
  }
}`,
    },
    getFile: {
      curl: `curl -X GET "${baseUrl}/files/c89f53e2-89b1-4f81-a9f2-51a8eb82f142"`,
      js: `const response = await fetch("${baseUrl}/files/c89f53e2-89b1-4f81-a9f2-51a8eb82f142");
const data = await response.json();
console.log("Metadata:", data.data);`,
      python: `import requests

url = "${baseUrl}/files/c89f53e2-89b1-4f81-a9f2-51a8eb82f142"
response = requests.get(url)
print("Metadata:", response.json())`,
      response: `{
  "success": true,
  "data": {
    "id": "c89f53e2-89b1-4f81-a9f2-51a8eb82f142",
    "name": "photo.jpg",
    "size": 1048576,
    "type": "image/jpeg",
    "url": "https://xyz.supabase.co/storage/v1/object/public/public-files/1726300000_abc123.jpg",
    "expired": "7d",
    "expires_at": "2026-09-21T08:00:00.000Z",
    "downloads": 14,
    "created_at": "2026-09-14T08:00:00.000Z"
  }
}`,
    },
    health: {
      curl: `curl -X GET "${baseUrl}/health"`,
      js: `const res = await fetch("${baseUrl}/health");
const data = await res.json();
console.log("Status:", data.status);`,
      python: `import requests
res = requests.get("${baseUrl}/health")
print("Status:", res.json())`,
      response: `{
  "status": "ok",
  "service": "HyuuCdn",
  "version": "1.0.0",
  "limits": {
    "max_upload_size": "10MB",
    "max_upload_bytes": 10485760,
    "retention_options": ["7d", "permanent"],
    "rate_limit": "10 uploads per minute per IP"
  }
}`,
    },
  };

  const navLinks = [
    { title: "Base URL & Overview", href: "#overview" },
    { title: "Rate Limiting Policy", href: "#rate-limiting" },
    { title: "POST /v1/upload", href: "#upload-endpoint", method: "POST" },
    { title: "GET /v1/files/{id}", href: "#files-endpoint", method: "GET" },
    { title: "GET /v1/health", href: "#health-endpoint", method: "GET" },
    { title: "Interactive Playground", href: "#playground" },
  ];

  return (
    <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Top Banner */}
      <div className="mb-8 border-b-3 border-black pb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-[#FFD028] border-2 border-black px-2.5 py-0.5 text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000]">
            V1.0 REST API SPECIFICATION
          </div>
          <span className="font-mono text-xs font-bold text-neutral-600">
            OpenAPI 3.0 Compatible
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-black tracking-tight">
          HyuuCdn Developer API
        </h1>
        <p className="text-base font-bold text-neutral-700 mt-2 max-w-3xl">
          Automate file uploads from CI/CD pipelines, bash scripts, backend workers, or web applications with direct edge CDN distribution.
        </p>
      </div>

      {/* 3-Column Documentation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ============================================================ */}
        {/* COLUMN 1: Sticky Navigation / Index (3 cols on desktop) */}
        {/* ============================================================ */}
        <aside className="lg:col-span-3 lg:sticky lg:top-24 space-y-4">
          <div className="brutal-card bg-white p-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-black mb-3 border-b-2 border-black pb-2 flex items-center justify-between">
              <span>Endpoints & Index</span>
              <Layers className="w-3.5 h-3.5" />
            </h3>

            <nav className="space-y-1.5 font-mono text-xs font-bold">
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between p-2 rounded-none hover:bg-[#F8F6F0] border border-transparent hover:border-black transition-all group"
                >
                  <span className="text-black group-hover:underline truncate">
                    {item.title}
                  </span>
                  {item.method && (
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.2 border border-black ${
                        item.method === "POST"
                          ? "bg-[#93c5fd] text-black"
                          : item.method === "GET"
                          ? "bg-[#86efac] text-black"
                          : "bg-neutral-200"
                      }`}
                    >
                      {item.method}
                    </span>
                  )}
                </a>
              ))}
            </nav>
          </div>

          {/* Quick specs pill card */}
          <div className="brutal-card bg-[#FFD028] p-4 text-xs font-mono font-bold text-black space-y-2">
            <div className="flex justify-between border-b border-black/30 pb-1">
              <span>MAX FILE SIZE:</span>
              <span className="font-black">10 MB</span>
            </div>
            <div className="flex justify-between border-b border-black/30 pb-1">
              <span>RATE LIMIT:</span>
              <span className="font-black">10 REQ/MIN</span>
            </div>
            <div className="flex justify-between">
              <span>EXPIRY OPTIONS:</span>
              <span className="font-black">7d | permanent</span>
            </div>
          </div>
        </aside>

        {/* ============================================================ */}
        {/* COLUMN 2: Explanation & Specifications (5 cols on desktop) */}
        {/* ============================================================ */}
        <div className="lg:col-span-5 space-y-12">
          {/* Section 1: Overview & Base URL */}
          <section id="overview" className="space-y-4 scroll-mt-28">
            <div className="brutal-card bg-white p-5">
              <h2 className="text-xl font-black text-black mb-2 flex items-center gap-2">
                <span>Base URL</span>
              </h2>
              <p className="text-xs font-medium text-neutral-700 mb-3">
                All requests to the HyuuCdn API are made to the base URL below. Both HTTPS and HTTP are supported.
              </p>

              {/* Base URL Banner */}
              <div className="flex items-center justify-between bg-[#F8F6F0] border-2 border-black p-3 font-mono text-xs font-bold">
                <span className="truncate mr-2 text-black">{baseUrl}</span>
                <button
                  onClick={() => copyText(baseUrl, "base_url")}
                  className={`px-3 py-1 border border-black text-[11px] font-bold flex items-center gap-1 active:translate-x-0.5 active:translate-y-0.5 ${
                    copiedBaseUrl ? "bg-[#A3E635]" : "bg-[#FFD028] hover:bg-amber-400"
                  }`}
                >
                  {copiedBaseUrl ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedBaseUrl ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>
          </section>

          {/* Section 2: Rate Limiting Policy */}
          <section id="rate-limiting" className="space-y-4 scroll-mt-28">
            <div className="brutal-card bg-white p-5">
              <div className="inline-flex items-center gap-1.5 bg-[#A3E635] text-black border border-black px-2 py-0.5 text-[10px] font-mono font-black uppercase mb-2">
                <Shield className="w-3 h-3" />
                ABUSE PROTECTION
              </div>
              <h2 className="text-xl font-black text-black mb-2">
                Rate Limiting Policy
              </h2>
              <p className="text-xs font-medium text-neutral-700 leading-relaxed mb-4">
                To guarantee optimal service quality and protect the storage infrastructure, upload requests are throttled per client IP address using a sliding window rate limiter:
              </p>

              <div className="bg-[#F8F6F0] border-2 border-black p-3 space-y-2 text-xs font-mono">
                <div className="flex justify-between font-bold">
                  <span>Allowed Request Window:</span>
                  <span className="text-black">10 uploads / 60 seconds</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Exceeded Status:</span>
                  <span className="text-red-600">429 Too Many Requests</span>
                </div>
              </div>

              <h4 className="text-xs font-black uppercase text-black mt-4 mb-2">
                Standard Response Headers
              </h4>
              <div className="border-2 border-black overflow-x-auto">
                <table className="w-full text-left font-mono text-[11px]">
                  <thead className="bg-black text-white">
                    <tr>
                      <th className="p-2">Header</th>
                      <th className="p-2">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black">
                    <tr>
                      <td className="p-2 font-bold text-black">X-RateLimit-Limit</td>
                      <td className="p-2 text-neutral-700">Maximum allowed uploads in the window (10)</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-black">X-RateLimit-Remaining</td>
                      <td className="p-2 text-neutral-700">Number of remaining uploads</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-black">X-RateLimit-Reset</td>
                      <td className="p-2 text-neutral-700">Epoch timestamp (seconds) when window resets</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 3: POST /v1/upload Endpoint */}
          <section id="upload-endpoint" className="space-y-4 scroll-mt-28">
            <div className="brutal-card bg-white p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#93c5fd] text-black font-mono font-black text-xs px-2 py-0.5 border-2 border-black">
                  POST
                </span>
                <span className="font-mono text-sm font-black text-black">
                  /v1/upload
                </span>
              </div>
              <h2 className="text-xl font-black text-black mb-2">
                Upload File
              </h2>
              <p className="text-xs font-medium text-neutral-700 leading-relaxed mb-4">
                Upload a file up to 10MB to the global Supabase Edge CDN with optional retention parameters.
              </p>

              {/* Request Headers */}
              <h4 className="text-xs font-black uppercase text-black mb-2">
                Request Headers
              </h4>
              <div className="border-2 border-black p-2.5 bg-[#F8F6F0] font-mono text-xs mb-4">
                <span className="font-bold text-black">Content-Type:</span>{" "}
                <span className="text-neutral-700">multipart/form-data</span>
              </div>

              {/* Parameters Table */}
              <h4 className="text-xs font-black uppercase text-black mb-2">
                Form Parameters
              </h4>
              <div className="border-2 border-black overflow-x-auto mb-4">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-black text-white text-[11px]">
                    <tr>
                      <th className="p-2">Param</th>
                      <th className="p-2">Type</th>
                      <th className="p-2">Required</th>
                      <th className="p-2">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black text-[11px]">
                    <tr>
                      <td className="p-2 font-bold text-black">file</td>
                      <td className="p-2 text-neutral-600">File (Binary)</td>
                      <td className="p-2 text-red-600 font-bold">Required</td>
                      <td className="p-2 text-neutral-800">
                        The file to host. Max size: <strong>10MB</strong>.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-black">expired</td>
                      <td className="p-2 text-neutral-600">String</td>
                      <td className="p-2 text-neutral-600">Optional</td>
                      <td className="p-2 text-neutral-800">
                        Retention choice: <code className="bg-[#FFD028] px-1 text-black font-bold">7d</code> (expires in 7 days, default) or <code className="bg-[#A3E635] px-1 text-black font-bold">permanent</code> (never expires).
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* HTTP Status codes */}
              <h4 className="text-xs font-black uppercase text-black mb-2">
                Response Status Codes
              </h4>
              <div className="space-y-1.5 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="bg-[#86efac] text-black px-1.5 py-0.2 border border-black font-black text-[11px]">
                    201 Created
                  </span>
                  <span className="text-neutral-700 font-bold">File uploaded successfully</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#fca5a5] text-black px-1.5 py-0.2 border border-black font-black text-[11px]">
                    400 Bad Request
                  </span>
                  <span className="text-neutral-700 font-bold">Missing &apos;file&apos; payload</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#fca5a5] text-black px-1.5 py-0.2 border border-black font-black text-[11px]">
                    413 Payload Too Large
                  </span>
                  <span className="text-neutral-700 font-bold">File exceeds 10MB</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#fca5a5] text-black px-1.5 py-0.2 border border-black font-black text-[11px]">
                    429 Too Many Requests
                  </span>
                  <span className="text-neutral-700 font-bold">Rate limit exceeded (max 10/min)</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: GET /v1/files/{id} */}
          <section id="files-endpoint" className="space-y-4 scroll-mt-28">
            <div className="brutal-card bg-white p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#86efac] text-black font-mono font-black text-xs px-2 py-0.5 border-2 border-black">
                  GET
                </span>
                <span className="font-mono text-sm font-black text-black">
                  /v1/files/&#123;id&#125;
                </span>
              </div>
              <h2 className="text-xl font-black text-black mb-2">
                Get File Metadata
              </h2>
              <p className="text-xs font-medium text-neutral-700 leading-relaxed mb-4">
                Retrieve metadata, public URL, download counts, and expiration dates for an uploaded file using its UUID or storage identifier.
              </p>

              <h4 className="text-xs font-black uppercase text-black mb-2">
                Path Parameters
              </h4>
              <div className="border-2 border-black overflow-x-auto mb-4">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-black text-white text-[11px]">
                    <tr>
                      <th className="p-2">Param</th>
                      <th className="p-2">Type</th>
                      <th className="p-2">Description</th>
                    </tr>
                  </thead>
                  <tbody className="text-[11px]">
                    <tr>
                      <td className="p-2 font-bold text-black">&#123;id&#125;</td>
                      <td className="p-2 text-neutral-600">UUID / String</td>
                      <td className="p-2 text-neutral-800">
                        The file ID returned during upload.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 5: GET /v1/health */}
          <section id="health-endpoint" className="space-y-4 scroll-mt-28">
            <div className="brutal-card bg-white p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#86efac] text-black font-mono font-black text-xs px-2 py-0.5 border-2 border-black">
                  GET
                </span>
                <span className="font-mono text-sm font-black text-black">
                  /v1/health
                </span>
              </div>
              <h2 className="text-xl font-black text-black mb-2">
                Health & Limits Check
              </h2>
              <p className="text-xs font-medium text-neutral-700 leading-relaxed">
                Returns the current system health status, active rate limits, and Supabase storage connectivity.
              </p>
            </div>
          </section>
        </div>

        {/* ============================================================ */}
        {/* COLUMN 3: Code Snippets & Interactive Playground (4 cols) */}
        {/* ============================================================ */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          {/* Interactive Playground Widget */}
          <div id="playground" className="scroll-mt-28">
            <DocsPlayground />
          </div>

          {/* Code Snippet Box */}
          <div className="border-3 border-black bg-[#121110] text-white shadow-[4px_4px_0px_0px_#000] p-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-neutral-700 pb-3 mb-3">
              <div className="flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-[#FFD028]" />
                <span className="font-black text-xs text-white uppercase">
                  POST /v1/upload Example
                </span>
              </div>

              {/* Language selection pills */}
              <div className="flex items-center gap-1">
                {(["curl", "js", "python"] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setActiveSnippetTab(lang)}
                    className={`px-2 py-0.5 text-[10px] font-bold uppercase transition-all ${
                      activeSnippetTab === lang
                        ? "bg-[#FFD028] text-black"
                        : "text-neutral-400 hover:text-white"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Body */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  copyText(codeExamples.upload[activeSnippetTab], "snippet_upload")
                }
                className="absolute top-1 right-1 px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-[#FFD028] text-[10px] font-bold border border-neutral-600 flex items-center gap-1"
              >
                {copiedSnippetId === "snippet_upload" ? (
                  <>
                    <Check className="w-3 h-3 text-[#86efac]" />
                    <span className="text-[#86efac]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <pre className="text-[#86efac] overflow-x-auto py-2 pr-16 text-[11px] leading-relaxed max-h-56">
                <code>{codeExamples.upload[activeSnippetTab]}</code>
              </pre>
            </div>

            {/* Expected JSON Response Header */}
            <div className="border-t border-neutral-700 pt-3 mt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-neutral-400 uppercase font-bold">
                  Expected 201 Response
                </span>
                <span className="bg-[#22c55e] text-black text-[9px] font-black px-1.5 py-0.2">
                  STATUS 201
                </span>
              </div>

              <pre className="text-neutral-300 overflow-x-auto max-h-48 text-[11px] leading-relaxed">
                <code>{codeExamples.upload.response}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
