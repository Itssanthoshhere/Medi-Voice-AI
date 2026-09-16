"use client";

import React, { useState } from "react";
import Image from "next/image";
import { DoctorAgent } from "@/shared/list";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Stethoscope,
  Mic,
  ShieldCheck,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  Award,
  Loader2,
} from "lucide-react";

type DoctorProfileModalProps = {
  doctor: DoctorAgent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartConsultation: (doctor: DoctorAgent, notes: string) => void;
  isLocked?: boolean;
  loading?: boolean;
};

export default function DoctorProfileModal({
  doctor,
  open,
  onOpenChange,
  onStartConsultation,
  isLocked = false,
  loading = false,
}: DoctorProfileModalProps) {
  const [note, setNote] = useState<string>("");

  if (!doctor) return null;

  const doctorDisplayName =
    doctor.doctorName || `Dr. ${doctor.voiceId || "Specialist"}`;

  const handleStart = () => {
    onStartConsultation(doctor, note);
  };

  const handlePromptClick = (promptText: string) => {
    setNote(promptText);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden rounded-3xl border-0 shadow-2xl">
        {/* Top Header Background Banner */}
        <div className="relative bg-gradient-to-br from-rose-900 via-[#8b1116] to-slate-900 text-white p-6 sm:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <Image
                src={doctor.image}
                alt={doctor.specialist}
                width={100}
                height={100}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-white/20 shadow-xl"
              />
              {isLocked ? (
                <span className="absolute -top-2 -right-2 bg-[#a4161a] text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/30 flex items-center gap-1 shadow-md">
                  <Lock className="w-3 h-3 text-amber-300" /> PRO
                </span>
              ) : (
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/30 flex items-center gap-1 shadow-md">
                  <CheckCircle2 className="w-3 h-3" /> Free
                </span>
              )}
            </div>

            {/* Doctor Info Header */}
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-white/10 text-rose-200 px-2.5 py-0.5 rounded-full border border-white/10">
                  {doctor.specialist}
                </span>
                {doctor.experience && (
                  <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                    <Award className="w-3 h-3" /> {doctor.experience}
                  </span>
                )}
              </div>

              <DialogTitle className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {doctorDisplayName}
              </DialogTitle>

              <DialogDescription className="text-xs text-rose-100/90 leading-relaxed line-clamp-2">
                {doctor.description}
              </DialogDescription>

              {/* Neural Voice Accent Badge */}
              <div className="pt-1 flex items-center gap-2 text-[11px] text-emerald-300 font-medium">
                <Mic className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  Voice Engine: {doctor.voiceId} (
                  {doctor.gender || "Neural Voice"})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 bg-white max-h-[70vh] overflow-y-auto">
          {/* Areas of Expertise */}
          {doctor.treats && doctor.treats.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-[#a4161a]" />
                Specialized Clinical Expertise
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {doctor.treats.map((treat, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium px-3 py-1 rounded-full bg-rose-50 text-[#a4161a] border border-rose-100"
                  >
                    {treat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sample Prompts */}
          {doctor.samplePrompts && doctor.samplePrompts.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                Tap a Sample Symptom to Try
              </h4>
              <div className="grid gap-2">
                {doctor.samplePrompts.map((promptText, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePromptClick(promptText)}
                    className="text-left text-xs p-2.5 rounded-xl bg-gray-50 hover:bg-rose-50/70 border border-gray-200/80 hover:border-rose-200 text-gray-700 hover:text-[#a4161a] transition-colors flex items-center justify-between group"
                  >
                    <span>&ldquo;{promptText}&rdquo;</span>
                    <Sparkles className="w-3.5 h-3.5 text-gray-400 group-hover:text-amber-500 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Symptom Input Textarea */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-gray-900 flex items-center justify-between">
              <span>Your Symptoms or Consultation Note (Optional)</span>
              <span className="text-[11px] text-gray-400 font-normal">
                Pre-session context
              </span>
            </label>
            <Textarea
              placeholder={`Describe symptoms for ${doctorDisplayName} (e.g., duration, severity)...`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[90px] text-xs rounded-xl border-gray-200 focus:border-[#a4161a]"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl text-xs font-semibold"
            >
              Close
            </Button>

            <Button
              type="button"
              disabled={loading}
              onClick={handleStart}
              className={`rounded-xl text-xs font-bold px-5 h-10 flex items-center gap-2 text-white transition-all shadow-md ${
                isLocked
                  ? "bg-gradient-to-r from-[#a4161a] to-[#8b1116] hover:from-[#8b1116] hover:to-[#720e12] shadow-[#a4161a]/25"
                  : "bg-[#a4161a] hover:bg-[#8b1116] shadow-[#a4161a]/20"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Starting Call...
                </>
              ) : isLocked ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-300" /> Unlock{" "}
                  {doctor.specialist}
                </>
              ) : (
                <>
                  <span>Consult {doctorDisplayName}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
