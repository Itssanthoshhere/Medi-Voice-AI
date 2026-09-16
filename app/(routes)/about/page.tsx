"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Stethoscope,
  Mic,
  ShieldCheck,
  Brain,
  Zap,
  Sparkles,
  HeartPulse,
  Activity,
  Award,
  Users,
  Clock,
  CheckCircle2,
  Check,
  Shield,
  ArrowRight,
  FileText,
  Lock,
  Globe2,
  Bot,
  Flame,
  ArrowUpRight,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <div className="relative rounded-3xl bg-white text-gray-900 p-8 md:p-14 overflow-hidden border border-gray-100 shadow-sm">

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headline & CTA */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
              This is how MediVoice AI delivers{" "}
              <span className="italic font-serif font-normal text-[#a4161a]">
                voice-first healthcare.
              </span>
            </h1>

            <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-xl">
              MediVoice AI reads your symptoms, calls an AI specialist, runs a
              preliminary consultation, generates a structured clinical SOAP
              report, and keeps your health record updated — before you ever
              step into a waiting room.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/dashboard">
                <Button className="bg-[#a4161a] hover:bg-[#8b1116] text-white font-semibold text-sm h-12 px-6 rounded-2xl shadow-lg shadow-[#a4161a]/25 flex items-center gap-2 transition-all hover:scale-[1.02]">
                  <span>Get started</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Floating Voice AI Assistant Mockup Card */}
          <div className="lg:col-span-5 relative">
            {/* Ambient Card Backlight Glow */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-rose-200 to-amber-200 blur-xl opacity-70" />

            <div className="relative rounded-3xl bg-white border border-gray-200/80 p-6 space-y-5 shadow-2xl">
              {/* Doctor Avatar Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Image
                      src="/doctor1.png"
                      alt="Dr. Elliot"
                      width={52}
                      height={52}
                      className="w-13 h-13 rounded-2xl object-cover border border-rose-200 shadow-md"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      Dr. Elliot{" "}
                      <span className="text-[10px] bg-rose-50 text-[#a4161a] px-2 py-0.5 rounded-full border border-rose-200 font-semibold">
                        AI General Physician
                      </span>
                    </h4>
                    <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />{" "}
                      Voice Engine Connected
                    </p>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-rose-50 border border-rose-100 text-[#a4161a]">
                  <Mic className="w-4 h-4" />
                </div>
              </div>

              {/* Live Animated Soundwave Bar */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span>Voice Stream</span>
                  <span className="text-rose-400 font-mono font-bold">
                    24ms Latency
                  </span>
                </div>

                <div className="flex items-center justify-center gap-1.5 h-8">
                  {[
                    40, 75, 30, 90, 60, 100, 45, 80, 55, 95, 35, 70, 50, 85,
                  ].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-gradient-to-t from-rose-500 to-amber-400 rounded-full animate-pulse"
                      style={{
                        height: `${h}%`,
                        animationDelay: `${i * 0.08}s`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Simulated Agent Speech Bubble */}
              <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 text-xs text-gray-800 leading-relaxed flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p>
                  &ldquo;Hello! I&apos;m Dr. Elliot. Please tell me what
                  symptoms or health concerns you are experiencing today.&rdquo;
                </p>
              </div>

              {/* Bottom Feature Badges */}
              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-100">
                <span className="flex items-center gap-1 font-medium text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> HIPAA
                  Compliant
                </span>
                <span className="flex items-center gap-1 text-gray-700 font-semibold">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />{" "}
                  Real-Time Synthesis
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dark Reference Integration & Metrics Section (medivoice.org style) */}
      <div className="relative rounded-3xl bg-[#09090b] border border-[#1c1c1e] text-white p-8 md:p-12 overflow-hidden shadow-2xl space-y-12">
        {/* Subtle grid pattern background overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#c1121f] block">
            CORE METRICS & PLATFORM VISION
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Empowering patients & doctors with{" "}
            <span className="italic font-serif font-normal text-[#c1121f]">
              voice AI intelligence.
            </span>
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
            MediVoice AI provides instant, empathetic preliminary consultations,
            automated clinical SOAP reports, and seamless export capabilities.
          </p>
        </div>

        {/* Stat Feature Cards (medivoice.org Integration Style) */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "10+",
              subtitle: "AI Specialists",
              icon: Bot,
              iconColor: "text-[#c1121f]",
              desc: "Choose from specialized AI doctors across General Medicine, Pediatrics, Dermatology, Cardiology, Psychology, and more.",
              tags: ["Multi-Agent", "Specialist Routing"],
            },
            {
              title: "< 1.2s",
              subtitle: "Voice Response Latency",
              icon: Zap,
              iconColor: "text-amber-400",
              desc: "Ultra-low latency neural voice synthesis ensures natural, human-like conversation flow without awkward pauses.",
              tags: ["Real-Time", "Neural TTS"],
            },
            {
              title: "99.4%",
              subtitle: "Voice Recognition Accuracy",
              icon: Mic,
              iconColor: "text-indigo-400",
              desc: "Advanced speech-to-text engine accurately captures symptoms, medical terminology, and patient context in real time.",
              tags: ["STT Engine", "Medical NLP"],
            },
            {
              title: "24/7 / 365",
              subtitle: "Availability",
              icon: Clock,
              iconColor: "text-emerald-400",
              desc: "Zero wait times or scheduling delays. Receive immediate health guidance whenever symptoms arise, day or night.",
              tags: ["Always On", "Global Access"],
            },
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#18181b] border border-[#27272a] flex flex-col justify-between space-y-4 hover:border-[#3f3f46] transition-all duration-300 group"
              >
                {/* Icon + Title */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-6 h-6 ${card.iconColor} shrink-0`} />
                    <div>
                      <h4 className="text-lg font-extrabold text-white leading-tight">
                        {card.title}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.14em]">
                        {card.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                {/* Pill Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {card.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-md bg-[#27272a] border border-[#3f3f46] text-[10px] font-semibold text-zinc-300 tracking-wide"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Our Mission & Our Vision Section (2 Dark Cards) */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Our Mission */}
          <div className="p-8 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-5 hover:border-[#a4161a]/40 transition-all">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#a4161a]/15 border border-[#a4161a]/30 text-[#c1121f] flex items-center justify-center">
                <HeartPulse className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full bg-[#a4161a]/10 border border-[#a4161a]/20 text-[#e74c3c] text-xs font-bold uppercase tracking-wider">
                OUR MISSION
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white tracking-tight">
                Our Mission
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                To democratize access to reliable health guidance through voice AI.
                We empower individuals to understand their symptoms early, prepare
                structured medical briefs for their physical doctors, and reduce
                anxiety around unexpected health concerns.
              </p>
            </div>
          </div>

          {/* Our Vision */}
          <div className="p-8 rounded-3xl bg-[#18181b] border border-[#27272a] space-y-5 hover:border-indigo-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                <Brain className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                OUR VISION
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white tracking-tight">
                Our Vision
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                To build the world&apos;s most trusted voice-first medical assistant
                layer. By automating preliminary patient triage and clinical report
                generation, MediVoice AI helps healthcare systems operate with
                speed, precision, and compassion.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Defensibility & Security Architecture (Reference Layout with MediVoice AI Context) */}
      <div className="space-y-10">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mx-auto">
            <Activity className="w-3.5 h-3.5" />
            Core Technology
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Built for Clinical Precision &{" "}
            <span className="italic font-serif font-normal text-[#a4161a]">
              Voice Speed
            </span>
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed max-w-xl mx-auto">
            MediVoice AI combines multi-agent orchestration, neural voice
            synthesis, and clinical documentation engines to provide instant,
            empathetic preliminary health guidance.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              title: "Natural Voice Conversation",
              desc: "Talk to AI doctors as naturally as a real phone call. Low-latency neural voices ensure human-like cadence and warmth.",
              icon: Mic,
            },
            {
              title: "Structured Clinical Reports",
              desc: "Auto-extracts chief complaints, symptom duration, severity, and potential differential assessments into printable TXT & PDF reports.",
              icon: FileText,
            },
            {
              title: "Specialist Multi-Agent System",
              desc: "Trained on clinical communication guidelines across General Medicine, Pediatrics, Dermatology, Cardiology, Psychology, and more.",
              icon: Bot,
            },
            {
              title: "HIPAA-Ready Data Security",
              desc: "All session audio, text transcripts, and patient records are encrypted at rest (AES-256) and in transit (TLS 1.3).",
              icon: ShieldCheck,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col space-y-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-rose-200 group"
              >
                <div className="w-10 h-10 rounded-full bg-rose-50/80 border border-rose-100 text-[#a4161a] flex items-center justify-center shrink-0 group-hover:bg-[#a4161a] group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-base font-bold text-gray-900 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom 2 Operational & Rollout Banner Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Clinical Workflow Controls Card */}
          <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-5 hover:shadow-md transition-shadow">
            <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#a4161a] block">
              CLINICAL WORKFLOW CONTROLS
            </span>
            <div className="space-y-3.5">
              {[
                "Select from 10+ specialized AI doctor agents for instant triage",
                "Natural voice conversations with under 1.2s response latency",
                "Auto-generated structured SOAP reports ready for download",
                "Export reports as PDF or TXT to share with your physical doctor",
              ].map((text, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0 mt-0.5 text-[#a4161a]">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 leading-relaxed">
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Rollout Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-rose-50/60 to-rose-100/40 border border-rose-200/80 shadow-sm flex flex-col justify-between space-y-5 hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#a4161a] block">
                GET STARTED NOW
              </span>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                Experience AI-Powered Voice Healthcare
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Start a preliminary consultation with our AI general physician
                or specialist doctors anytime, anywhere with zero waiting room delays.
              </p>
            </div>

            <Link href="/dashboard">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-md flex items-center gap-2 w-max transition-all">
                <span>Start Consultation Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works Workflow */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12 shadow-sm space-y-10">
        <div className="text-center space-y-2 max-w-lg mx-auto">
          <p
            className="text-[11px] font-bold tracking-[0.16em] uppercase"
            style={{ color: "#a4161a" }}
          >
            How It Works
          </p>
          <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            How MediVoice AI Works
          </h3>
          <p className="text-sm text-gray-500">
            Three simple steps from symptoms to structured clinical output.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {[
            {
              step: "01",
              title: "Speak to an AI Doctor",
              desc: "Choose from 10+ specialist agents and start a natural voice conversation. Describe your symptoms just like you would in a real clinic call — the AI listens, asks follow-up questions, and guides the session.",
            },
            {
              step: "02",
              title: "Get a Clinical SOAP Report",
              desc: "Your consultation is automatically compiled into an industry-standard clinical summary — Chief Complaint, History, Assessment, and Recommendations — ready to download as a formatted PDF.",
            },
            {
              step: "03",
              title: "Review & Take Action",
              desc: "Access your complete consultation history anytime. Share SOAP reports with your physical doctor, schedule follow-ups, or consult another specialist — all from your health dashboard.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative p-7 rounded-2xl bg-gray-50/80 border border-gray-200/80 space-y-3 hover:shadow-md transition-shadow group"
            >
              <span
                className="block text-4xl font-extrabold tracking-tight mb-2"
                style={{ color: "rgba(164, 22, 26, 0.15)" }}
              >
                {item.step}
              </span>
              <h4 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors">
                {item.title}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#a4161a] via-[#8b1116] to-rose-900 text-white p-8 md:p-12 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white">
            Ready to experience AI-powered voice healthcare?
          </h3>
          <p className="text-rose-100 text-xs md:text-sm">
            Start a preliminary consultation with our AI general physician or
            specialist agents today.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/dashboard">
            <Button className="bg-white hover:bg-gray-100 text-[#a4161a] font-bold text-xs h-11 px-6 rounded-xl shadow-md">
              Start Free Consultation
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
