"use client";

import { useState, useRef, ChangeEvent } from "react";
import { Play, Check, Copy, AlertCircle, Sparkles, RefreshCw } from "lucide-react";
import { formatBytes } from "@/lib/utils";

export default function DocsPlayground() {
  const [file, setFile] = useState<File | null>(null);
  const [expired, setExpired] = useState<"7d" | "permanent">("7d");
  const [isLoading, setIsLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});
  const [responseBody, setResponseBody] = useState<string | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleTestUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setResponseStatus(null);
    setResponseBody(null);
    setResponseTime(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("expired", expired);

    const startTime = performance.now();

    try {
      const res = await fetch("/v1/upload", {
        method: "POST",
        body: formData,
      });

      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      setResponseStatus(res.status);

      // Collect rate limit headers
      const headers: Record<string, string> = {};
      res.headers.forEach((val, key) => {
        if (key.startsWith("x-ratelimit-") || key === "content-type") {
          headers[key] = val;
        }
      });
      setResponseHeaders(headers);

      const json = await res.json();
      setResponseBody(JSON.stringify(json, null, 2));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error";
      setResponseBody(JSON.stringify({ success: false, error: msg }, null, 2));
      setResponseStatus(500);
    } finally {
      setIsLoading(false);
    }
  };

  const copyResponse = () => {
    if (!responseBody) return;
    navigator.clipboard.writeText(responseBody);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  return (
    <div className="border-3 border-black bg-white shadow-[4px_4px_0px_0px_#000] p-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#FFD028] border border-black flex items-center justify-center font-black text-xs">
            ⚡
          </div>
          <span className="font-black text-sm text-black uppercase tracking-wider">
            Live API Playground
          </span>
        </div>
        <span className="bg-[#A3E635] text-black text-[10px] font-mono font-black px-2 py-0.5 border border-black">
          POST /v1/upload
        </span>
      </div>

      {/* Form Fields */}
      <div className="space-y-4 mb-5">
        {/* File Input */}
        <div>
          <label className="block text-xs font-black uppercase text-neutral-800 mb-1">
            File Parameter <span className="text-red-600">*</span>
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full text-left p-2.5 border-2 border-black bg-[#F8F6F0] font-mono text-xs font-bold hover:bg-neutral-100 flex items-center justify-between"
          >
            <span className="truncate max-w-[200px]">
              {file ? `${file.name} (${formatBytes(file.size)})` : "Click to select a file..."}
            </span>
            <span className="bg-black text-white px-2 py-0.5 text-[10px] uppercase">
              Browse
            </span>
          </button>
        </div>

        {/* Expired Parameter */}
        <div>
          <label className="block text-xs font-black uppercase text-neutral-800 mb-1">
            Expiration Policy (expired)
          </label>
          <select
            value={expired}
            onChange={(e) => setExpired(e.target.value as "7d" | "permanent")}
            className="w-full p-2.5 border-2 border-black bg-white font-mono text-xs font-bold focus:outline-none"
          >
            <option value="7d">7d — Auto-expire in 7 Days (Default)</option>
            <option value="permanent">permanent — Keep Forever</option>
          </select>
        </div>

        {/* Submit button */}
        <button
          type="button"
          disabled={!file || isLoading}
          onClick={handleTestUpload}
          className={`w-full py-2.5 border-2 border-black font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#000] flex items-center justify-center gap-2 transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
            !file || isLoading
              ? "bg-neutral-200 text-neutral-500 cursor-not-allowed border-neutral-400 shadow-none"
              : "bg-[#FFD028] hover:bg-amber-400 text-black hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000]"
          }`}
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>SENDING REQUEST...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>EXECUTE LIVE REQUEST</span>
            </>
          )}
        </button>
      </div>

      {/* Output Console */}
      {responseBody && (
        <div className="border-2 border-black bg-[#121110] p-3 text-white font-mono text-xs">
          <div className="flex items-center justify-between border-b border-neutral-700 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <span
                className={`px-1.5 py-0.5 text-[10px] font-black border ${
                  responseStatus && responseStatus < 300
                    ? "bg-[#22c55e] text-black border-[#22c55e]"
                    : "bg-[#ef4444] text-white border-[#ef4444]"
                }`}
              >
                STATUS: {responseStatus}
              </span>
              {responseTime && (
                <span className="text-[10px] text-neutral-400">
                  {responseTime} ms
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={copyResponse}
              className="text-[#FFD028] hover:underline text-[10px] flex items-center gap-1"
            >
              {copiedResponse ? <Check className="w-3 h-3 text-[#22c55e]" /> : <Copy className="w-3 h-3" />}
              <span>{copiedResponse ? "Copied" : "Copy JSON"}</span>
            </button>
          </div>

          <pre className="text-[#86efac] overflow-x-auto max-h-56 py-1 scrollbar-thin">
            <code>{responseBody}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
