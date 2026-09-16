"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Lock,
  FileText,
  Eye,
  KeyRound,
  Server,
  UserCheck,
  Sparkles,
  ArrowRight,
  Database,
  RefreshCw,
} from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-rose-50/90 via-white to-amber-50/50 text-gray-900 p-8 md:p-12 overflow-hidden border border-rose-100 shadow-xl">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200/80 text-emerald-800 text-xs font-semibold backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Patient Privacy & Healthcare Data Protection</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
            MediVoice AI{" "}
            <span className="bg-gradient-to-r from-[#a4161a] via-rose-600 to-amber-600 bg-clip-text text-transparent">
              Privacy & Security Policy
            </span>
          </h1>

          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            Your health details, voice consultations, and medical reports are
            protected with hospital-grade encryption standards. Learn how we
            safeguard your personal health data.
          </p>

          <p className="text-xs text-gray-400 font-medium pt-2">
            Last Updated: September 17, 2026 • Compliant with HIPAA Triage
            Guidelines & AES-256 Encryption Standards
          </p>
        </div>
      </div>

      {/* Security Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: Lock,
            title: "End-to-End Encryption",
            desc: "All audio streams, text transcripts, and personal patient records are encrypted at rest with AES-256 and in transit with TLS 1.3.",
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            icon: Eye,
            title: "Zero Model Training",
            desc: "Your private voice recordings and health reports are never used to train or fine-tune public artificial intelligence models.",
            color: "text-rose-600",
            bg: "bg-rose-50",
          },
          {
            icon: UserCheck,
            title: "Patient Data Control",
            desc: "You retain 100% ownership of your health profile. Delete or export your consultation transcripts and SOAP reports anytime.",
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
        ].map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-3 hover:shadow-md transition-shadow"
            >
              <div
                className={`p-3 rounded-xl w-max ${pillar.bg} ${pillar.color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                {pillar.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Detailed Policy Sections */}
      <div className="space-y-8 bg-white rounded-3xl border border-gray-100 p-8 md:p-12 shadow-sm">
        <div className="space-y-6">
          <section className="space-y-3 border-b border-gray-100 pb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-[#a4161a]" />
              1. Information We Collect & Process
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              When you use MediVoice AI, we collect minimal information required
              to deliver accurate medical triaging and personalized specialist
              guidance:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 pl-2">
              <li>
                <strong>Account Credentials:</strong> Full Name and Email
                Address authenticated securely via Clerk.
              </li>
              <li>
                <strong>Patient Health Profile:</strong> Blood Group, Allergies,
                Emergency Contact, and Preferred Voice Accent provided
                voluntarily in your profile.
              </li>
              <li>
                <strong>Consultation Artifacts:</strong> Real-time voice
                transcripts, symptom notes, and generated clinical SOAP reports.
              </li>
            </ul>
          </section>

          <section className="space-y-3 border-b border-gray-100 pb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Server className="w-5 h-5 text-indigo-600" />
              2. How Your Voice & Health Data is Used
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Your health data is strictly processed to fulfill your requested
              medical voice consultation and generate structured summaries for
              your doctor visits:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 pl-2">
              <li>
                To match your reported symptoms with specialized AI medical
                agents (e.g., Cardiologist, Pediatrician).
              </li>
              <li>
                To compile automated SOAP (Subjective, Objective, Assessment,
                Plan) clinical notes downloadable as formatted PDF reports.
              </li>
              <li>
                We <strong>do not sell, rent, or monetize</strong> your health
                information to third-party advertisers or insurance providers.
              </li>
            </ul>
          </section>

          <section className="space-y-3 border-b border-gray-100 pb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-emerald-600" />
              3. HIPAA Principles & Security Architecture
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              MediVoice AI is engineered around HIPAA-ready security guidelines.
              Database records are stored in encrypted PostgreSQL database
              instances protected by strict role-based access policies (RBAC).
              All API calls communicate exclusively via HTTPS with TLS 1.3
              protocol enforcement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-amber-600" />
              4. Data Retention & Patient Rights
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              You maintain full authority over your data. You may view past
              session transcripts in your dashboard history, download your SOAP
              notes, or clear your medical history upon request.
            </p>
          </section>
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#a4161a] via-[#8b1116] to-rose-900 text-white p-8 md:p-12 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl font-extrabold text-white">
            Have questions about your health privacy?
          </h3>
          <p className="text-rose-100 text-xs md:text-sm">
            Consult your health dashboard or review your active patient profile
            settings anytime.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/profile">
            <Button className="bg-white hover:bg-gray-100 text-[#a4161a] font-bold text-xs h-11 px-6 rounded-xl shadow-md flex items-center gap-2">
              <span>View Health Profile</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
