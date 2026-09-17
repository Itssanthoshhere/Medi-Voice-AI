"use client";

import React, { useEffect, useState } from "react";
import {
  Heart,
  PhoneCall,
  MessageSquare,
  X,
  Sparkles,
  ShieldCheck,
  Wind,
  HeartHandshake,
} from "lucide-react";

interface MentalHealthCrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchedTerms: string[];
}

const CRISIS_HOTLINES = [
  {
    name: "988 Lifeline",
    action: "Call or Text 988",
    href: "tel:988",
    detail: "US & Canada • Free, 24/7",
    icon: PhoneCall,
    primary: true,
  },
  {
    name: "Crisis Text Line",
    action: "Text HOME to 741741",
    href: "sms:741741?&body=HOME",
    detail: "US & UK • 24/7 Text Support",
    icon: MessageSquare,
    primary: false,
  },
  {
    name: "iCall Helpline",
    action: "Call 9152987821",
    href: "tel:9152987821",
    detail: "India • Mon-Sat 8am-10pm",
    icon: HeartHandshake,
    primary: false,
  },
];

const GROUNDING_STEPS = [
  "Take a slow, deep breath in for 4 seconds... hold for 4... exhale gently for 6.",
  "Look around and name 3 things you can see right now.",
  "Reach out to someone you trust — a family member, friend, or counselor.",
  "Remember: This heavy moment will pass. You are not alone in this.",
];

