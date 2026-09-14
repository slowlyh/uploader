"use client";

import { useEffect, useState } from "react";
import { Copy, Check, ExternalLink, Trash2, Clock, ShieldCheck, History } from "lucide-react";
import { formatBytes, formatDate, timeRemaining } from "@/lib/utils";

export interface HistoryItem {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  expired: "7d" | "permanent";
  expires_at: string | null;
  created_at: string;
}

export default function RecentUploads({
  lastUploadedItem,
}: {
  lastUploadedItem?: HistoryItem | null;
}) {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("hyuucdn_history");
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (!lastUploadedItem) return;

    setItems((prev) => {
      // Prevent duplicates
      const filtered = prev.filter((i) => i.id !== lastUploadedItem.id);
      const updated = [lastUploadedItem, ...filtered].slice(0, 20); // Keep max 20
      try {
        localStorage.setItem("hyuucdn_history", JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  }, [lastUploadedItem]);

  const copyLink = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const removeItem = (id: string) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    try {
      localStorage.setItem("hyuucdn_history", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const clearAll = () => {
    setItems([]);
    try {
      localStorage.removeItem("hyuucdn_history");
    } catch (e) {
      console.error(e);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="w-full mt-10">
      <div className="flex items-center justify-between mb-4 border-b-3 border-black pb-2">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-black" />
          <h3 className="font-black text-lg text-black uppercase tracking-tight">
            Recent Uploads (Your Browser)
          </h3>
        </div>

        <button
          onClick={clearAll}
          className="text-xs font-mono font-bold text-neutral-600 hover:text-red-600 underline"
        >
          Clear History
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const isCopied = copiedId === item.id;
          return (
            <div
              key={item.id}
              className="brutal-card bg-white p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-black text-sm text-black truncate max-w-[240px] sm:max-w-md">
                    {item.name}
                  </span>
                  {item.expired === "permanent" ? (
                    <span className="bg-[#A3E635] text-black text-[10px] font-black px-1.5 py-0.2 border border-black">
                      PERM
                    </span>
                  ) : (
                    <span className="bg-[#FFD028] text-black text-[10px] font-black px-1.5 py-0.2 border border-black">
                      7 DAYS
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs font-mono font-bold text-neutral-600">
                  <span>{formatBytes(item.size)}</span>
                  <span>•</span>
                  <span>{timeRemaining(item.expires_at)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => copyLink(item.id, item.url)}
                  className={`px-3 py-1.5 border-2 border-black font-mono text-xs font-bold shadow-[2px_2px_0px_0px_#000] flex items-center gap-1.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                    isCopied ? "bg-[#A3E635]" : "bg-[#FFD028] hover:bg-amber-400"
                  }`}
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? "COPIED" : "COPY LINK"}</span>
                </button>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 border-2 border-black bg-white hover:bg-neutral-100 shadow-[2px_2px_0px_0px_#000]"
                  title="Open file"
                >
                  <ExternalLink className="w-4 h-4 text-black" />
                </a>

                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 border-2 border-black bg-[#FB7185]/30 hover:bg-[#FB7185] shadow-[2px_2px_0px_0px_#000]"
                  title="Remove from history"
                >
                  <Trash2 className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
