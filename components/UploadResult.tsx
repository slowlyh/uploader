"use client";

import { useState } from "react";
import { Check, Copy, ExternalLink, Download, Clock, ShieldCheck, Terminal, ArrowLeft } from "lucide-react";
import { formatBytes, formatDate, timeRemaining } from "@/lib/utils";

interface UploadResultProps {
  data: {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
    storage_path?: string;
    expired: "7d" | "permanent";
    expires_at: string | null;
    created_at: string;
  };
  onReset: () => void;
}

export default function UploadResult({ data, onReset }: UploadResultProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  const copyToClipboard = (text: string, isUrl: boolean) => {
    navigator.clipboard.writeText(text);
    if (isUrl) {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } else {
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2000);
    }
  };

  const isImage = data.type.startsWith("image/");
  const isVideo = data.type.startsWith("video/");
  const isAudio = data.type.startsWith("audio/");

  const curlCommand = `curl -O "${data.url}"`;

  return (
    <div className="w-full brutal-card bg-white p-6 sm:p-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-3 border-black pb-5 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#A3E635] text-black border-2 border-black px-2.5 py-0.5 text-xs font-black shadow-[2px_2px_0px_0px_#000] mb-2">
            <Check className="w-3.5 h-3.5" />
            UPLOAD COMPLETE
          </div>
          <h2 className="text-2xl font-black text-black break-all">
            {data.name}
          </h2>
        </div>

        <button
          onClick={onReset}
          className="px-4 py-2 border-2 border-black bg-[#E2E8F0] font-black text-xs shadow-[2px_2px_0px_0px_#000] hover:bg-neutral-200 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Upload Another</span>
        </button>
      </div>

      {/* Media Preview if available */}
      {isImage && (
        <div className="mb-6 border-3 border-black bg-[#F8F6F0] p-3 shadow-[3px_3px_0px_0px_#000] flex justify-center">
          <img
            src={data.url}
            alt={data.name}
            className="max-h-72 object-contain border-2 border-black bg-white"
          />
        </div>
      )}

      {isVideo && (
        <div className="mb-6 border-3 border-black bg-black p-2 shadow-[3px_3px_0px_0px_#000]">
          <video src={data.url} controls className="max-h-72 w-full object-contain" />
        </div>
      )}

      {isAudio && (
        <div className="mb-6 border-3 border-black bg-[#FFD028] p-4 shadow-[3px_3px_0px_0px_#000]">
          <audio src={data.url} controls className="w-full" />
        </div>
      )}

      {/* Meta Specs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="border-2 border-black p-3 bg-[#F8F6F0]">
          <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">
            File Size
          </span>
          <span className="text-sm font-black text-black">
            {formatBytes(data.size)}
          </span>
        </div>

        <div className="border-2 border-black p-3 bg-[#F8F6F0]">
          <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">
            Mime Type
          </span>
          <span className="text-xs font-mono font-bold text-black truncate block">
            {data.type || "unknown"}
          </span>
        </div>

        <div className="border-2 border-black p-3 bg-[#F8F6F0]">
          <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">
            Retention
          </span>
          <div className="flex items-center gap-1 mt-0.5">
            {data.expired === "permanent" ? (
              <span className="bg-[#A3E635] text-black text-[10px] font-black px-1.5 py-0.2 border border-black">
                PERMANENT
              </span>
            ) : (
              <span className="bg-[#FFD028] text-black text-[10px] font-black px-1.5 py-0.2 border border-black">
                7 DAYS
              </span>
            )}
          </div>
        </div>

        <div className="border-2 border-black p-3 bg-[#F8F6F0]">
          <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase block">
            Expires At
          </span>
          <span className="text-xs font-bold text-black block truncate">
            {data.expires_at ? formatDate(data.expires_at) : "Never"}
          </span>
        </div>
      </div>

      {/* Direct CDN URL Card */}
      <div className="border-3 border-black bg-[#F8F6F0] p-4 sm:p-5 mb-6 shadow-[3px_3px_0px_0px_#000]">
        <label className="block text-xs font-black uppercase tracking-wider text-black mb-2 flex items-center justify-between">
          <span>Direct Public CDN URL</span>
          <span className="font-mono text-[10px] text-emerald-700 bg-emerald-100 px-1.5 border border-emerald-500">
            ACTIVE ON EDGE
          </span>
        </label>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            type="text"
            readOnly
            value={data.url}
            className="flex-1 bg-white border-2 border-black px-3 py-2.5 font-mono text-xs text-black font-bold focus:outline-none"
          />

          <button
            type="button"
            onClick={() => copyToClipboard(data.url, true)}
            className={`px-5 py-2.5 border-2 border-black font-black text-xs shadow-[2px_2px_0px_0px_#000] flex items-center justify-center gap-2 transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
              copiedUrl
                ? "bg-[#A3E635] text-black"
                : "bg-[#FFD028] hover:bg-amber-400 text-black"
            }`}
          >
            {copiedUrl ? (
              <>
                <Check className="w-4 h-4" />
                <span>COPIED!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>COPY URL</span>
              </>
            )}
          </button>

          <a
            href={data.url}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 border-2 border-black bg-white hover:bg-neutral-100 font-black text-xs shadow-[2px_2px_0px_0px_#000] flex items-center justify-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open</span>
          </a>
        </div>
      </div>

      {/* cURL Snippet */}
      <div className="border-3 border-black bg-neutral-900 text-white p-4 shadow-[3px_3px_0px_0px_#000]">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-neutral-700">
          <div className="flex items-center gap-2 font-mono text-xs text-neutral-300">
            <Terminal className="w-3.5 h-3.5 text-[#FFD028]" />
            <span>Terminal Download Command</span>
          </div>

          <button
            type="button"
            onClick={() => copyToClipboard(curlCommand, false)}
            className="text-xs font-mono font-bold text-[#FFD028] hover:underline flex items-center gap-1"
          >
            {copiedCurl ? (
              <>
                <Check className="w-3 h-3 text-[#A3E635]" />
                <span className="text-[#A3E635]">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <pre className="font-mono text-xs text-[#86efac] overflow-x-auto py-1">
          <code>{curlCommand}</code>
        </pre>
      </div>
    </div>
  );
}
