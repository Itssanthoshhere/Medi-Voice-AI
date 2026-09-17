"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Heart,
  Sparkles,
  ShieldCheck,
  MessageSquareHeart,
  PhoneCall,
  ArrowRight,
  Loader2,
  Wind,
  Smile,
  Moon,
  CloudRain,
  Flame,
} from "lucide-react";
import { AIDoctorAgents } from "@/shared/list";

const QUICK_MOODS = [
  {
    label: "Feeling Overwhelmed",
    icon: Flame,
    prompt:
      "I am feeling overwhelmed with everything going on right now and need emotional support.",
    desc: "Work, study, or life stress",
  },
  {
    label: "Can't Sleep & Anxious",
    icon: Moon,
    prompt:
      "My mind won't stop racing and anxiety is making it really hard to sleep.",
    desc: "Late-night racing thoughts",
  },
  {
    label: "Low Mood & Sadness",
    icon: CloudRain,
    prompt:
      "I've been feeling down and low on energy lately, and I don't know who to talk to.",
    desc: "Need gentle emotional comfort",
  },
  {
    label: "Just Need to Vent",
    icon: Smile,
    prompt:
      "I just need a safe, non-judgmental space to talk through some things on my mind.",
    desc: "Safe, non-judgmental listening",
  },
];

export default function MentalHealthSection() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const mayaAgent = AIDoctorAgents.find(
    (a) => a.specialist === "Mental Health Counsellor"
  ) || {
    id: 11,
    specialist: "Mental Health Counsellor",
    doctorName: "Dr. Maya",
    image: "/doctor11.jpg",
    agentPrompt: "Mental Health Counsellor",
    subscriptionRequired: false,
  };

  const handleStartSession = async (customPrompt?: string) => {
    try {
      setLoading(true);
      const promptToUse =
        customPrompt ||
        "Emotional wellness consultation and supportive conversation.";

      const res = await axios.post("/api/session-chat", {
        notes: promptToUse,
        selectedDoctor: mayaAgent,
      });

      if (res.data?.sessionId) {
        router.push(`/dashboard/medical-agent/${res.data.sessionId}`);
      }
    } catch (err) {
      console.error("Failed to start mental health session:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="font-extrabold text-xl text-gray-900 tracking-tight">
          Mental Health & Emotional{" "}
          <span className="italic font-serif font-normal text-[#a4161a]">
            Counselling
          </span>
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          A dedicated, private space for compassionate emotional support, anxiety
          decompression, and coping tools.
        </p>
      </div>

      {/* Main Feature Canvas */}
      <div className="relative overflow-hidden rounded-3xl border border-rose-100 bg-gradient-to-br from-white via-rose-50/25 to-gray-50/50 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8">
          {/* Left Side: Avatar + Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar container */}
            <div className="relative shrink-0">
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-2xl border-2 border-rose-200/80 bg-slate-100 shadow-md">
                <Image
                  src={mayaAgent.image || "/doctor11.jpg"}
                  alt="Dr. Maya - Mental Health Counsellor"
                  fill
                  sizes="112px"
                  className="object-cover object-top"
                />
              </div>
              {/* Status Badge */}
              <div className="absolute -bottom-2 -right-2 flex items-center gap-1 rounded-full bg-emerald-600 border-2 border-white px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                Available 24/7
              </div>
            </div>

            {/* Content Details */}
            <div className="space-y-2 max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#a4161a] bg-rose-50 border border-rose-200/80 px-2.5 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3 text-[#a4161a]" />
                  Emotional Wellness Companion
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  100% Free & Confidential
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
                Dr. Maya{" "}
                <span className="text-xs sm:text-sm font-normal text-gray-500 font-sans">
                  (AI Mental Health Counsellor)
                </span>
              </h3>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Connect for non-judgmental active listening, calming anxiety
                decompression, and healthy emotional coping.{" "}
                <strong className="text-gray-900 font-medium">
                  Strictly zero medication prescribed
                </strong>{" "}
                — designed entirely around your emotional wellbeing.
              </p>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-gray-600">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Zero Medications
                </span>
                <span className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-[#a4161a]" />
                  Compassionate Listening
                </span>
                <span className="flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-indigo-600" />
                  Mindfulness & Grounding
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: CTA Button & Crisis Hotline */}
          <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 items-stretch lg:items-end justify-center">
            <button
              onClick={() => handleStartSession()}
              disabled={loading}
              className="group flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#a4161a] hover:bg-[#8b1116] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connecting with Dr. Maya...
                </>
              ) : (
                <>
                  <MessageSquareHeart className="w-4 h-4 text-rose-200" />
                  Talk with Dr. Maya
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <a
              href="tel:988"
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200/80 hover:border-rose-300 text-[11px] text-gray-600 hover:text-[#a4161a] transition-all text-center cursor-pointer shadow-2xs"
            >
              <PhoneCall className="w-3 h-3 text-[#a4161a]" />
              <span>
                Crisis support? Call/Text <strong>988</strong> Lifeline (24/7)
              </span>
            </a>
          </div>
        </div>

        {/* Quick Mood Prompts */}
        <div className="mt-6 pt-5 border-t border-gray-200/70">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#a4161a]" />
            Select how you're feeling to begin:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {QUICK_MOODS.map((mood, idx) => {
              const Icon = mood.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleStartSession(mood.prompt)}
                  disabled={loading}
                  className="group flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200/80 hover:border-[#a4161a]/40 hover:bg-rose-50/40 transition-all duration-200 text-left shadow-2xs hover:shadow-sm cursor-pointer"
                >
                  <div className="h-8 w-8 rounded-lg bg-rose-50 group-hover:bg-[#a4161a]/10 flex items-center justify-center shrink-0 transition-colors">
                    <Icon className="w-4 h-4 text-[#a4161a] transition-colors" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-900 group-hover:text-[#a4161a] truncate transition-colors">
                      {mood.label}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate">
                      {mood.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
