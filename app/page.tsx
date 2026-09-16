"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { AIDoctorAgents } from "@/shared/list";
import {
  Mic,
  FileText,
  Sparkles,
  ShieldCheck,
  Clock,
  HeartPulse,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   INLINE ICONS
   ═══════════════════════════════════════════════════════════════ */
const ArrowRightIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const XIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */
const NAV_LINKS = [
  { label: "Product", href: "#features" },
  { label: "Specialists", href: "#specialists" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "/billing" },
  { label: "About", href: "/about" },
];

const STATS = [
  { value: "24/7", label: "patient intake and voice coverage" },
  { value: "10+", label: "specialized AI medical agents on call" },
  { value: "1 consult", label: "generates a full clinical SOAP report" },
];

const PROOF_ITEMS = [
  { title: "24/7 intake coverage", desc: "Never let nights, weekends, or overflow calls disappear into voicemail." },
  { title: "Human handoff when needed", desc: "Escalate sensitive or low-confidence situations to staff without friction." },
  { title: "Reviewable call records", desc: "Keep transcripts, summaries, and follow-up context in one place." },
];

const TOPICS = [
  "Natural voice AI consultations",
  "Automated SOAP clinical reports",
  "10+ specialist AI agents",
  "Personalized patient profiles",
];

const CORE_FEATURES = [
  { icon: Mic, title: "Natural Voice Conversations", desc: "Speak naturally to AI doctors just like a real clinic phone call. Neural voice synthesis reproduces realistic human cadence, tone, and empathy.", color: "text-rose-600", bg: "bg-rose-50" },
  { icon: FileText, title: "Automated Clinical SOAP Reports", desc: "Every voice consultation automatically compiles into a structured medical note with Chief Complaint, History, Assessment, and PDF export.", color: "text-blue-600", bg: "bg-blue-50" },
  { icon: Sparkles, title: "Symptom Analysis & Doctor Matching", desc: "Describe your symptoms in plain English, and our smart recommendation engine analyzes your condition to suggest the best specialist agent.", color: "text-purple-600", bg: "bg-purple-50" },
  { icon: ShieldCheck, title: "HIPAA-Ready Security & Privacy", desc: "Consultations and medical profiles are protected with AES-256 encryption at rest and TLS 1.3 in transit. Your health data is strictly confidential.", color: "text-emerald-600", bg: "bg-emerald-50" },
  { icon: Clock, title: "Complete History & Consultation Audit", desc: "Review transcripts, doctor advice, and clinical reports from past sessions at any time in your centralized health dashboard.", color: "text-amber-600", bg: "bg-amber-50" },
  { icon: HeartPulse, title: "Personalized Patient Profiles", desc: "Store blood group, allergies, emergency contacts, and preferred AI doctor voice accents so every session is personalized to your care.", color: "text-indigo-600", bg: "bg-indigo-50" },
];

const ACCORDION_SECTIONS = [
  {
    title: "Voice AI consultations",
    content: [
      "Answer every patient call instantly with a natural, conversational AI voice agent",
      "Collect the patient's chief complaint, insurance info, and visit reason conversationally",
      "Schedule the next available appointment or route to urgent care",
      "Send staff a structured summary — no follow-up calls required",
    ],
  },
  {
    title: "The math",
    content: [
      "At $100+ per visit, every missed call is a measurable, direct revenue loss",
      "MediVoice's annual cost is recovered by a single captured appointment",
      "After-hours and overflow calls are the highest-risk unanswered moments",
      "Staff time saved on routine intake can be redirected to in-person care",
    ],
  },
  {
    title: "Patient intake automation",
    content: [
      "Chief complaint, symptoms, and urgency captured conversationally",
      "Insurance carrier, member ID, and coverage questions handled upfront",
      "EHR-compatible summaries ready for staff to review before the appointment",
      "No voicemail chains, callback delays, or missing information gaps",
    ],
  },
  {
    title: "Appointment scheduling",
    content: [
      "Book the next available slot in real time during the call",
      "Route time-sensitive cases to urgent care or on-call staff immediately",
      "Send an automated appointment confirmation message to the patient",
      "Flag and escalate situations that require immediate human judgment",
    ],
  },
];

const FAQS = [
  { q: "What is the best answering service for primary care practices?", a: "The best fit answers every call quickly, captures structured intake, books the next step, and routes urgent matters — instead of just taking a message. MediVoice AI is purpose-built for exactly this workflow." },
  { q: "Can AI handle patient intake without giving medical advice?", a: "Yes. MediVoice AI handles intake, scheduling, follow-up, and routing while staying strictly focused on information gathering. It does not provide medical advice or clinical guidance of any kind." },
  { q: "How do practices stop losing after-hours patients?", a: "With always-on coverage that answers immediately, captures structured intake, and moves the caller into a scheduling or escalation flow — regardless of time of day. MediVoice AI operates 24/7 for exactly this purpose." },
  { q: "What's the difference between a medical answering service and patient intake software?", a: "A traditional answering service takes a message. Patient intake software captures structured visit details, schedules appointments, and automatically routes urgency-based calls — MediVoice AI does all three simultaneously." },
  { q: "Is MediVoice suitable for high-volume or multi-location practices?", a: "Yes. MediVoice handles concurrent call volume without degradation — every caller receives an immediate response regardless of how many lines are active. Contact us for enterprise or multi-location pricing." },
];

const SEO_TERMS = [
  "best AI answering service for primary care",
  "primary care patient intake automation",
  "after-hours call handling for medical offices",
  "AI receptionist for medical practices",
  "patient intake software for primary care",
  "overflow call coverage for clinics",
  "24/7 medical answering service",
  "automated patient scheduling",
];

const RELATED_LINKS = [
  { label: "AI medical receptionist", href: "/dashboard" },
  { label: "10+ AI Specialists", href: "#specialists" },
  { label: "Pricing & Plans", href: "/billing" },
  { label: "About Platform", href: "/about" },
  { label: "LegalVoice — for law firms", href: "https://legalvoice.app" },
];

/* ═══════════════════════════════════════════════════════════════
   1. NAVBAR
   ═══════════════════════════════════════════════════════════════ */
function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useUser();

  return (
    <header
      className="sticky top-0 z-50 border-b border-gray-200/80"
      style={{ backdropFilter: "blur(16px)", background: "rgba(255,255,255,0.9)" }}
    >
      <div className="max-w-[1120px] mx-auto px-6">
        <div className="flex items-center justify-between h-[72px] gap-6">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0"
            aria-label="MediVoice home"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <Image
              src="/logo.png"
              alt="MediVoice AI"
              width={160}
              height={160}
              className="rounded-xl"
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </Link>

          {/* Desktop centre nav */}
          <nav className="hidden md:flex items-center gap-6 flex-1 justify-center" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[0.95rem] text-gray-600 hover:text-charcoal transition-colors duration-150"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {!user ? (
              <>
                <Link href="/sign-in" className="text-[0.95rem] text-gray-600 hover:text-charcoal transition-colors">
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  id="nav-get-started"
                  className="inline-flex items-center gap-1.5 px-[18px] py-3 text-[0.95rem] font-semibold !text-white bg-primary hover:bg-primary-dark rounded-full transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-primary/20"
                >
                  Get started
                </Link>
              </>
            ) : (
              <div className="flex gap-4 items-center">
                <Button variant="outline" className="rounded-full font-semibold">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <UserButton />
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 -mr-1 text-gray-600 hover:text-charcoal transition-colors"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <XIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <nav className="md:hidden pb-4 border-t border-gray-100 flex flex-col" aria-label="Mobile navigation">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-2 px-2 py-3 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
              {!user ? (
                <>
                  <Link href="/sign-in" className="px-2 py-2.5 text-sm font-medium text-gray-700">
                    Sign in
                  </Link>
                  <Link
                    href="/sign-up"
                    className="px-4 py-2.5 text-sm font-semibold !text-white bg-primary hover:bg-primary-dark rounded-full text-center transition-colors"
                  >
                    Get started
                  </Link>
                </>
              ) : (
                <div className="px-2 py-2 flex items-center justify-between">
                  <Button variant="outline" className="rounded-full font-semibold w-full mr-4">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  <UserButton />
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. HERO — Two-column with sidebar panel
   ═══════════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <section className="max-w-[1120px] mx-auto px-6 pt-12 pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
        {/* Left column */}
        <div>
          {/* Eyebrow */}
          <p
            className="inline-flex items-center gap-2.5 px-3.5 py-2.5 rounded-full text-xs font-bold tracking-[0.18em] uppercase mb-5"
            style={{ background: "#fdf2f2", border: "1px solid #fbd5d5", color: "#a4161a" }}
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Voice AI built for medical practices
          </p>

          {/* H1 */}
          <h1
            className="font-extrabold text-charcoal tracking-[-0.04em] leading-[0.98] mb-4"
            style={{ fontSize: "clamp(2.6rem, 5vw, 4.15rem)" }}
          >
            Never miss a patient call.{" "}
            <span className="text-primary">Day or night.</span>
          </h1>

          {/* Lead */}
          <p className="text-lg text-gray-600 leading-relaxed mb-3 max-w-[700px]">
            MediVoice automates patient intake, appointment scheduling, and
            after-hours call handling with conversational AI. Your practice stays
            responsive 24/7 — without adding staff.
          </p>
          <p className="text-[0.95rem] text-gray-500 mb-3">
            Intake and scheduling only. No medical advice.
          </p>
          <p className="text-[0.95rem] text-gray-500 mb-7">
            For law firms, sister platform{" "}
            <Link href="https://legalvoice.app" className="underline underline-offset-2 hover:text-charcoal transition-colors">
              LegalVoice
            </Link>{" "}
            provides Voice AI for automated client calls.
          </p>

          {/* CTAs — pill shaped */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Link
              href="/dashboard"
              id="hero-cta-primary"
              className="inline-flex items-center justify-center gap-2 px-[18px] py-3 text-[0.95rem] font-semibold !text-white bg-primary hover:bg-primary-dark rounded-full transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-primary/20"
            >
              Start Consultation Demo <ArrowRightIcon />
            </Link>
            <Link
              href="/about"
              id="hero-cta-secondary"
              className="inline-flex items-center justify-center gap-2 px-[18px] py-3 text-[0.95rem] font-semibold text-charcoal rounded-full transition-colors"
              style={{ background: "rgba(255,255,255,0.88)", border: "1px solid #d0d5dd" }}
            >
              About MediVoice
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {STATS.map((s, i) => (
              <div key={i} className="mv-card-sm px-4 py-[14px]">
                <strong className="block text-charcoal text-xl font-extrabold leading-tight mb-1">
                  {s.value}
                </strong>
                <span className="text-gray-500 text-[0.85rem]">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Proof points */}
          <div className="flex flex-wrap gap-3">
            {PROOF_ITEMS.map((p) => (
              <div key={p.title} className="mv-card-sm min-w-[180px] px-4 py-3.5 flex-1">
                <strong className="block text-charcoal text-[0.95rem] mb-1">{p.title}</strong>
                <span className="text-gray-500 text-[0.85rem]">{p.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — sidebar panel */}
        <aside className="mv-panel p-7">
          <p
            className="text-[11px] font-bold tracking-[0.16em] uppercase mb-2.5"
            style={{ color: "#a4161a" }}
          >
            What this page covers
          </p>
          <h2 className="text-xl font-bold text-charcoal leading-snug mb-2.5">
            See the core points before you start
          </h2>
          <p className="text-gray-500 text-[0.95rem] mb-5">
            MediVoice is built to help practices answer faster, capture better
            intake, and hand sensitive situations to staff when judgment is
            required.
          </p>
          <div className="grid gap-2.5">
            {TOPICS.map((t) => (
              <div
                key={t}
                className="flex items-center gap-2.5 px-3.5 py-3 rounded-2xl text-[0.95rem] font-semibold"
                style={{ background: "#fdf2f2", border: "1px solid #fbd5d5", color: "#4a1011" }}
              >
                <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                {t}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. FEATURE GRID
   ═══════════════════════════════════════════════════════════════ */
function FeatureGrid() {
  return (
    <section id="features" className="max-w-[1120px] mx-auto px-6 py-16">
      <div className="text-center mb-12 space-y-2">
        <p className="text-[11px] font-bold tracking-[0.16em] uppercase" style={{ color: "#a4161a" }}>
          Core capabilities
        </p>
        <h2 className="text-3xl font-extrabold text-charcoal tracking-tight">
          Built for every moment a patient reaches out
        </h2>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          Comprehensive clinical intelligence combining neural voice synthesis,
          automated SOAP notes, and specialist triaging.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {CORE_FEATURES.map((f, idx) => {
          const Icon = f.icon;
          return (
            <article key={idx} className="mv-card p-6 space-y-4 hover:shadow-lg transition-shadow group">
              <div className={`p-3 rounded-xl w-max ${f.bg} ${f.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                {f.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. SPECIALIST ROSTER
   ═══════════════════════════════════════════════════════════════ */
function SpecialistRoster() {
  return (
    <section id="specialists" className="max-w-[1120px] mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <p className="text-[11px] font-bold tracking-[0.16em] uppercase mb-3" style={{ color: "#a4161a" }}>
          Specialist Network
        </p>
        <h2 className="text-3xl font-extrabold text-charcoal tracking-tight mb-3">
          10+ Specialized AI Medical Agents
        </h2>
        <p className="text-gray-500 text-sm max-w-xl mx-auto">
          From pediatric care to cardiology and dermatology, MediVoice AI deploys
          dedicated clinical agents tailored to specific patient needs.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {AIDoctorAgents.map((doctor) => (
          <div key={doctor.id} className="mv-card p-4 flex flex-col justify-between hover:shadow-lg transition-shadow group">
            <div className="space-y-3">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-rose-50 border border-gray-100">
                <Image
                  src={doctor.image}
                  alt={doctor.specialist}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
                {doctor.subscriptionRequired ? (
                  <span className="absolute top-2 right-2 text-[9px] font-bold bg-slate-900/80 text-amber-300 px-1.5 py-0.5 rounded backdrop-blur-sm">
                    Pro
                  </span>
                ) : (
                  <span className="absolute top-2 right-2 text-[9px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded">
                    Free
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">
                  {doctor.specialist}
                </h3>
                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-snug">
                  {doctor.description}
                </p>
              </div>
            </div>
            <div className="pt-3 mt-3 border-t border-gray-200/80">
              <Link href="/dashboard" className="block w-full">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs font-semibold h-7 rounded-lg text-primary border-primary/30 hover:bg-primary hover:text-white"
                >
                  Consult Agent
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5. CLINICAL SOAP SECTION
   ═══════════════════════════════════════════════════════════════ */
function ClinicalSOAPSection() {
  return (
    <section className="max-w-[1120px] mx-auto px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-5">
          <p className="text-[11px] font-bold tracking-[0.16em] uppercase" style={{ color: "#a4161a" }}>
            Clinical Documentation
          </p>
          <h2 className="text-3xl font-extrabold text-charcoal tracking-tight">
            Hospital-Grade SOAP Reports Generated Automatically
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Every voice consultation automatically compiles into an
            industry-standard clinical summary covering Chief Complaint, History,
            Differential Assessments, and Recommendations — ready to export as a
            formatted PDF for physicians.
          </p>
          <ul className="space-y-2.5 text-sm text-gray-700">
            {[
              "Automatic extraction of Chief Complaint and Duration",
              "Differential clinical assessments with triage flags",
              "Downloadable formatted PDF reports for physical doctors",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold !text-white bg-primary hover:bg-primary-dark rounded-full transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-primary/20"
            >
              Try Consultation in Dashboard <ArrowRightIcon />
            </Link>
          </div>
        </div>

        {/* SOAP Note Mockup */}
        <div className="mv-card p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-gray-900">Clinical SOAP Report</span>
              <span className="text-gray-400">• Session #MV-8492</span>
            </div>
            <span className="font-bold text-primary bg-rose-50 px-2 py-0.5 rounded">PDF Ready</span>
          </div>
          <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl">
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold">Specialist</span>
              <p className="font-bold text-gray-800">Dr. Elliot (General Physician)</p>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold">Triage Status</span>
              <p className="font-bold text-emerald-600">Non-Emergent / Stable</p>
            </div>
          </div>
          <div className="space-y-2 text-gray-700">
            <div>
              <span className="font-bold text-gray-900 uppercase text-[10px]">Chief Complaint:</span>
              <p className="bg-gray-50 p-2 rounded-lg mt-1 text-gray-600">
                48-hour history of sore throat, dry cough, and mild fatigue. No dyspnea reported.
              </p>
            </div>
            <div>
              <span className="font-bold text-gray-900 uppercase text-[10px]">Recommendations:</span>
              <p className="bg-gray-50 p-2 rounded-lg mt-1 text-gray-600">
                Supportive care, hydration, rest. Follow up with in-person clinic if fever exceeds 101°F.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6. BODY GRID — Accordion content + Sidebar
   ═══════════════════════════════════════════════════════════════ */
function BodyGrid() {
  return (
    <section id="how-it-works" className="max-w-[1120px] mx-auto px-6 pt-5 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.38fr] gap-7 items-start">
        {/* Main content column */}
        <div className="grid gap-5">
          {/* Accordion sections */}
          <div className="mv-card overflow-hidden p-1">
            {ACCORDION_SECTIONS.map((section, idx) => (
              <details
                key={section.title}
                className="mv-detail border-b border-gray-100 last:border-0"
                open={idx === 0}
              >
                <summary className="flex items-center justify-between gap-4 px-5 py-5 text-[1.05rem] font-semibold text-charcoal hover:text-primary transition-colors">
                  {section.title}
                  <span className="text-primary text-xl font-light shrink-0">+</span>
                </summary>
                <div className="px-5 pb-5">
                  <ul className="space-y-2 text-gray-600 text-[0.95rem]">
                    {section.content.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span className="mt-1 w-4 h-4 rounded-full bg-rose-50 flex items-center justify-center text-primary shrink-0">
                          <CheckIcon />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>

          {/* FAQ accordion */}
          <div className="mv-card p-6">
            <h3 className="text-xl font-bold text-charcoal mb-4">Common questions</h3>
            <div className="mv-card overflow-hidden p-1">
              {FAQS.map((faq, idx) => (
                <details
                  key={faq.q}
                  className="mv-detail border-b border-gray-100 last:border-0"
                  open={idx === 0}
                >
                  <summary className="flex items-center justify-between gap-4 px-5 py-5 text-[1.05rem] font-semibold text-charcoal hover:text-primary transition-colors">
                    {faq.q}
                    <span className="text-primary text-xl font-light shrink-0">+</span>
                  </summary>
                  <div className="px-5 pb-5">
                    <p className="text-gray-600 text-[0.95rem] leading-relaxed">{faq.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar column */}
        <aside className="grid gap-5">
          {/* Common searches */}
          <div className="mv-card p-5">
            <h3 className="text-lg font-bold text-charcoal mb-4">Common searches this page answers</h3>
            <div className="grid gap-2.5">
              {SEO_TERMS.map((t) => (
                <span
                  key={t}
                  className="block text-[0.92rem] px-3.5 py-3 rounded-2xl"
                  style={{ background: "#fdf2f2", border: "1px solid #fbd5d5", color: "#4a1011" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Explore more */}
          <div className="mv-card p-5">
            <h3 className="text-lg font-bold text-charcoal mb-4">Explore more</h3>
            <div className="flex flex-wrap gap-2.5">
              {RELATED_LINKS.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="inline-flex text-[0.95rem] font-semibold text-charcoal px-4 py-2.5 rounded-full bg-white transition-colors hover:bg-gray-50"
                  style={{ border: "1px solid #cfe0ea" }}
                >
                  {r.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Next step CTA */}
          <div className="mv-card p-5">
            <h3 className="text-lg font-bold text-charcoal mb-2">Next step</h3>
            <p className="text-gray-500 text-[0.95rem] mb-4">
              If this is the workflow you need, start a free consultation demo or
              explore our specialist network.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-[18px] py-3 text-[0.95rem] font-semibold !text-white bg-primary hover:bg-primary-dark rounded-full transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-primary/20 w-full"
            >
              Start a consultation demo
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   7. FOOTER
   ═══════════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="border-t border-gray-200">
      <div className="max-w-[1120px] mx-auto px-6 py-7 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            aria-label="MediVoice AI home"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <Image
              src="/logo.png"
              alt="MediVoice AI"
              width={120}
              height={120}
              className="rounded-xl opacity-85 hover:opacity-100 transition-opacity"
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
          <span className="text-gray-400 text-[0.92rem]">
            &copy; {new Date().getFullYear()} MediVoice AI
          </span>
        </div>
        <nav className="flex flex-wrap gap-5" aria-label="Footer">
          {[
            { label: "Features", href: "#features" },
            { label: "Specialists", href: "#specialists" },
            { label: "About", href: "/about" },
            { label: "Pricing", href: "/billing" },
            { label: "Privacy", href: "/about" },
          ].map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-gray-400 text-[0.92rem] hover:text-charcoal transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE ROOT
   ═══════════════════════════════════════════════════════════════ */
export default function Page() {
  return (
    <div className="mv-shell">
      <Navbar />
      <main>
        <Hero />
        <FeatureGrid />
        <SpecialistRoster />
        <ClinicalSOAPSection />
        <BodyGrid />
      </main>
      <Footer />
    </div>
  );
}
