"use client";

import React, { useState } from "react";
import Image from "next/image";
import useRouter from "next/navigation";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Stethoscope,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Loader2,
  ShieldAlert,
  HelpCircle,
  HeartPulse,
  PhoneCall,
  X,
  Zap,
} from "lucide-react";
import { AIDoctorAgents, DoctorAgent } from "@/shared/list";

export type SymptomTriageWidgetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const BODY_REGIONS = [
  { id: "General", label: "General / Fever / Cold", icon: "🩺", desc: "Everyday health, fatigue, infection" },
  { id: "Chest / Heart", label: "Chest & Heart", icon: "🫀", desc: "Palpitations, BP, tightness" },
  { id: "Throat / Ear / Nose", label: "Throat, Ear & Sinus", icon: "👂", desc: "Cough, sinus pressure, ear pain" },
  { id: "Skin & Hair", label: "Skin & Dermatological", icon: "✨", desc: "Rashes, acne, hives, irritation" },
  { id: "Bones & Joints", label: "Bones, Joints & Back", icon: "🦴", desc: "Lower back pain, knee stiffness" },
  { id: "Mental Health", label: "Mental & Emotional", icon: "💭", desc: "Anxiety, stress, burnout, low mood" },
  { id: "Diet & Digestive", label: "Digestive & Nutrition", icon: "🍏", desc: "Bloating, diet goals, stomach" },
  { id: "Women's Health", label: "Women's Health", icon: "🌸", desc: "Menstrual cramps, hormonal balance" },
  { id: "Dental & Mouth", label: "Dental & Oral Hygiene", icon: "🦷", desc: "Toothache, gums, sensitivity" },
  { id: "Child Care", label: "Child & Infant Care", icon: "👶", desc: "Pediatric fever, toddler rash" },
];

const SAMPLE_SYMPTOMS_BY_REGION: Record<string, string[]> = {
  "General": ["Fever", "Fatigue", "Body aches", "Headache", "Chills", "Loss of appetite"],
  "Chest / Heart": ["Heart flutterings", "Elevated blood pressure", "Dizziness when standing", "Mild shortness of breath"],
  "Throat / Ear / Nose": ["Sore throat", "Sinus pressure", "Blocked ear", "Persistent cough", "Nasal congestion"],
  "Skin & Hair": ["Itchy rash", "Sudden acne breakout", "Dry peeling skin", "Scalp irritation", "Red hives"],
  "Bones & Joints": ["Lower back pain", "Knee joint stiffness", "Neck strain from computer", "Muscle sprain"],
  "Mental Health": ["Feeling overwhelmed", "Work burnout", "Racing thoughts / insomnia", "Low energy & sadness"],
  "Diet & Digestive": ["Post-meal bloating", "Acid reflux", "Weight loss guidance", "Constant indigestion"],
  "Women's Health": ["Severe period cramps", "Irregular cycles", "Hormonal acne", "Pelvic discomfort"],
  "Dental & Mouth": ["Cold sensitivity", "Toothache", "Bleeding gums when flossing", "Wisdom tooth discomfort"],
  "Child Care": ["Mild infant fever", "Toddler night cough", "Teething distress", "Fussy appetite"],
};

