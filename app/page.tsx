"use client";

import { useState, useEffect, useRef } from "react";
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
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Specialists", href: "#specialists" },
  { label: "Pricing", href: "/billing" },
  { label: "About", href: "/about" },
];

const STATS = [
  { value: "24/7", label: "on-demand AI voice consultations" },
  { value: "10+", label: "specialized AI medical agents available" },
  { value: "Instant", label: "clinical SOAP report generation" },
];

const PROOF_ITEMS = [
  { title: "Natural Voice AI", desc: "Powered by Gemini Live and neural speech models for human-like clinical empathy." },
  { title: "Structured SOAP Reports", desc: "Automated Chief Complaint, Assessment, and PDF summary after every call." },
  { title: "HIPAA-Ready & Secure", desc: "Encrypted consultation records, personal history, and private health notes." },
];

const TOPICS = [
  "Natural voice AI consultations",
  "Automated SOAP clinical reports",
  "10+ specialist AI medical agents",
  "Personalized patient health profiles",
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
    title: "Real-time AI voice consultations",
    content: [
      "Speak naturally to dedicated specialist agents in real-time with bidirectional audio",
      "AI asks targeted follow-up questions to understand severity, duration, and context",
      "Receive empathetic, clinically grounded guidance without appointment queues",
      "Review full transcript and audio history right from your personal dashboard",
    ],
  },
  {
    title: "Instant clinical access & triage",
    content: [
      "Skip days or weeks of waiting rooms for preliminary medical guidance",
      "Available 24/7 on demand for late-night worries, non-emergencies, and health questions",
      "Symptom-checking intelligence helps you understand urgency before visiting a clinic",
      "Structured notes save time when consulting your in-person physician",
    ],
  },
  {
    title: "Automated SOAP clinical documentation",
    content: [
      "Every session extracts Chief Complaint, History of Present Illness, and Duration",
      "Differential assessments categorize severity into clear triage indicators",
      "Generate a downloadable, professionally formatted PDF report with a single click",
      "Eliminate handwriting gaps and forgotten symptom details between visits",
    ],
  },
  {
    title: "Specialist triaging & recommendations",
    content: [
      "Describe your symptoms in plain English to automatically identify the best specialist",
      "Direct access to Pediatricians, Cardiologists, Dermatologists, Neurologists, and more",
      "Personalized care accounting for your blood group, allergies, and health history",
      "Flag potential red flags and advise immediate emergency care when symptoms warrant",
    ],
  },
];

const FAQS = [
  {
    q: "How do AI doctor voice consultations work?",
    a: "Choose a specialist agent from your dashboard and click start. Using bidirectional neural voice AI, the specialist listens to your spoken symptoms, asks relevant clinical follow-ups, and explains potential causes and next steps in clear, empathetic language.",
  },
  {
    q: "Can I share the generated SOAP reports with my physical doctor?",
    a: "Yes! At the end of each consultation, MediVoice compiles a hospital-grade SOAP note (Subjective, Objective, Assessment, Plan). You can download it as a formatted PDF or view it in your dashboard history to hand to your primary care physician.",
  },
  {
    q: "Are consultations and medical details private and secure?",
    a: "Yes. MediVoice is engineered with HIPAA-ready principles. All call recordings, transcripts, and personal profile details are protected with AES-256 encryption at rest and TLS 1.3 in transit.",
  },
  {
    q: "Which medical specialties are available on MediVoice?",
    a: "MediVoice features 10+ specialized agents including General Physicians, Pediatricians, Cardiologists, Neurologists, Dermatologists, Psychiatrists, Gynecologists, and more — each with tailored clinical prompts and guidance style.",
  },
  {
    q: "Does MediVoice replace an in-person emergency room or doctor?",
    a: "No. MediVoice is designed for clinical triage, health education, symptom triaging, and documentation. For severe conditions, chest pain, difficulty breathing, or life-threatening emergencies, always call emergency services (like 911) immediately.",
  },
];

const SEO_TERMS = [
  "AI doctor voice consultation",
  "24/7 symptom triage AI",
  "automated clinical SOAP reports",
  "pediatric and cardiology AI specialists",
  "speech-to-speech medical AI",
  "digital health symptom checker",
  "AI medical consultation app",
  "downloadable clinical SOAP notes",
];

const RELATED_LINKS = [
  { label: "AI Doctor Dashboard", href: "/dashboard" },
  { label: "Specialist Roster", href: "#specialists" },
  { label: "Consultation History", href: "/history" },
  { label: "Patient Profile", href: "/profile" },
  { label: "Subscription Plans", href: "/billing" },
  { label: "About Platform", href: "/about" },
];

/* ═══════════════════════════════════════════════════════════════
   1. NAVBAR & INTERACTIVE EYES
   ═══════════════════════════════════════════════════════════════ */
