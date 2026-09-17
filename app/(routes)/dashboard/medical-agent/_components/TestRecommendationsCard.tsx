"use client";

import React from "react";
import {
  Stethoscope,
  CheckCircle2,
  ShieldAlert,
  Sparkles,
  TestTube2,
} from "lucide-react";

export interface RecommendedTest {
  testName: string;
  category?: string;
  rationale: string;
  priority?: "High" | "Recommended" | "Optional" | string;
}

interface TestRecommendationsCardProps {
  tests: RecommendedTest[];
}

export default function TestRecommendationsCard({
  tests,
}: TestRecommendationsCardProps) {
  if (!tests || tests.length === 0) return null;

  return (
    <div className="w-full my-4 rounded-3xl bg-white border border-rose-200/80 shadow-md overflow-hidden font-sans space-y-0 text-gray-800">
      <div className="bg-gradient-to-r from-red-900 via-rose-900 to-slate-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-white/10 text-rose-300">
            <TestTube2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-rose-300">
              CLINICAL TRIAGE ASSESSMENT
            </span>
            <h4 className="text-sm font-extrabold text-white">
              Recommended Diagnostic Lab Tests
            </h4>
          </div>
        </div>
        <span className="text-[10px] font-bold bg-white/15 px-2.5 py-0.5 rounded-full text-white">
          Symptom-Indicated
        </span>
      </div>

      <div className="p-4 space-y-3 bg-gradient-to-b from-rose-50/20 to-white">
        <p className="text-xs text-gray-600 leading-relaxed">
          Based on your described symptoms, your AI specialist recommends
          discussing the following diagnostic panels with your doctor:
        </p>

        <div className="space-y-2.5">
          {tests.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-white border border-gray-200/80 shadow-2xs space-y-1 hover:border-rose-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-gray-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  {item.testName}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                  {item.priority || "Indicated"}
                </span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed pl-5">
                {item.rationale}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-3 text-[11px] text-gray-500 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#a4161a] shrink-0" />
          <span>
            Diagnostic test recommendations are AI-assisted suggestions based on
            symptom patterns. Final lab requisitions must be issued by a
            registered doctor.
          </span>
        </div>
      </div>
    </div>
  );
}
