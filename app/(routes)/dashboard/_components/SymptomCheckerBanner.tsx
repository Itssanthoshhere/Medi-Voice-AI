"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Stethoscope, ChevronRight, Activity, ShieldCheck } from "lucide-react";
import SymptomTriageWidget from "@/components/SymptomTriageWidget";

export default function SymptomCheckerBanner() {
  const [openTriage, setOpenTriage] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-r from-rose-900 via-[#a4161a] to-rose-950 p-6 sm:p-8 rounded-3xl text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        {/* Subtle Ambient Wave Highlights */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />

        <div className="space-y-2 max-w-xl z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/15 text-rose-100 border border-white/20 backdrop-blur-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              AI Clinical Triage Assistant
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Not sure which doctor to consult?
          </h2>
          <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed">
            Run our 3-step interactive AI symptom triage. Get an immediate urgency rating and auto-match with the ideal specialist agent among our 11 clinical doctors.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 z-10">
          <Button
            onClick={() => setOpenTriage(true)}
            className="bg-white text-[#a4161a] hover:bg-rose-50 font-extrabold text-xs h-11 px-6 rounded-2xl shadow-lg transition-all flex items-center gap-2"
          >
            <Stethoscope className="w-4 h-4 text-[#a4161a]" />
            Launch Symptom Checker
            <ChevronRight className="w-4 h-4 text-[#a4161a]" />
          </Button>
        </div>
      </div>

      <SymptomTriageWidget open={openTriage} onOpenChange={setOpenTriage} />
    </>
  );
}
