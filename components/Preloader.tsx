"use client";

import { useEffect, useState } from "react";
import { Zap, ShieldCheck, HardDrive, CheckCircle2 } from "lucide-react";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("INITIALIZING HYUUCDN...");
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // Check if user already saw the intro in this session
    const hasLoaded = sessionStorage.getItem("hyuucdn_has_loaded");
    if (hasLoaded) {
      setLoading(false);
      return;
    }

    const steps = [
      { p: 25, text: "CONNECTING TO FAST EDGE STORAGE...", icon: Zap },
      { p: 55, text: "MOUNTING SUPABASE STORAGE ENGINE...", icon: HardDrive },
      { p: 85, text: "ARMING 10MB RATE LIMIT ENFORCER...", icon: ShieldCheck },
      { p: 100, text: "READY TO SERVE CDN TRAFFIC!", icon: CheckCircle2 },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].p);
        setStatusText(steps[currentStep].text);
        setStepIndex(currentStep);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setLoading(false);
          sessionStorage.setItem("hyuucdn_has_loaded", "true");
        }, 400);
      }
    }, 380);

    return () => clearInterval(interval);
  }, []);

  if (!loading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F8F6F0] bg-grid-brutal px-4 transition-all duration-700 ease-in-out ${
        progress === 100 ? "opacity-0 pointer-events-none scale-95" : "opacity-100"
      }`}
    >
      <div className="w-full max-w-md brutal-card bg-white p-6 sm:p-8 relative">
        {/* Decorative corner tag */}
        <div className="absolute -top-4 -right-2 bg-[#FFD028] border-2 border-black px-3 py-0.5 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
          BOOT V1.0
        </div>

        {/* Brand header */}
        <div className="flex items-center gap-3 mb-5 border-b-2 border-black pb-4">
          <div className="w-10 h-10 bg-[#FFD028] border-2 border-black flex items-center justify-center font-black text-xl shadow-[2px_2px_0px_0px_#000]">
            ⚡
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-black flex items-center gap-1.5">
              Hyuu<span className="bg-[#A3E635] px-1.5 py-0.5 border border-black text-sm">CDN</span>
            </h2>
            <p className="text-xs font-mono font-bold text-neutral-600">
              FAST EDGE FILE HOSTING
            </p>
          </div>
        </div>

        {/* Status display */}
        <div className="mb-4 bg-[#F1EDE4] border-2 border-black p-3 font-mono text-xs">
          <div className="flex items-center justify-between text-neutral-600 mb-1">
            <span>SYS_CHECK</span>
            <span className="font-bold text-black">{progress}%</span>
          </div>
          <div className="text-black font-bold truncate flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-black animate-ping" />
            {statusText}
          </div>
        </div>

        {/* Neo-brutalist progress bar */}
        <div className="w-full h-7 bg-white border-2 border-black p-0.5 mb-5 shadow-[2px_2px_0px_0px_#000]">
          <div
            className="h-full bg-[#FFD028] progress-striped border border-black transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Feature badges */}
        <div className="grid grid-cols-3 gap-2 text-center font-mono text-[10px] font-bold">
          <div className="border border-black bg-[#A3E635]/20 py-1">
            MAX 10MB
          </div>
          <div className="border border-black bg-[#38BDF8]/20 py-1">
            7D / PERM
          </div>
          <div className="border border-black bg-[#FB7185]/20 py-1">
            REST API
          </div>
        </div>
      </div>
    </div>
  );
}