export default function SymptomTriageWidget({
  open,
  onOpenChange,
}: SymptomTriageWidgetProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedRegion, setSelectedRegion] = useState<string>("General");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState<string>("Just today");
  const [severity, setSeverity] = useState<number>(4);
  const [additionalNotes, setAdditionalNotes] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [startingSession, setStartingSession] = useState(false);
  const [triageResult, setTriageResult] = useState<any | null>(null);

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const handleRunTriage = async () => {
    try {
      setLoading(true);
      const res = await axios.post("/api/symptom-triage", {
        bodyRegion: selectedRegion,
        symptoms: selectedSymptoms,
        duration,
        severity,
        additionalNotes,
      });

      if (res.data) {
        setTriageResult(res.data);
        setStep(3);
      }
    } catch (err) {
      console.error("Triage API error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartConsultation = async (matchedDoctor: DoctorAgent) => {
    try {
      setStartingSession(true);
      const prefillNotes = `[Symptom Triage Assessment]\nRegion: ${selectedRegion}\nSymptoms: ${selectedSymptoms.join(
        ", "
      )}\nDuration: ${duration}\nSeverity: ${severity}/10\nAdditional Details: ${
        additionalNotes || "None"
      }\nSummary: ${triageResult?.triageSummary || ""}`;

      const res = await axios.post("/api/session-chat", {
        notes: prefillNotes,
        selectedDoctor: matchedDoctor,
      });

      if (res.data?.sessionId) {
        onOpenChange(false);
        window.location.href = `/dashboard/medical-agent/${res.data.sessionId}`;
      }
    } catch (err: any) {
      console.error("Error creating session:", err);
      alert(err?.response?.data?.message || "Could not start session. Please try again.");
    } finally {
      setStartingSession(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedRegion("General");
    setSelectedSymptoms([]);
    setDuration("Just today");
    setSeverity(4);
    setAdditionalNotes("");
    setTriageResult(null);
  };

  const matchedDoctor = triageResult?.matchedDoctorId
    ? AIDoctorAgents.find((d) => d.id === triageResult.matchedDoctorId) || AIDoctorAgents[0]
    : AIDoctorAgents[0];

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) resetForm();
        onOpenChange(val);
      }}
    >
      <DialogContent className="max-w-2xl sm:rounded-3xl p-6 shadow-2xl border border-gray-200 overflow-y-auto max-h-[90vh]">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-[#a4161a] border border-rose-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#a4161a]" />
                Smart AI Symptom Checker
              </span>
              <span className="text-xs text-gray-400 font-semibold">
                Step {step} of 3
              </span>
            </div>
          </div>

          <DialogTitle className="text-xl font-extrabold text-gray-900 mt-2 tracking-tight">
            {step === 1 && "What area of your body is affected?"}
            {step === 2 && `Describe your ${selectedRegion} symptoms`}
            {step === 3 && "AI Clinical Assessment & Doctor Match"}
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            {step === 1 && "Select the primary category to narrow down clinical evaluation."}
            {step === 2 && "Choose matching symptoms and rate duration & severity."}
            {step === 3 && "Review matched AI specialist and start one-click consultation."}
          </DialogDescription>
        </DialogHeader>

        {/* STEP 1: Body Region Selector */}
        {step === 1 && (
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
              {BODY_REGIONS.map((region) => {
                const isSelected = selectedRegion === region.id;
                return (
                  <button
                    key={region.id}
                    type="button"
                    onClick={() => setSelectedRegion(region.id)}
                    className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      isSelected
                        ? "border-[#a4161a] bg-rose-50/60 ring-2 ring-[#a4161a]/20 shadow-xs"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60"
                    }`}
                  >
                    <span className="text-2xl">{region.icon}</span>
                    <div>
                      <h4 className="font-bold text-xs text-gray-900">{region.label}</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">{region.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 flex justify-end">
              <Button
                onClick={() => setStep(2)}
                className="bg-[#a4161a] hover:bg-[#8b1116] text-white font-bold text-xs h-10 px-6 rounded-xl shadow-sm"
              >
                Next Step: Details
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: Symptoms, Duration, Severity */}
        {step === 2 && (
          <div className="space-y-5 py-2">
            {/* Symptom Chips */}
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-2">
                Common {selectedRegion} Symptoms (Select all that apply):
              </label>
              <div className="flex flex-wrap gap-2">
                {(SAMPLE_SYMPTOMS_BY_REGION[selectedRegion] || SAMPLE_SYMPTOMS_BY_REGION["General"]).map(
                  (sym) => {
                    const active = selectedSymptoms.includes(sym);
                    return (
                      <button
                        key={sym}
                        type="button"
                        onClick={() => toggleSymptom(sym)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                          active
                            ? "bg-[#a4161a] text-white border-[#a4161a] shadow-2xs"
                            : "bg-gray-100/90 text-gray-700 border-gray-200 hover:bg-gray-200/80"
                        }`}
                      >
                        {active ? "✓ " : "+ "}
                        {sym}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Duration Selector */}
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-2">
                How long have you had these symptoms?
              </label>
              <div className="grid grid-cols-4 gap-2">
                {["Just today", "2-3 days", "1-2 weeks", "1+ month"].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDuration(d)}
                    className={`py-2 px-1 text-center text-xs rounded-xl border font-medium transition-all ${
                      duration === d
                        ? "border-[#a4161a] bg-rose-50 text-[#a4161a] font-bold"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Severity Rating */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-gray-800">
                  Symptom Severity Rating:
                </label>
                <span
                  className={`text-xs font-extrabold px-2.5 py-0.5 rounded-md ${
                    severity >= 7
                      ? "bg-red-100 text-red-800 border border-red-200"
                      : severity >= 4
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  }`}
                >
                  {severity}/10 ({severity >= 7 ? "Severe" : severity >= 4 ? "Moderate" : "Mild"})
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={severity}
                onChange={(e) => setSeverity(Number(e.target.value))}
                className="w-full accent-[#a4161a] cursor-pointer"
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">
                Additional Notes or Description (Optional):
              </label>
              <textarea
                rows={2}
                placeholder="E.g., starts in morning after breakfast, gets worse with light..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#a4161a] transition-all"
              />
            </div>

            {/* Step 2 Actions */}
            <div className="pt-2 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep(1)}
                className="text-xs font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Back
              </Button>

              <Button
                onClick={handleRunTriage}
                disabled={loading}
                className="bg-[#a4161a] hover:bg-[#8b1116] text-white font-bold text-xs h-10 px-6 rounded-xl shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Symptoms...
                  </>
                ) : (
                  <>
                    Run AI Triage & Match Doctor
                    <Sparkles className="w-4 h-4 ml-1.5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Result & Doctor Match */}
        {step === 3 && triageResult && (
          <div className="space-y-5 py-2">
            {/* If Emergency */}
            {triageResult.isEmergency ? (
              <div className="p-5 rounded-2xl bg-red-50 border-2 border-red-300 space-y-4">
                <div className="flex items-center gap-3 text-red-800">
                  <div className="p-3 rounded-xl bg-red-100 text-red-600 animate-pulse">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base">
                      URGENT MEDICAL EMERGENCY ALERT
                    </h3>
                    <p className="text-xs font-semibold text-red-700">
                      High-risk symptoms detected requiring immediate clinical care.
                    </p>
                  </div>
                </div>

                <p className="text-xs text-red-900 bg-white/80 p-3 rounded-xl border border-red-200">
                  {triageResult.triageSummary}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href="tel:911"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-red-600 text-white hover:bg-red-700 shadow-sm"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    Call Emergency 911
                  </a>
                  <a
                    href="tel:112"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-red-700 border border-red-300 hover:bg-red-50"
                  >
                    Call Universal 112
                  </a>
                </div>
              </div>
            ) : (
              <>
                {/* Normal Matched Specialist Card */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50/70 via-white to-gray-50 border border-gray-200/90 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      AI Doctor Matched
                    </span>

                    <span
                      className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                        triageResult.urgencyLevel === "urgent"
                          ? "bg-red-50 text-red-700 border-red-200"
                          : triageResult.urgencyLevel === "moderate"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-blue-50 text-blue-700 border-blue-200"
                      }`}
                    >
                      Urgency: {triageResult.urgencyLevel?.toUpperCase() || "LOW"}
                    </span>
                  </div>

                  {/* Doctor Profile Banner */}
                  <div className="flex items-center gap-4 p-3 rounded-xl bg-white border border-gray-100">
                    <Image
                      src={matchedDoctor.image}
                      alt={matchedDoctor.doctorName || "Doctor"}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-full object-cover border-2 border-[#a4161a]/30 shadow-xs"
                    />
                    <div>
                      <h3 className="font-extrabold text-base text-gray-900 flex items-center gap-1.5">
                        {matchedDoctor.doctorName}
                        <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
                      </h3>
                      <p className="text-xs font-semibold text-[#a4161a]">
                        {matchedDoctor.specialist} Specialist
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {matchedDoctor.experience}
                      </p>
                    </div>
                  </div>

                  {/* Clinical Triage Summary */}
                  <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-700 space-y-1">
                    <span className="font-bold text-gray-800">Triage Evaluation:</span>
                    <p className="leading-relaxed">{triageResult.triageSummary}</p>
                  </div>

                  {/* Key Questions to Ask */}
                  {Array.isArray(triageResult.keyQuestionsToAsk) && (
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-[#a4161a]" />
                        Recommended Questions to Ask Doctor:
                      </h4>
                      <ul className="list-disc list-inside text-xs text-gray-600 space-y-1 pl-1">
                        {triageResult.keyQuestionsToAsk.map((q: string, i: number) => (
                          <li key={i}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Suggested Self Care */}
                  {Array.isArray(triageResult.suggestedSelfCare) && (
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1">
                        <HeartPulse className="w-3.5 h-3.5 text-emerald-600" />
                        Safe Supportive Measures:
                      </h4>
                      <ul className="list-disc list-inside text-xs text-gray-600 space-y-1 pl-1">
                        {triageResult.suggestedSelfCare.map((c: string, i: number) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Primary Action Button */}
                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setStep(2)}
                    className="text-xs font-semibold"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                    Modify Details
                  </Button>

                  <Button
                    onClick={() => handleStartConsultation(matchedDoctor)}
                    disabled={startingSession}
                    className="bg-[#a4161a] hover:bg-[#8b1116] text-white font-extrabold text-xs h-11 px-7 rounded-xl shadow-md transition-all"
                  >
                    {startingSession ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Launching Room...
                      </>
                    ) : (
                      <>
                        Start Consult with {matchedDoctor.doctorName}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
