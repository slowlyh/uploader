"use client";

import { useState } from "react";
import UploadZone from "@/components/UploadZone";
import UploadResult from "@/components/UploadResult";
import RecentUploads, { HistoryItem } from "@/components/RecentUploads";
import { UploadCloud, ShieldCheck, Zap } from "lucide-react";

export default function UploadPage() {
  const [uploadedData, setUploadedData] = useState<HistoryItem | null>(null);
  const [historyTrigger, setHistoryTrigger] = useState<HistoryItem | null>(null);

  const handleUploadSuccess = (data: HistoryItem) => {
    setUploadedData(data);
    setHistoryTrigger(data);
  };

  const handleReset = () => {
    setUploadedData(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-[#FFD028] border-2 border-black px-3 py-0.5 text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000] mb-3">
          <UploadCloud className="w-4 h-4" />
          <span>FILE HOSTING CONSOLE</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-black tracking-tight">
          Upload to HyuuCdn
        </h1>
        <p className="text-sm sm:text-base font-bold text-neutral-700 mt-2">
          Select file retention, drop your file, and receive an instant global CDN URL. Max file size is 10MB.
        </p>
      </div>

      {/* Main Upload or Result Area */}
      {uploadedData ? (
        <UploadResult data={uploadedData} onReset={handleReset} />
      ) : (
        <UploadZone onUploadSuccess={handleUploadSuccess} />
      )}

      {/* Recent Uploads History */}
      <RecentUploads lastUploadedItem={historyTrigger} />
    </div>
  );
}
