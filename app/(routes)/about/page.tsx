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
      {/* Hero Section - Clean Light Medical Surface Theme */}
      <div className="relative rounded-3xl bg-gradient-to-br from-rose-50/90 via-white to-amber-50/50 text-gray-900 p-8 md:p-14 overflow-hidden border border-rose-100 shadow-xl">
        {/* Glow Effects */}
        <div className="absolute -top-28 -right-28 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-28 -left-28 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headline & CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/80 border border-rose-200/80 text-[#a4161a] text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>Voice-First AI Medical Consultation</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Pioneering the Next Generation of{" "}
              <span className="bg-gradient-to-r from-[#a4161a] via-rose-600 to-amber-600 bg-clip-text text-transparent">
                AI Medical Intelligence
              </span>
            </h1>

            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              MediVoice AI bridges the gap between symptom awareness and clinical
              assessment. By combining conversational voice agents with clinical
              guidelines, we deliver instant, empathetic preliminary health
              guidance anytime, anywhere.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/dashboard">
                <Button className="bg-[#a4161a] hover:bg-[#8b1116] text-white font-semibold text-sm h-12 px-6 rounded-2xl shadow-lg shadow-[#a4161a]/25 flex items-center gap-2 transition-all hover:scale-[1.02]">
                  <Stethoscope className="w-4 h-4" />
                  <span>Try Consultation Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <Link href="/billing">
                <Button
                  variant="outline"
                  className="bg-white border-gray-200 text-gray-800 hover:bg-gray-50 font-semibold text-sm h-12 px-6 rounded-2xl shadow-sm"
                >
                  <span>View Plans & Pricing</span>
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
                      Dr. Elliot <span className="text-[10px] bg-rose-50 text-[#a4161a] px-2 py-0.5 rounded-full border border-rose-200 font-semibold">AI General Physician</span>
                    </h4>
                    <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" /> Voice Engine Connected
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
                  <span className="text-rose-400 font-mono font-bold">24ms Latency</span>
                </div>

                <div className="flex items-center justify-center gap-1.5 h-8">
                  {[40, 75, 30, 90, 60, 100, 45, 80, 55, 95, 35, 70, 50, 85].map((h, i) => (
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
                  &ldquo;Hello! I&apos;m Dr. Elliot. Please tell me what symptoms or health concerns you are experiencing today.&rdquo;
                </p>
              </div>

              {/* Bottom Feature Badges */}
              <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-100">
                <span className="flex items-center gap-1 font-medium text-emerald-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> HIPAA Compliant
                </span>
                <span className="flex items-center gap-1 text-gray-700 font-semibold">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Real-Time Synthesis
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          {
            label: "AI Specialists",
            value: "10+",
            icon: Bot,
            color: "text-rose-500",
            bg: "bg-rose-50",
          },
          {
            label: "Voice Response Latency",
            value: "< 1.2s",
            icon: Zap,
            color: "text-amber-500",
            bg: "bg-amber-50",
          },
          {
            label: "Voice Recognition Accuracy",
            value: "99.4%",
            icon: Mic,
            color: "text-indigo-500",
            bg: "bg-indigo-50",
          },
          {
            label: "Availability",
            value: "24/7 / 365",
            icon: Clock,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
          },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm flex flex-col justify-between space-y-3 transition-all hover:shadow-md"
            >
              <div
                className={`p-2.5 rounded-xl w-max ${stat.bg} ${stat.color}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-3xl font-extrabold text-gray-900">
                  {stat.value}
                </h3>
                <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mission & Vision Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
          <div className="p-3 rounded-2xl bg-rose-50 text-[#a4161a] w-max">
            <HeartPulse className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            To democratize access to reliable health guidance through voice AI.
            We empower individuals to understand their symptoms early, prepare
            structured medical briefs for their physical doctors, and reduce
            anxiety around unexpected health concerns.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 w-max">
            <Brain className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            To build the world&apos;s most trusted voice-first medical assistant
            layer. By automating preliminary patient triage and clinical report
            generation, MediVoice AI helps healthcare systems operate with
            speed, precision, and compassion.
          </p>
        </div>
      </div>

      {/* Key Features & Architecture Pillars */}
      <div className="space-y-8">
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
            <Activity className="w-3.5 h-3.5" />
            Core Technology
          </div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Built for Clinical Precision & Voice Speed
          </h2>
          <p className="text-gray-500 text-sm">
            MediVoice AI combines multi-agent orchestration, neural voice
            synthesis, and clinical documentation engines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Natural Voice Conversation",
              desc: "Talk to AI doctors as naturally as a real phone call. Low-latency neural voices ensure human-like cadence and warmth.",
              icon: Mic,
              color: "text-rose-600",
              bg: "bg-rose-50",
            },
            {
              title: "Structured Clinical Reports",
              desc: "Auto-extracts chief complaints, symptom duration, severity, and potential differential assessments into printable TXT & PDF reports.",
              icon: FileText,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              title: "Specialist Multi-Agent System",
              desc: "Trained on clinical communication guidelines across General Medicine, Pediatrics, Dermatology, Cardiology, Psychology, and more.",
              icon: Bot,
              color: "text-amber-600",
              bg: "bg-amber-50",
            },
            {
              title: "HIPAA-Ready Data Security",
              desc: "All session audio, text transcripts, and patient records are encrypted at rest (AES-256) and in transit (TLS 1.3).",
              icon: Lock,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
            {
              title: "Instant Triage & Doctor Matching",
              desc: "Describe your symptoms in natural prose, and our recommendation engine suggests the ideal medical agent specialist.",
              icon: Sparkles,
              color: "text-purple-600",
              bg: "bg-purple-50",
            },
            {
              title: "24/7 Global Accessibility",
              desc: "Zero wait times or scheduling delays. Receive immediate health guidance whenever symptoms arise day or night.",
              icon: Globe2,
              color: "text-indigo-600",
              bg: "bg-indigo-50",
            },
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-3 transition-all hover:shadow-md hover:border-primary/20"
              >
                <div
                  className={`p-3 rounded-xl w-max ${feature.bg} ${feature.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold text-gray-900">
                  {feature.title}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works Workflow */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12 shadow-sm space-y-10">
        <div className="text-center space-y-2 max-w-lg mx-auto">
          <h3 className="text-2xl font-bold text-gray-900">
            How MediVoice AI Works
          </h3>
          <p className="text-xs text-gray-500">
            Three simple steps from symptoms to structured clinical output.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {[
            {
              step: "01",
              title: "Describe Symptoms",
              desc: "Enter your health concerns or select one of our 10+ specialized AI medical agents.",
            },
            {
              step: "02",
              title: "Voice Consultation",
              desc: "Speak naturally with the AI doctor. The agent listens, asks follow-up questions, and offers preliminary guidance.",
            },
            {
              step: "03",
              title: "Get Clinical Report",
              desc: "Review an auto-generated structured report complete with symptoms, recommendations, and export options.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-3"
            >
              <span className="text-3xl font-black text-rose-500/20 block">
                {item.step}
              </span>
              <h4 className="text-base font-bold text-gray-900">
                {item.title}
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
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
