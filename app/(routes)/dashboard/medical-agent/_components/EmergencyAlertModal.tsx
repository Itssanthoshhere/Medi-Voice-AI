"use client";

import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  PhoneCall,
  X,
  HeartPulse,
  Siren,
  ShieldAlert,
} from "lucide-react";

interface EmergencyAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchedTerms: string[];
}

const EMERGENCY_LINES = [
  {
    label: "Emergency",
    region: "US / Global",
    num: "911",
    icon: Siren,
  },
  {
    label: "Universal",
    region: "International",
    num: "112",
    icon: PhoneCall,
  },
  {
    label: "Ambulance",
    region: "India",
    num: "102",
    icon: HeartPulse,
  },
];

const IMMEDIATE_STEPS = [
  "Stay calm — sit or lie down in a safe, stable position.",
  "Ask someone nearby to call emergency services or drive you to the nearest ER.",
  "Do not operate a vehicle if you feel faint, dizzy, or in severe pain.",
  "If prescribed, take emergency medication (e.g. aspirin for suspected cardiac events).",
];

export default function EmergencyAlertModal({
  isOpen,
  onClose,
  matchedTerms,
}: EmergencyAlertModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Small delay so the CSS transition kicks in
      const t = setTimeout(() => setMounted(true), 30);
      return () => clearTimeout(t);
    } else {
      setMounted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-2 sm:p-4 transition-all duration-300 overflow-y-auto ${
        mounted
          ? "bg-black/80 backdrop-blur-xl"
          : "bg-black/0 backdrop-blur-none"
      }`}
      style={{ perspective: "1200px" }}
    >
      {/* Animated background radial pulse */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] rounded-full bg-red-600/10 animate-[emergencyPing_2.5s_ease-out_infinite]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] rounded-full bg-red-500/8 animate-[emergencyPing_2.5s_ease-out_0.8s_infinite]" />
      </div>

      {/* Modal Card */}
      <div
        className={`relative w-full max-w-md my-auto transition-all duration-500 ease-out ${
          mounted
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-6"
        }`}
      >
        {/* Outer glow ring */}
        <div className="absolute -inset-[2px] rounded-[22px] sm:rounded-[28px] bg-gradient-to-b from-red-500/60 via-red-600/40 to-red-900/60 blur-[1px]" />

        <div className="relative rounded-[20px] sm:rounded-[26px] overflow-hidden bg-[#0c0c0f] border border-red-500/20 shadow-[0_0_40px_-10px_rgba(220,38,38,0.4)] sm:shadow-[0_0_80px_-20px_rgba(220,38,38,0.4)]">
          {/* ── Header ── */}
          <div className="relative px-4 pt-4 pb-2.5 sm:px-6 sm:pt-5 sm:pb-3 text-center overflow-hidden">
            {/* Subtle top gradient */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-red-950/50 to-transparent pointer-events-none" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-10 p-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Pulsing icon beacon */}
            <div className="relative mx-auto mb-2 sm:mb-3 w-[48px] h-[48px] sm:w-[60px] sm:h-[60px] flex items-center justify-center">
              {/* Animated rings */}
              <span className="absolute inset-0 rounded-full border-2 border-red-500/40 animate-[emergencyRing_2s_ease-out_infinite]" />
              <span className="absolute inset-[-3px] sm:inset-[-5px] rounded-full border border-red-500/20 animate-[emergencyRing_2s_ease-out_0.5s_infinite]" />
              <span className="absolute inset-[-6px] sm:inset-[-10px] rounded-full border border-red-500/10 animate-[emergencyRing_2s_ease-out_1s_infinite]" />
              {/* Core icon */}
              <div className="relative z-10 w-[38px] h-[38px] sm:w-[46px] sm:h-[46px] rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-[0_0_30px_4px_rgba(220,38,38,0.35)]">
                <AlertTriangle className="w-4.5 h-4.5 sm:w-6 sm:h-6 text-white drop-shadow-md" />
              </div>
            </div>

            {/* Badge + Title */}
            <span className="inline-block text-[9px] sm:text-[10px] font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 sm:px-3 py-0.5 rounded-full mb-1">
              Critical Safety Override
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-tight">
              Emergency Detected
            </h2>
            <p className="text-[11px] sm:text-[12px] text-red-200/70 mt-0.5 max-w-[280px] sm:max-w-xs mx-auto leading-snug">
              MediVoice AI has detected symptoms that may require{" "}
              <strong className="text-red-300">
                immediate medical attention
              </strong>
              .
            </p>
          </div>

          {/* ── Body ── */}
          <div className="px-3.5 pb-3.5 sm:px-4 sm:pb-4 space-y-2.5 sm:space-y-3">
            {/* Detected symptoms */}
            <div className="rounded-xl sm:rounded-2xl bg-red-500/[0.07] border border-red-500/15 p-2.5 sm:p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-red-400 mb-1.5 flex items-center gap-1.5">
                <ShieldAlert className="w-3 h-3" />
                Flagged Symptoms
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(matchedTerms.length > 0
                  ? matchedTerms
                  : ["Critical symptoms detected"]
                ).map((term, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] sm:text-[12px] font-semibold text-red-200 bg-red-500/15 border border-red-500/20 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                    {term}
                  </span>
                ))}
              </div>
            </div>

            {/* Emergency hotlines */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5 px-1">
                Call Emergency Services
              </p>
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                {EMERGENCY_LINES.map((line) => {
                  const Icon = line.icon;
                  return (
                    <a
                      key={line.num}
                      href={`tel:${line.num}`}
                      className="group relative flex flex-col items-center gap-0.5 p-2 sm:p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:border-red-500/40 hover:bg-red-500/10 transition-all duration-200 text-center cursor-pointer"
                    >
                      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 flex items-center justify-center transition-colors">
                        <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-400 group-hover:text-red-300 transition-colors" />
                      </div>
                      <span className="text-sm sm:text-lg font-extrabold text-white tracking-tight leading-none">
                        {line.num}
                      </span>
                      <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400 font-medium leading-tight transition-colors">
                        {line.label}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Immediate steps */}
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-2.5 sm:p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5 flex items-center gap-1.5">
                <HeartPulse className="w-3 h-3 text-red-400" />
                Immediate Steps
              </p>
              <ol className="space-y-1">
                {IMMEDIATE_STEPS.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="shrink-0 w-4 h-4 rounded bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-[9px] font-bold text-zinc-400 mt-[1px]">
                      {idx + 1}
                    </span>
                    <span className="text-[11px] sm:text-[11.5px] text-zinc-400 leading-snug">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-0.5">
              <a
                href="tel:911"
                className="flex-1 flex items-center justify-center gap-2 py-2 sm:py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white font-bold text-[12px] sm:text-[13px] shadow-lg shadow-red-500/20 transition-all duration-200 hover:shadow-red-500/30 active:scale-[0.98] cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Call 911 Now
              </a>
              <button
                onClick={onClose}
                className="px-4 py-2 sm:py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.1] font-semibold text-[12px] sm:text-[13px] transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                Dismiss
              </button>
            </div>

            {/* Disclaimer */}
            <p className="text-[9px] text-zinc-600 text-center leading-relaxed px-1">
              This AI is not a substitute for professional medical care. Always
              confirm with a licensed provider.
            </p>
          </div>
        </div>
      </div>

      {/* Custom keyframes */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes emergencyPing {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(1.6); opacity: 0; }
        }
        @keyframes emergencyRing {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `,
        }}
      />
    </div>
  );
}