function NavbarInteractiveEyes() {
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);
  const [blinking, setBlinking] = useState(false);
  const [winking, setWinking] = useState(false);
  const [leftPupil, setLeftPupil] = useState({ x: 0, y: 0 });
  const [rightPupil, setRightPupil] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Natural periodic blinking
    let blinkTimeout: NodeJS.Timeout;
    const blinkInterval = setInterval(() => {
      setBlinking(true);
      blinkTimeout = setTimeout(() => setBlinking(false), 140);
    }, 3800);

    const updatePupils = (targetX: number, targetY: number) => {
      const calcOffset = (eyeEl: HTMLDivElement | null) => {
        if (!eyeEl) return { x: 0, y: 0 };
        const rect = eyeEl.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = targetX - cx;
        const dy = targetY - cy;
        const dist = Math.hypot(dx, dy);
        const maxOffset = 3.8;
        const r = Math.min(dist / 16, maxOffset);
        const angle = Math.atan2(dy, dx);
        return {
          x: Math.cos(angle) * r,
          y: Math.sin(angle) * r,
        };
      };

      setLeftPupil(calcOffset(leftEyeRef.current));
      setRightPupil(calcOffset(rightEyeRef.current));
    };

    let lastX = typeof window !== "undefined" ? window.innerWidth / 2 : 500;
    let lastY = typeof window !== "undefined" ? window.innerHeight / 2 : 500;

    const onMouseMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      updatePupils(lastX, lastY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
        updatePupils(lastX, lastY);
      }
    };

    const onScroll = () => {
      // Dynamic vertical tracking as user scrolls down through page content
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollFraction = docHeight > 0 ? Math.min(window.scrollY / docHeight, 1) : 0;
      const gazeY = window.innerHeight * (0.35 + scrollFraction * 0.55);
      updatePupils(lastX, gazeY);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearInterval(blinkInterval);
      clearTimeout(blinkTimeout);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleWink = () => {
    setWinking(true);
    setTimeout(() => setWinking(false), 380);
  };

  return (
    <button
      type="button"
      onClick={handleWink}
      title="Interactive eye tracker — watching your symptoms & scroll!"
      aria-label="Interactive eyes tracking cursor and scroll"
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-rose-50/80 border border-rose-200/80 cursor-pointer select-none transition-transform hover:scale-105 active:scale-95 shadow-sm"
    >
      {/* Left eye */}
      <div
        ref={leftEyeRef}
        className="relative w-5 h-5 rounded-full bg-white border border-gray-300/80 shadow-inner flex items-center justify-center overflow-hidden"
        style={{
          transform: blinking || winking ? "scaleY(0.1)" : "scaleY(1)",
          transition: "transform 100ms ease",
        }}
      >
        <div
          className="w-2.5 h-2.5 rounded-full bg-charcoal relative"
          style={{
            transform: `translate(${leftPupil.x}px, ${leftPupil.y}px)`,
            transition: "transform 70ms ease-out",
          }}
        >
          {/* Glint reflection */}
          <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 rounded-full bg-white" />
        </div>
      </div>

      {/* Right eye */}
      <div
        ref={rightEyeRef}
        className="relative w-5 h-5 rounded-full bg-white border border-gray-300/80 shadow-inner flex items-center justify-center overflow-hidden"
        style={{
          transform: blinking ? "scaleY(0.1)" : "scaleY(1)",
          transition: "transform 100ms ease",
        }}
      >
        <div
          className="w-2.5 h-2.5 rounded-full bg-charcoal relative"
          style={{
            transform: `translate(${rightPupil.x}px, ${rightPupil.y}px)`,
            transition: "transform 70ms ease-out",
          }}
        >
          {/* Glint reflection */}
          <div className="absolute top-0.5 right-0.5 w-0.5 h-0.5 rounded-full bg-white" />
        </div>
      </div>
    </button>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeHash, setActiveHash] = useState<string>("");
  const { user } = useUser();

  useEffect(() => {
    const hashLinks = NAV_LINKS.filter((l) => l.href.startsWith("#")).map((l) => l.href.slice(1));

    const onScroll = () => {
      const scrollPos = window.scrollY + 140;
      let current = "";

      for (const id of hashLinks) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            current = `#${id}`;
          }
        }
      }
      setActiveHash(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top, behavior: "smooth" });
        setActiveHash(href);
      }
    }
  };

  return (
    <header
      className="sticky top-0 z-50 border-b border-gray-200/80"
      style={{ backdropFilter: "blur(16px)", background: "rgba(255,255,255,0.9)" }}
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12">
        <div className="flex items-center justify-between h-[72px] gap-6">
          {/* Brand + Interactive Eye Tracker */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              className="flex items-center gap-3"
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
            <NavbarInteractiveEyes />
          </div>

          {/* Desktop centre nav */}
          <nav className="hidden md:flex items-center gap-2 flex-1 justify-center" aria-label="Primary">
            {NAV_LINKS.map((l) => {
              const isActive = activeHash === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={(e) => handleNavClick(e, l.href)}
                  className={`text-[0.95rem] font-medium transition-all duration-200 px-3.5 py-1.5 rounded-full ${
                    isActive
                      ? "text-primary font-bold bg-rose-50 border border-rose-200/80 shadow-sm"
                      : "text-gray-600 hover:text-charcoal hover:bg-gray-100/60"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
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
            {NAV_LINKS.map((l) => {
              const isActive = activeHash === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "text-primary font-bold bg-rose-50 border border-rose-100"
                      : "text-gray-700 hover:text-primary hover:bg-gray-50"
                  }`}
                  onClick={(e) => {
                    handleNavClick(e, l.href);
                    setOpen(false);
                  }}
                >
                  {l.label}
                </Link>
              );
            })}
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
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pt-10 sm:pt-14 pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
        {/* Left column */}
        <div>
          {/* Eyebrow */}
          <p
            className="inline-flex items-center gap-2.5 px-3.5 py-2.5 rounded-full text-xs font-bold tracking-[0.18em] uppercase mb-5"
            style={{ background: "#fdf2f2", border: "1px solid #fbd5d5", color: "#a4161a" }}
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            24/7 AI Medical Specialist Network
          </p>

          {/* H1 */}
          <h1
            className="font-extrabold text-charcoal tracking-[-0.04em] leading-[0.98] mb-4"
            style={{ fontSize: "clamp(2.6rem, 5vw, 4.15rem)" }}
          >
            Consult with AI Medical Specialists.{" "}
            <span className="text-primary">Anytime, Anywhere.</span>
          </h1>

          {/* Lead */}
          <p className="text-lg text-gray-600 leading-relaxed mb-3 max-w-[700px]">
            MediVoice provides real-time, natural voice consultations with 10+ AI
            clinical specialists. Describe symptoms, receive intelligent triage advice,
            and get hospital-grade SOAP reports generated instantly.
          </p>
          <p className="text-[0.95rem] text-gray-500 mb-7">
            Intake, triaging, and health documentation. For severe emergencies, always
            contact 911 or local emergency services immediately.
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
            MediVoice empowers patients to receive immediate clinical guidance, structured
            triage summaries, and seamless follow-ups whenever symptoms arise.
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
   HOW IT WORKS — 3 Steps
   ═══════════════════════════════════════════════════════════════ */
const STEPS = [
  {
    num: "01",
    title: "Speak to an AI Doctor",
    desc: "Choose from 10+ specialist agents and start a natural voice conversation. Describe your symptoms just like you would in a real clinic call — the AI listens, asks follow-up questions, and guides the session.",
  },
  {
    num: "02",
    title: "Get a Clinical SOAP Report",
    desc: "Your consultation is automatically compiled into an industry-standard clinical summary — Chief Complaint, History, Assessment, and Recommendations — ready to download as a formatted PDF.",
  },
  {
    num: "03",
    title: "Review & Take Action",
    desc: "Access your complete consultation history anytime. Share SOAP reports with your physical doctor, schedule follow-ups, or consult another specialist — all from your health dashboard.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-16">
      <div className="text-center mb-12 space-y-2">
        <p className="text-[11px] font-bold tracking-[0.16em] uppercase" style={{ color: "#a4161a" }}>
          How it works
        </p>
        <h2 className="text-3xl font-extrabold text-charcoal tracking-tight">
          From first call to clinical report — in 3 steps
        </h2>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          No sign-up friction, no waiting rooms. Just speak, and let MediVoice
          handle the rest.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {STEPS.map((step) => (
          <article key={step.num} className="mv-card p-7 relative group hover:shadow-lg transition-shadow">
            {/* Step number */}
            <span
              className="block text-4xl font-extrabold mb-4 tracking-tight"
              style={{ color: "rgba(164, 22, 26, 0.12)" }}
            >
              {step.num}
            </span>
            {/* Connector line on md+ */}
            <h3 className="text-lg font-bold text-charcoal mb-2 group-hover:text-primary transition-colors">
              {step.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. FEATURE GRID
   ═══════════════════════════════════════════════════════════════ */
function FeatureGrid() {
  return (
    <section id="features" className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-16">
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
    <section id="specialists" className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-16">
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
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-16">
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
    <section id="solutions" className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pt-5 pb-20">
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
              Experience the future of digital triage. Start a free voice consultation
              with an AI doctor or explore our specialist roster.
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
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-7 flex flex-wrap items-center justify-between gap-4">
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
        <HowItWorks />
        <SpecialistRoster />
        <ClinicalSOAPSection />
        <BodyGrid />
      </main>
      <Footer />
    </div>
  );
}
