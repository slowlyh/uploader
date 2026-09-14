"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { UploadCloud, File, AlertCircle, Clock, ShieldCheck, Check, Sparkles } from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface UploadZoneProps {
  onUploadSuccess: (data: any) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function UploadZone({ onUploadSuccess }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [expiredType, setExpiredType] = useState<"7d" | "permanent">("7d");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFile = (file: File) => {
    setErrorMessage(null);
    if (file.size > MAX_FILE_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setErrorMessage(`File size is ${sizeMb} MB. Maximum allowed limit is 10 MB.`);
      setSelectedFile(null);
      return false;
    }
    setSelectedFile(file);
    return true;
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(15);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("expired", expiredType);

    try {
      // Simulate progress indicator
      const progressTimer = setInterval(() => {
        setUploadProgress((prev) => (prev < 85 ? prev + 15 : prev));
      }, 200);

      const response = await fetch("/v1/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressTimer);
      setUploadProgress(95);

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to upload file");
      }

      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setSelectedFile(null);
        setUploadProgress(0);
        onUploadSuccess(result.data);
      }, 350);
    } catch (err) {
      setIsUploading(false);
      setUploadProgress(0);
      const msg = err instanceof Error ? err.message : "Upload error";
      setErrorMessage(msg);
    }
  };

  return (
    <div className="w-full">
      {/* Expiration Mode Selector */}
      <div className="mb-6 brutal-card bg-white p-4">
        <label className="block text-xs font-black uppercase tracking-wider text-black mb-3">
          1. Select File Expiration Policy
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* 7 Days Option */}
          <button
            type="button"
            onClick={() => setExpiredType("7d")}
            className={`p-4 border-3 border-black text-left flex items-start gap-3 transition-all ${
              expiredType === "7d"
                ? "bg-[#FFD028] shadow-[4px_4px_0px_0px_#000] translate-x-[-2px] translate-y-[-2px]"
                : "bg-white hover:bg-[#F8F6F0] shadow-[2px_2px_0px_0px_#000]"
            }`}
          >
            <div className="w-8 h-8 rounded-none border-2 border-black bg-white flex items-center justify-center font-bold text-black shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-black">7 Days Temporary</span>
                <span className="bg-black text-white text-[10px] font-mono px-1.5 py-0.2">
                  AUTO-DELETE
                </span>
              </div>
              <p className="text-xs font-medium text-neutral-700 mt-1">
                File automatically self-destructs after 7 days. Ideal for quick sharing and temporary assets.
              </p>
            </div>
          </button>

          {/* Permanent Option */}
          <button
            type="button"
            onClick={() => setExpiredType("permanent")}
            className={`p-4 border-3 border-black text-left flex items-start gap-3 transition-all ${
              expiredType === "permanent"
                ? "bg-[#A3E635] shadow-[4px_4px_0px_0px_#000] translate-x-[-2px] translate-y-[-2px]"
                : "bg-white hover:bg-[#F8F6F0] shadow-[2px_2px_0px_0px_#000]"
            }`}
          >
            <div className="w-8 h-8 rounded-none border-2 border-black bg-white flex items-center justify-center font-bold text-black shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-black">Permanent CDN</span>
                <span className="bg-black text-white text-[10px] font-mono px-1.5 py-0.2">
                  FOREVER
                </span>
              </div>
              <p className="text-xs font-medium text-neutral-700 mt-1">
                Never expires. Permanent direct URL hosted on global Supabase Edge Storage.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Error Message banner */}
      {errorMessage && (
        <div className="mb-6 brutal-card bg-[#FB7185] p-4 flex items-start gap-3 text-black">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <span className="font-black uppercase text-xs tracking-wider block">Upload Blocked</span>
            <p className="text-sm font-bold">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Drag & Drop Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`brutal-card cursor-pointer p-8 sm:p-12 text-center transition-all ${
          isDragging
            ? "bg-[#FFD028] border-dashed border-4 border-black scale-[1.01]"
            : selectedFile
            ? "bg-[#A3E635]/20 border-3 border-black"
            : "bg-white border-3 border-black hover:bg-[#FAF8F2]"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#FFD028] border-3 border-black mx-auto mb-4 flex items-center justify-center shadow-[4px_4px_0px_0px_#000]">
          <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
        </div>

        {selectedFile ? (
          <div>
            <div className="inline-flex items-center gap-2 bg-black text-white px-3 py-1 text-xs font-mono font-bold mb-3">
              <Check className="w-3.5 h-3.5 text-[#A3E635]" />
              FILE READY FOR UPLOAD
            </div>
            <h3 className="text-lg sm:text-xl font-black text-black break-all max-w-lg mx-auto">
              {selectedFile.name}
            </h3>
            <p className="text-sm font-mono font-bold text-neutral-700 mt-1">
              Size: {formatBytes(selectedFile.size)} • Type: {selectedFile.type || "unknown"}
            </p>
            <p className="text-xs font-bold text-neutral-500 mt-3 underline">
              Click to choose another file
            </p>
          </div>
        ) : (
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-black mb-2">
              Drag & Drop file here, or <span className="underline decoration-3 decoration-[#FFD028]">Browse</span>
            </h3>
            <p className="text-sm font-medium text-neutral-600 max-w-md mx-auto">
              Supports images, documents, audio, video, archives, and code files up to 10MB.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 font-mono text-xs font-bold">
              <span className="bg-[#E2E8F0] border border-black px-2 py-0.5">MAX: 10MB</span>
              <span className="bg-[#E2E8F0] border border-black px-2 py-0.5">RATE LIMIT: 10/MIN</span>
              <span className="bg-[#E2E8F0] border border-black px-2 py-0.5">PUBLIC CDN</span>
            </div>
          </div>
        )}
      </div>

      {/* Upload Action & Progress */}
      {selectedFile && (
        <div className="mt-6 brutal-card bg-white p-5">
          {isUploading ? (
            <div>
              <div className="flex items-center justify-between mb-2 font-mono text-xs font-black">
                <span>UPLOADING TO SUPABASE EDGE...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-8 bg-white border-3 border-black p-0.5 shadow-[3px_3px_0px_0px_#000]">
                <div
                  className="h-full bg-[#FFD028] progress-striped border border-black transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-neutral-500 uppercase">Selected Policy</span>
                <p className="text-base font-black text-black">
                  {expiredType === "7d" ? "🕒 Auto-delete in 7 days" : "🛡️ Permanent storage (Never expires)"}
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="w-full sm:w-auto px-4 py-3 border-3 border-black bg-[#E2E8F0] font-black text-sm shadow-[3px_3px_0px_0px_#000] hover:bg-neutral-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpload}
                  className="w-full sm:w-auto px-6 py-3 border-3 border-black bg-[#FFD028] font-black text-base shadow-[4px_4px_0px_0px_#000] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>UPLOAD FILE NOW</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
