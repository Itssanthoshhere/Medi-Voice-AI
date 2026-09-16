"use client";

import React from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap, Crown, Lock, Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";

type UpgradeModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason?: "credits" | "specialist";
  specialistName?: string;
};

export default function UpgradeModal({
  open,
  onOpenChange,
  reason = "credits",
  specialistName,
}: UpgradeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-2xl border border-gray-100 shadow-2xl bg-white">
        {/* Header theme crimson gradient banner */}
        <div className="relative bg-gradient-to-br from-[#a4161a] via-[#8b1116] to-[#600b0e] text-white p-7 overflow-hidden">
          {/* Ambient glow effects */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-rose-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3.5">
              <div className="inline-flex items-center gap-1.5 bg-white/15 border border-white/20 text-rose-100 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>MediVoice AI Pro</span>
              </div>
            </div>

            <DialogHeader>
              <DialogTitle className="text-2xl font-extrabold text-white flex items-center gap-2.5 tracking-tight">
                {reason === "specialist" ? (
                  <>
                    <div className="p-2 rounded-xl bg-white/10 border border-white/20 text-amber-300">
                      <Lock className="w-5 h-5" />
                    </div>
                    <span>Unlock {specialistName || "Specialist Doctors"}</span>
                  </>
                ) : (
                  <>
                    <div className="p-2 rounded-xl bg-white/10 border border-white/20 text-amber-300">
                      <Zap className="w-5 h-5 fill-amber-300" />
                    </div>
                    <span>Consultation Limit Reached</span>
                  </>
                )}
              </DialogTitle>
              <DialogDescription className="text-rose-100 text-xs mt-2 leading-relaxed">
                {reason === "specialist"
                  ? `Consultations with ${specialistName || "specialist AI doctors"} are exclusive to Pro and Clinic members.`
                  : "You have used all your free consultation credits. Upgrade your plan to continue consulting AI medical agents."}
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>

        {/* Feature benefits list */}
        <div className="p-6 space-y-4 bg-white">
          <div className="flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
            <span>What&apos;s included in Pro</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 7-Day Guarantee
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {[
              { title: "25 AI consultations / month", desc: "Full access whenever you need quick medical advice" },
              { title: "All 10+ AI Doctor Specialists", desc: "Pediatrician, Dermatologist, Cardiologist & more" },
              { title: "Clinical Reports & Export", desc: "Download & print structured diagnostic reports" },
              { title: "Priority AI Voice Engine", desc: "Natural voice conversations with zero lag" },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3 p-2.5 rounded-xl bg-gray-50 border border-gray-100 transition-all hover:bg-rose-50/40">
                <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-600 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-gray-900">{item.title}</h5>
                  <p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <Link href="/billing" onClick={() => onOpenChange(false)}>
              <Button className="w-full bg-[#a4161a] hover:bg-[#8b1116] text-white font-semibold flex items-center justify-center gap-2 h-11 rounded-xl shadow-md shadow-[#a4161a]/25 transition-all hover:scale-[1.01] active:scale-[0.99]">
                <Crown className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>View Subscription Plans & Upgrade</span>
                <ArrowRight className="w-4 h-4 ml-auto text-white/80" />
              </Button>
            </Link>
          </div>
        </div>

        <DialogFooter className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-[11px] text-gray-500">
          <span>Cancel anytime. No commitment.</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs text-gray-500 hover:text-gray-900 h-8"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