export default function MentalHealthCrisisModal({
  isOpen,
  onClose,
  matchedTerms,
}: MentalHealthCrisisModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
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
      {/* Animated calming ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] rounded-full bg-indigo-500/10 animate-[calmPulse_4s_ease-in-out_infinite]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[420px] sm:h-[420px] rounded-full bg-teal-400/8 animate-[calmPulse_4s_ease-in-out_1.5s_infinite]" />
      </div>

      {/* Modal Card */}
      <div
        className={`relative w-full max-w-md my-auto transition-all duration-500 ease-out ${
          mounted
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-6"
        }`}
      >
        {/* Outer glow ring with calming indigo/teal gradient */}
        <div className="absolute -inset-[2px] rounded-[22px] sm:rounded-[28px] bg-gradient-to-b from-indigo-500/50 via-teal-500/30 to-violet-900/50 blur-[1px]" />

        <div className="relative rounded-[20px] sm:rounded-[26px] overflow-hidden bg-[#0c0d14] border border-indigo-500/25 shadow-[0_0_45px_-10px_rgba(99,102,241,0.35)] sm:shadow-[0_0_80px_-20px_rgba(99,102,241,0.35)]">
          {/* ── Header ── */}
          <div className="relative px-4 pt-4 pb-2.5 sm:px-6 sm:pt-5 sm:pb-3 text-center overflow-hidden">
            {/* Soft gradient backdrop */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-indigo-950/60 via-violet-950/20 to-transparent pointer-events-none" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-10 p-1 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Calming glowing heart beacon */}
            <div className="relative mx-auto mb-2 sm:mb-3 w-[48px] h-[48px] sm:w-[60px] sm:h-[60px] flex items-center justify-center">
              {/* Gentle breathing rings */}
              <span className="absolute inset-0 rounded-full border-2 border-indigo-400/40 animate-[calmRing_3s_ease-out_infinite]" />
              <span className="absolute inset-[-4px] sm:inset-[-6px] rounded-full border border-teal-400/25 animate-[calmRing_3s_ease-out_0.8s_infinite]" />
              {/* Center icon */}
              <div className="relative z-10 w-[38px] h-[38px] sm:w-[46px] sm:h-[46px] rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-teal-400 flex items-center justify-center shadow-[0_0_30px_4px_rgba(99,102,241,0.4)]">
                <Heart className="w-4.5 h-4.5 sm:w-6 sm:h-6 text-white fill-white/20 drop-shadow-md" />
              </div>
            </div>

            {/* Gentle badge + Title */}
            <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2.5 sm:px-3 py-0.5 rounded-full mb-1">
              <Sparkles className="w-2.5 h-2.5" />
              Support & Wellbeing Check
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-tight">
              You Are Not Alone
            </h2>
            <p className="text-[11px] sm:text-[12px] text-indigo-200/80 mt-0.5 max-w-[290px] sm:max-w-sm mx-auto leading-snug">
              We noticed you may be carrying a lot right now. Help and
              compassionate human support are available 24/7.
            </p>
          </div>

          {/* ── Body ── */}
          <div className="px-3.5 pb-3.5 sm:px-4 sm:pb-4 space-y-2.5 sm:space-y-3">
            {/* Detected emotional concern */}
            <div className="rounded-xl sm:rounded-2xl bg-indigo-500/[0.08] border border-indigo-500/20 p-2.5 sm:p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-indigo-400" />
                Flagged for Your Safety
              </p>
              <div className="flex flex-wrap gap-1.5">
                {(matchedTerms.length > 0
                  ? matchedTerms
                  : ["Emotional distress detected"]
                ).map((term, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[11px] sm:text-[12px] font-medium text-indigo-200 bg-indigo-500/20 border border-indigo-500/30 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    {term}
                  </span>
                ))}
              </div>
            </div>

            {/* Dedicated Crisis Support Hotlines */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5 px-1">
                Free & Confidential Support Lines
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-2">
                {CRISIS_HOTLINES.map((hotline, idx) => {
                  const Icon = hotline.icon;
                  return (
                    <a
                      key={idx}
                      href={hotline.href}
                      className={`group relative flex flex-col items-center sm:items-start p-2 sm:p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                        hotline.primary
                          ? "bg-indigo-500/15 border-indigo-500/40 hover:bg-indigo-500/25 hover:border-indigo-400"
                          : "bg-white/[0.04] border-white/[0.06] hover:border-indigo-500/30 hover:bg-indigo-500/10"
                      }`}
                    >
                      <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                        <Icon className="w-3 h-3 text-indigo-300" />
                      </div>
                      <span className="text-[11px] sm:text-[12px] font-bold text-white leading-tight">
                        {hotline.name}
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-semibold text-teal-300 leading-tight">
                        {hotline.action}
                      </span>
                      <span className="text-[9px] text-zinc-400 mt-0.5 leading-tight">
                        {hotline.detail}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Gentle Grounding Steps */}
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-2.5 sm:p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-teal-300 mb-1.5 flex items-center gap-1.5">
                <Wind className="w-3 h-3 text-teal-400" />
                Gentle Grounding Right Now
              </p>
              <ol className="space-y-1">
                {GROUNDING_STEPS.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="shrink-0 w-4 h-4 rounded bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-[9px] font-bold text-indigo-300 mt-[1px]">
                      {idx + 1}
                    </span>
                    <span className="text-[11px] sm:text-[11.5px] text-zinc-300 leading-snug">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-0.5">
              <a
                href="tel:988"
                className="flex-1 flex items-center justify-center gap-2 py-2 sm:py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-bold text-[12px] sm:text-[13px] shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:shadow-indigo-500/40 active:scale-[0.98] cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Call 988 Lifeline
              </a>
              <button
                onClick={onClose}
                className="px-4 py-2 sm:py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.1] font-semibold text-[12px] sm:text-[13px] transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                I'm Safe
              </button>
            </div>

            {/* Disclaimer */}
            <p className="text-[9px] text-zinc-500 text-center leading-relaxed px-1">
              MediVoice AI is here to listen, but is not a replacement for
              professional clinical therapy or crisis intervention. If in
              immediate danger, please reach out to local emergency services.
            </p>
          </div>
        </div>
      </div>

      {/* Custom keyframes */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes calmPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.35; }
          50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.1; }
        }
        @keyframes calmRing {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
      `,
        }}
      />
    </div>
  );
}
