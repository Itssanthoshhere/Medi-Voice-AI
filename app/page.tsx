"use client";

import axios from "axios";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { AIDoctorAgents, DoctorAgent } from "@/shared/list";
import DoctorProfileModal from "@/components/DoctorProfileModal";
import AppFooter from "@/components/AppFooter";
import {
  Mic,
  FileText,
  Sparkles,
  ShieldCheck,
  Clock,
  HeartPulse,
  Brain,
  Activity,
  Headphones,
  ArrowRight,
  ChevronDown,
  Plus,
  PhoneCall,
  Heart,
  MessageSquareHeart,
  Wind,
  Smile,
  Moon,
  CloudRain,
  Flame,
  Loader2,
  Truck,
  Calendar,
  Pill,
  Users,
  FlaskConical,
  MapPin,
  CheckCircle2,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   INLINE ICONS
   ═══════════════════════════════════════════════════════════════ */
const ArrowRightIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
const MenuIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const XIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */
const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Capabilities", href: "#capabilities" },
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
  {
    title: "Natural Voice AI",
    desc: "Powered by Gemini Live and neural speech models for human-like clinical empathy.",
  },
  {
    title: "Structured SOAP Reports",
    desc: "Automated Chief Complaint, Assessment, and PDF summary after every call.",
  },
  {
    title: "HIPAA-Ready & Secure",
    desc: "Encrypted consultation records, personal history, and private health notes.",
  },
];

const TOPICS = [
  "Natural voice AI consultations",
  "Automated SOAP clinical reports",
  "10+ specialist AI medical agents",
  "Personalized patient health profiles",
];

const CORE_FEATURES = [
  {
    icon: Mic,
    title: "Natural Voice Conversations",
    desc: "Speak naturally to AI doctors just like a real clinic phone call. Neural voice synthesis reproduces realistic human cadence, tone, and empathy.",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    icon: FileText,
    title: "Automated Clinical SOAP Reports",
    desc: "Every voice consultation automatically compiles into a structured medical note with Chief Complaint, History, Assessment, and PDF export.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Sparkles,
    title: "Symptom Analysis & Doctor Matching",
    desc: "Describe your symptoms in plain English, and our smart recommendation engine analyzes your condition to suggest the best specialist agent.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: ShieldCheck,
    title: "HIPAA-Ready Security & Privacy",
    desc: "Consultations and medical profiles are protected with AES-256 encryption at rest and TLS 1.3 in transit. Your health data is strictly confidential.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Clock,
    title: "Complete History & Consultation Audit",
    desc: "Review transcripts, doctor advice, and clinical reports from past sessions at any time in your centralized health dashboard.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: HeartPulse,
    title: "Personalized Patient Profiles",
    desc: "Store blood group, allergies, emergency contacts, and preferred AI doctor voice accents so every session is personalized to your care.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
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
    q: "How does Doorstep Medicine Delivery & Nearby Care work?",
    a: "Using your live GPS location, MediVoice calculates real-time Haversine distances to hospitals, ICU facilities, and 24/7 pharmacies within 0.5–5.5 km. You can order OTC or prescription refills in ₹ INR with 20-30 min express delivery via Tata 1mg, Apollo 24/7, Fortis, and MedPlus.",
  },
  {
    q: "Can I book doctor appointments and track prescriptions for family members?",
    a: "Yes! You can book 15-minute voice AI consultation slots with any doctor, manage digital prescriptions with dosage reminders, record vitals, and switch between family dependent profiles (Spouse, Child, Parent, Sibling) under one primary account.",
  },
  {
    q: "Does MediVoice replace an in-person emergency room or doctor?",
    a: "No. MediVoice is designed for clinical triage, health education, symptom triaging, and documentation. For severe conditions, chest pain, difficulty breathing, or life-threatening emergencies, always dial national emergency 108 or 911 immediately.",
  },
];

const SEO_TERMS = [
  "AI doctor voice consultation",
  "doorstep medicine delivery 20-30 mins",
  "nearby hospitals emergency 108 triage",
  "doctor appointment booking AI",
  "digital prescription medication tracker",
  "real-time vitals monitoring app",
  "family health dependent profile manager",
  "automated clinical SOAP reports",
  "medical lab report OCR biomarker vault",
];

const RELATED_LINKS = [
  { label: "AI Doctor Dashboard", href: "/dashboard" },
  { label: "Nearby Emergency & Pharmacy", href: "/nearby" },
  { label: "Doctor Appointments", href: "/appointments" },
  { label: "Prescription Tracker", href: "/prescriptions" },
  { label: "Vitals Monitor", href: "/vitals" },
  { label: "Family Profiles", href: "/family" },
  { label: "Report Vault", href: "/vault" },
  { label: "Patient Profile & Orders", href: "/profile" },
  { label: "Subscription Plans", href: "/billing" },
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
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollFraction =
        docHeight > 0 ? Math.min(window.scrollY / docHeight, 1) : 0;
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
    const hashLinks = NAV_LINKS.filter((l) => l.href.startsWith("#")).map((l) =>
      l.href.slice(1),
    );

    const onScroll = () => {
      const scrollPos = window.scrollY + 160;
      let current = "";

      for (const id of hashLinks) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const top = rect.top + window.pageYOffset;
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

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
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
      style={{
        backdropFilter: "blur(16px)",
        background: "rgba(255,255,255,0.9)",
      }}
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
          <nav
            className="hidden md:flex items-center gap-6 flex-1 justify-center"
            aria-label="Primary"
          >
            {NAV_LINKS.map((l) => {
              const isActive = activeHash === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={(e) => handleNavClick(e, l.href)}
                  className={`text-[0.93rem] font-semibold tracking-tight transition-all duration-200 px-3.5 py-1.5 rounded-full ${
                    isActive
                      ? "text-[#a4161a] font-bold bg-rose-50 border border-rose-200/80 shadow-2xs"
                      : "text-[#1e293b] hover:text-[#a4161a] hover:bg-rose-50/50"
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
                <Link
                  href="/sign-in"
                  className="text-[0.95rem] text-gray-600 hover:text-charcoal transition-colors"
                >
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
                <Button
                  variant="outline"
                  className="rounded-full font-semibold"
                >
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
          <nav
            className="md:hidden pb-4 border-t border-gray-100 flex flex-col"
            aria-label="Mobile navigation"
          >
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
                  <Link
                    href="/sign-in"
                    className="px-2 py-2.5 text-sm font-medium text-gray-700"
                  >
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
                  <Button
                    variant="outline"
                    className="rounded-full font-semibold w-full mr-4"
                  >
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
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pt-8 sm:pt-12 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Headline, Pills & CTAs */}
        <div className="lg:col-span-6 space-y-6">
          {/* Top Pill Badges Row (medivoice.org style) */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-50 text-[#a4161a] border border-red-100">
              <HeartPulse className="w-3.5 h-3.5 text-[#a4161a]" />
              Built for 24/7 AI Medical Consultation
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-200">
              <Sparkles className="w-3.5 h-3.5 text-[#a4161a]" />
              Launch offer · 10+ Specialists →
            </span>
          </div>

          {/* Main H1 Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-charcoal tracking-tight leading-[1.06]">
            The AI medical network built for{" "}
            <span className="italic font-serif font-normal text-[#a4161a]">
              voice consultations.
            </span>
          </h1>

          {/* Sub-headline Paragraph */}
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl">
            MediVoice AI is built for instant patient triage, automating intake,
            clinical consultations, and health documentation: instant voice AI
            specialists, SOAP reports, emergency routing, and follow-up care.
          </p>

          {/* Pill Shaped CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold !text-white bg-[#18181b] hover:bg-black transition-all shadow-sm hover:shadow-md"
              style={{ color: "#ffffff" }}
            >
              <Headphones className="w-4 h-4 text-white shrink-0" />
              <span className="!text-white" style={{ color: "#ffffff" }}>
                Try the agent
              </span>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold text-gray-800 bg-gray-100 hover:bg-gray-200 transition-all border border-gray-200/80"
            >
              Book a Demo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Sub-label proof text */}
          <div className="pt-2 flex items-center gap-4 text-xs text-gray-400 font-medium">
            <span>✓ No credit card required</span>
            <span>•</span>
            <span>✓ Instant voice responses</span>
            <span>•</span>
            <span>✓ Encrypted HIPAA security</span>
          </div>
        </div>

        {/* Right Column: Creative Live Interactive Consultation Mock & EHR Sync (medivoice.org style) */}
        <div className="lg:col-span-6">
          <div className="bg-gradient-to-b from-gray-50 to-gray-100/60 p-4 sm:p-6 rounded-3xl border border-gray-200/80 shadow-xl space-y-4 relative overflow-hidden">
            {/* Top Interactive Inbox Panel */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200/80 shadow-sm space-y-4">
              {/* Header Bar */}
              <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-800 hover:bg-gray-50 transition-colors">
                    Active AI Specialists <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                  <span className="hidden sm:inline-flex text-[10px] font-extrabold text-[#a4161a] bg-red-50 border border-red-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    +10 Doctors Online
                  </span>
                </div>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 bg-[#18181b] hover:bg-black !text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
                  style={{ color: "#ffffff" }}
                >
                  <Plus className="w-3.5 h-3.5 text-white shrink-0" />
                  <span className="!text-white" style={{ color: "#ffffff" }}>
                    Start Consult
                  </span>
                </Link>
              </div>

              {/* Consultation Live Feed List featuring MediVoice AI Doctors */}
              <div className="space-y-2.5">
                {[
                  {
                    name: "Dr. Elliot",
                    role: "General Physician",
                    desc: "Fever, Cough & Cold Triage",
                    time: "2m ago",
                    status: "Active Call",
                    statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
                    channel: "Voice Session",
                    channelIcon: PhoneCall,
                  },
                  {
                    name: "Dr. Layla",
                    role: "Psychologist",
                    desc: "Anxiety, Stress & Sleep Intake",
                    time: "12m ago",
                    status: "SOAP Ready",
                    statusColor: "text-[#a4161a] bg-red-50 border-red-200",
                    channel: "PDF Summary",
                    channelIcon: FileText,
                  },
                  {
                    name: "Dr. Clara",
                    role: "Dermatologist",
                    desc: "Skin Rash & Allergy Assessment",
                    time: "45m ago",
                    status: "Triage Complete",
                    statusColor: "text-blue-700 bg-blue-50 border-blue-200",
                    channel: "AI Analysis",
                    channelIcon: Sparkles,
                  },
                  {
                    name: "Dr. Savannah",
                    role: "Pediatrician",
                    desc: "Infant Care & Fever Guidance",
                    time: "1h ago",
                    status: "In Progress",
                    statusColor: "text-amber-700 bg-amber-50 border-amber-200",
                    channel: "Voice Stream",
                    channelIcon: Mic,
                  },
                  {
                    name: "Dr. Emma",
                    role: "Nutritionist",
                    desc: "Gut Health & Meal Plan Advice",
                    time: "2h ago",
                    status: "Completed",
                    statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
                    channel: "Encrypted",
                    channelIcon: ShieldCheck,
                  },
                ].map((doctor, idx) => {
                  const ChannelIcon = doctor.channelIcon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-gray-50/70 hover:bg-gray-100/80 border border-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-red-50 text-[#a4161a] font-bold text-xs flex items-center justify-center shrink-0 border border-red-100">
                          {doctor.name.replace("Dr. ", "").charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs font-bold text-gray-900 truncate">
                              {doctor.name}
                            </h5>
                            <span className="text-[10px] text-gray-400 font-medium">
                              • {doctor.role}
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium shrink-0">
                              {doctor.time}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 truncate">
                            {doctor.desc}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${doctor.statusColor}`}
                        >
                          {doctor.status}
                        </span>
                        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-gray-500 font-medium bg-white px-2 py-0.5 rounded border border-gray-200">
                          <ChannelIcon className="w-3 h-3 text-gray-400" />
                          {doctor.channel}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Live Sync Header & MediVoice AI Core System Cards */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 font-bold text-gray-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  LIVE · REAL-TIME VOICE AI & CLINICAL EHR SYNC
                </span>
                <span className="text-gray-400 font-semibold">+10 doctors</span>
              </div>

              {/* Core System Sync Cards (Voice Engine, SOAP Generator, Patient Vault) */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-2xs space-y-1 text-center">
                  <div className="text-[11px] font-extrabold text-[#a4161a] tracking-tight uppercase">
                    Voice Engine
                  </div>
                  <div className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                    <span className="font-bold text-[#a4161a] bg-red-50 px-1 rounded">
                      99.4% Acc
                    </span>
                    <span className="truncate">Neural Stream</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-2xs space-y-1 text-center">
                  <div className="text-[11px] font-extrabold text-blue-600 tracking-tight uppercase">
                    SOAP Generator
                  </div>
                  <div className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                    <span className="font-bold text-blue-700 bg-blue-50 px-1 rounded">
                      Instant PDF
                    </span>
                    <span className="truncate">Clinical Report</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-2xs space-y-1 text-center">
                  <div className="text-[11px] font-extrabold text-emerald-600 tracking-tight uppercase">
                    Patient Vault
                  </div>
                  <div className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-1 rounded">
                      AES-256
                    </span>
                    <span className="truncate">HIPAA Encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2.5 COMPLETE CLINICAL CARE SUITE (Bento Grid Layout)
   ═══════════════════════════════════════════════════════════════ */
const GoogleCalendarTile = () => (
  <div className="w-5 h-5 rounded-[4px] bg-[#4285F4] text-white font-bold text-[9px] flex items-center justify-center shadow-2xs shrink-0">
    31
  </div>
);

const OutlookCalendarTile = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#0078D4"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

function LandingClinicalSuite() {
  return (
    <section id="capabilities" className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <p
          className="text-[11px] font-bold tracking-[0.16em] uppercase"
          style={{ color: "#a4161a" }}
        >
          Platform Capabilities
        </p>
        <h2 className="text-3xl md:text-5xl font-extrabold text-charcoal tracking-tight leading-tight">
          This is how MediVoice manages{" "}
          <span className="italic font-serif font-normal text-[#a4161a]">
            your complete health journey
          </span>
        </h2>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          MediVoice reads referrals, triages symptoms, delivers doorstep medicines, schedules doctor appointments, logs vitals, and updates your family record before a case goes cold.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="space-y-6">
        {/* ROW 1: Large Dark Featured Card (7 cols) + White Card (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Featured Card 1: Dark Charcoal Gradient */}
          <div className="lg:col-span-7 bg-gradient-to-br from-[#18181b] via-[#27272a] to-[#09090b] text-white p-8 md:p-10 rounded-3xl shadow-xl flex flex-col justify-between space-y-8 relative overflow-hidden group">
            <div className="space-y-6">
              {/* Top Icon Pill */}
              <div className="w-11 h-11 rounded-2xl bg-white/10 text-rose-300 flex items-center justify-center border border-white/10 shadow-inner">
                <PhoneCall className="w-5 h-5" />
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-snug text-white">
                  24/7 Nearby Emergency Care & Doorstep Medicine Express
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed max-w-xl">
                  Locate 24/7 hospitals and ICU trauma centers within 0.5–5.5 km using live GPS & Haversine distance math. One-touch 108 emergency triage dial and 20-30 min doorstep delivery via Tata 1mg & Apollo 24/7.
                </p>
              </div>
            </div>

            {/* Bottom Badges & Action Row */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  "0.5 - 5.5 km GPS",
                  "Haversine Math",
                  "108 Emergency Dial",
                  "Tata 1mg Express",
                  "Apollo 24/7",
                  "20-30 Mins ETA",
                ].map((badge, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-medium bg-white/10 text-white/90 border border-white/15 px-3 py-1 rounded-full backdrop-blur-sm"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              <div>
                <Link
                  href="/nearby"
                  className="inline-flex items-center gap-2 text-xs font-bold text-rose-300 hover:text-white transition-colors"
                >
                  <span>Explore Nearby Care & Order Medicines</span>
                  <ArrowRight className="w-4 h-4 text-rose-300 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* White Card 1: Doctor Appointments */}
          <div className="lg:col-span-5 bg-white border border-gray-200/90 rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all space-y-6">
            <div className="space-y-5">
              <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-2xs">
                <Calendar className="w-5 h-5" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900 leading-snug">
                  Books specialist evaluations while you're still on the phone
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Checks provider availability in real time, books 15-minute voice AI consultation slots mid-call, and sends SMS + email confirmations before symptoms escalate.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500">
                <GoogleCalendarTile />
                <OutlookCalendarTile />
                <span>Google + Outlook calendars</span>
              </div>
              <Link
                href="/appointments"
                className="text-xs font-bold text-gray-900 hover:text-[#a4161a] transition-colors flex items-center gap-1"
              >
                <span>Book Slot</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#a4161a]" />
              </Link>
            </div>
          </div>
        </div>

        {/* ROW 2: Large Dark Red Featured Card (7 cols) + White Card (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Featured Card 2: Deep Crimson Red Gradient */}
          <div className="lg:col-span-7 bg-gradient-to-br from-[#a4161a] via-[#8b1116] to-[#580a0d] text-white p-8 md:p-10 rounded-3xl shadow-xl flex flex-col justify-between space-y-8 relative overflow-hidden group">
            <div className="space-y-6">
              {/* Top Icon Pill */}
              <div className="w-11 h-11 rounded-2xl bg-white/15 text-white flex items-center justify-center border border-white/20 shadow-inner">
                <MessageSquareHeart className="w-5 h-5" />
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-snug text-white">
                  Digital prescriptions & persistent follow-ups that get every regimen tracked
                </h3>
                <p className="text-sm text-rose-100 leading-relaxed max-w-xl">
                  After every consultation, MediVoice generates a structured digital prescription with dosage, timing, and duration details. Logs daily dose adherence and automates refill requests.
                </p>
              </div>
            </div>

            {/* Bottom Badges & Action Row */}
            <div className="space-y-4 pt-4 border-t border-white/15">
              <div className="flex flex-wrap items-center gap-2">
                {[
                  "Auto RX Generator",
                  "Dosage Timings",
                  "Adherence Logs",
                  "1-Click Refills",
                  "Full Audit Trail",
                ].map((badge, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-medium bg-white/15 text-white border border-white/20 px-3 py-1 rounded-full backdrop-blur-sm"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              <div>
                <Link
                  href="/prescriptions"
                  className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-rose-200 transition-colors"
                >
                  <span>Manage Prescriptions & Refills</span>
                  <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* White Card 2: Vitals Monitor */}
          <div className="lg:col-span-5 bg-white border border-gray-200/90 rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all space-y-6">
            <div className="space-y-5">
              <div className="w-11 h-11 rounded-full bg-rose-50 text-[#a4161a] flex items-center justify-center border border-rose-100 shadow-2xs">
                <HeartPulse className="w-5 h-5" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900 leading-snug">
                  Real-time vitals monitoring & health risk indicator scoring
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Logs Heart Rate (BPM), Blood Pressure (mmHg), SpO2 (%), Temperature (°F), and Blood Glucose. Automated health risk engine alerts you instantly when vital trends require attention.
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500">
                <span className="p-1 rounded bg-rose-50 text-[#a4161a] border border-rose-100 font-bold">
                  🩺
                </span>
                <span>Automated BPM & BP anomaly alerts</span>
              </div>
              <Link
                href="/vitals"
                className="text-xs font-bold text-gray-900 hover:text-[#a4161a] transition-colors flex items-center gap-1"
              >
                <span>Track Vitals</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#a4161a]" />
              </Link>
            </div>
          </div>
        </div>

        {/* ROW 3: Three Equal White Cards (4 cols each) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Card 1: Family Profiles */}
          <div className="bg-white border border-gray-200/90 rounded-3xl p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all space-y-5">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900 leading-snug">
                  Family dependent health profiles
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed mt-1.5">
                  Scope consultations, lab vaults, and health timelines for your spouse, children, parents, or siblings under one primary account.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <Link
                href="/family"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-900 hover:text-[#a4161a] transition-colors"
              >
                <span>Manage Family</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#a4161a]" />
              </Link>
            </div>
          </div>

          {/* Card 2: Report Vault */}
          <div className="bg-white border border-gray-200/90 rounded-3xl p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all space-y-5">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900 leading-snug">
                  Lab report OCR & biomarker analytics
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed mt-1.5">
                  Upload PDF lab reports to extract parameters, detect out-of-range deficiencies, and track biomarker trends over time.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <Link
                href="/vault"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-900 hover:text-[#a4161a] transition-colors"
              >
                <span>Open Report Vault</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#a4161a]" />
              </Link>
            </div>
          </div>

          {/* Card 3: SOAP Summary Engine */}
          <div className="bg-white border border-gray-200/90 rounded-3xl p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all space-y-5">
            <div className="space-y-4">
              <div className="w-11 h-11 rounded-full bg-rose-50 text-[#a4161a] flex items-center justify-center border border-rose-100">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-gray-900 leading-snug">
                  Never lose another health insight
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed mt-1.5">
                  Every voice call compiles into a hospital-grade SOAP summary (Subjective, Objective, Assessment, Plan) with instant PDF export.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <Link
                href="/history"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-900 hover:text-[#a4161a] transition-colors"
              >
                <span>View Consultation History</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#a4161a]" />
              </Link>
            </div>
          </div>
        </div>
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
    <section
      id="how-it-works"
      className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-16"
    >
      <div className="text-center mb-12 space-y-2">
        <p
          className="text-[11px] font-bold tracking-[0.16em] uppercase"
          style={{ color: "#a4161a" }}
        >
          How it works
        </p>
        <h2 className="text-3xl md:text-5xl font-extrabold text-charcoal tracking-tight leading-tight">
          From first call to clinical report —{" "}
          <span className="italic font-serif font-normal text-[#a4161a]">
            in 3 steps
          </span>
        </h2>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          No sign-up friction, no waiting rooms. Just speak, and let MediVoice
          handle the rest.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {STEPS.map((step) => (
          <article
            key={step.num}
            className="mv-card p-7 relative group hover:shadow-lg transition-shadow"
          >
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
    <section
      id="features"
      className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-16 space-y-12"
    >
      {/* Section Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <p
          className="text-[11px] font-bold tracking-[0.16em] uppercase"
          style={{ color: "#a4161a" }}
        >
          Why patients choose MediVoice AI
        </p>
        <h2 className="text-3xl md:text-5xl font-extrabold text-charcoal tracking-tight leading-tight">
          AI agents handle every step from symptoms to{" "}
          <span className="italic font-serif font-normal text-[#a4161a]">
            a scheduled follow-up
          </span>
        </h2>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          MediVoice AI does not stop at the consultation. It listens, analyzes,
          generates clinical reports, and keeps your health record updated.
        </p>
      </div>

      {/* Split Layout: Feature Cards + Workflow Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: 2x2 Feature Cards Grid */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: Mic,
              title: "Natural voice conversation",
              desc: "Speak to AI doctors naturally, just like a real phone call. Low-latency neural voices ensure human-like cadence and warmth.",
            },
            {
              icon: FileText,
              title: "Auto clinical SOAP reports",
              desc: "Every session compiles into a structured medical summary — Chief Complaint, History, Assessment — ready to download as PDF.",
            },
            {
              icon: Clock,
              title: "Consultation history",
              desc: "Review transcripts, doctor advice, and clinical reports from past sessions at any time from your health dashboard.",
            },
            {
              icon: HeartPulse,
              title: "Personalized profiles",
              desc: "Store blood group, allergies, emergency contacts, and preferred AI doctor so every session is personalized to your care.",
            },
          ].map((f, idx) => {
            const Icon = f.icon;
            return (
              <article
                key={idx}
                className="bg-white rounded-3xl p-6 md:p-7 border border-gray-200/70 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="p-3 rounded-2xl w-max bg-red-50/80 border border-red-100 text-[#a4161a] group-hover:bg-[#a4161a] group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 leading-snug">
                    {f.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {/* Right: Workflow Canvas Container (Gray BG like reference) */}
        <div className="lg:col-span-7">
          <div className="bg-[#f3f4f6] rounded-3xl p-6 md:p-8 space-y-6 border border-gray-200/60 shadow-sm h-full flex flex-col justify-between">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gray-900 text-white shadow-sm">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#a4161a]">
                      CONSULTATION AGENT
                    </p>
                    <h4 className="text-lg font-extrabold text-gray-900">
                      Voice consultation workflow
                    </h4>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/70 border border-emerald-200 px-3 py-1 rounded-full">
                  Live
                </span>
              </div>

              {/* Timeline Step Cards (White / Tinted Cards inside Gray Canvas) */}
              <div className="space-y-3.5">
                {[
                  {
                    icon: Mic,
                    step: "Step 1",
                    label: "VOICE",
                    labelColor: "text-[#a4161a]",
                    cardBg: "bg-white border-gray-200/80",
                    titleColor: "text-[#a4161a]",
                    descColor: "text-red-900/70",
                    title: "Patient voice intake & symptoms",
                    desc: "Real-time speech stream processed with low latency, identifying symptom context automatically.",
                  },
                  {
                    icon: Brain,
                    step: "Step 2",
                    label: "AI TRIAGE",
                    labelColor: "text-red-600",
                    cardBg: "bg-red-50/60 border-red-100",
                    titleColor: "text-red-700",
                    descColor: "text-red-900/70",
                    title: "AI specialist analyzes condition",
                    desc: "Multi-agent system routes case to specialist persona and asks targeted follow-up questions.",
                  },
                  {
                    icon: FileText,
                    step: "Step 3",
                    label: "SOAP",
                    labelColor: "text-red-700",
                    cardBg: "bg-red-50/40 border-red-100/80",
                    titleColor: "text-red-800",
                    descColor: "text-red-900/70",
                    title: "Generate clinical SOAP report",
                    desc: "Auto-compiled medical summary with Chief Complaint, Assessment, and downloadable PDF.",
                  },
                  {
                    icon: ShieldCheck,
                    step: "Step 4",
                    label: "RECORD",
                    labelColor: "text-emerald-700",
                    cardBg: "bg-emerald-50/60 border-emerald-100",
                    titleColor: "text-emerald-800",
                    descColor: "text-emerald-900/70",
                    title: "Encrypted health record backup",
                    desc: "Consultation transcript, report, and doctor notes stored securely with AES-256 encryption.",
                  },
                  {
                    icon: Activity,
                    step: "Step 5",
                    label: "FOLLOW-UP",
                    labelColor: "text-amber-700",
                    cardBg: "bg-amber-50/60 border-amber-100",
                    titleColor: "text-amber-800",
                    descColor: "text-amber-900/70",
                    title: "Schedule follow-up & care handoff",
                    desc: "Share SOAP report with your primary doctor or trigger automated follow-up reminders.",
                  },
                ].map((item, idx) => {
                  const StepIcon = item.icon;
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-2xl border shadow-sm transition-all flex items-start gap-3.5 ${item.cardBg}`}
                    >
                      <div className="p-2 rounded-lg bg-white border border-gray-200/80 text-gray-700 shrink-0 mt-0.5 shadow-2xs">
                        <StepIcon className="w-4 h-4" />
                      </div>
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[9px] font-extrabold uppercase tracking-[0.14em] ${item.labelColor}`}
                          >
                            {item.label}
                          </span>
                          <span className="text-[10px] text-gray-400 font-semibold">
                            {item.step}
                          </span>
                        </div>
                        <h5 className={`text-sm font-bold ${item.titleColor}`}>
                          {item.title}
                        </h5>
                        <p className={`text-xs leading-relaxed ${item.descColor}`}>
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Footer Statistics Row (like reference) */}
            <div className="border-t border-gray-200/60 pt-5 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs font-bold text-gray-900">SOAP Notes</p>
                <p className="text-[11px] text-gray-400">generated per call</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Transcripts</p>
                <p className="text-[11px] text-gray-400">encrypted & saved</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Follow-ups</p>
                <p className="text-[11px] text-gray-400">automated care</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. SPECIALIST ROSTER
   ═══════════════════════════════════════════════════════════════ */
function SpecialistRoster() {
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorAgent | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  const clinicalDoctors = AIDoctorAgents.filter(
    (doctor) => doctor.specialist !== "Mental Health Counsellor" && doctor.id !== 11
  );

  const handleCardClick = (doctor: DoctorAgent) => {
    setSelectedDoctor(doctor);
    setModalOpen(true);
  };

  const handleStartConsultation = (doctor: DoctorAgent) => {
    setModalOpen(false);
    if (!user) {
      router.push("/sign-up");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <section
      id="specialists"
      className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-16"
    >
      <div className="text-center mb-12">
        <p
          className="text-[11px] font-bold tracking-[0.16em] uppercase mb-3"
          style={{ color: "#a4161a" }}
        >
          Specialist Network
        </p>
        <h2 className="text-3xl md:text-5xl font-extrabold text-charcoal tracking-tight leading-tight mb-3">
          10 Specialized AI{" "}
          <span className="italic font-serif font-normal text-[#a4161a]">
            Medical Agents
          </span>
        </h2>
        <p className="text-gray-500 text-sm max-w-xl mx-auto">
          Tap any doctor agent card below to view their full clinical profile,
          areas of expertise, and sample consultation questions.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {clinicalDoctors.map((doctor) => (
          <div
            key={doctor.id}
            onClick={() => handleCardClick(doctor)}
            className="mv-card p-4 flex flex-col justify-between hover:shadow-xl transition-all cursor-pointer group"
          >
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
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors flex items-center justify-between">
                  <span>{doctor.doctorName || doctor.specialist}</span>
                </h3>
                <span className="text-[10px] text-primary font-semibold block mt-0.5">
                  {doctor.specialist}
                </span>
                <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-snug">
                  {doctor.description}
                </p>
              </div>
            </div>
            <div className="pt-3 mt-3 border-t border-gray-200/80">
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(doctor);
                }}
                className="w-full text-xs font-bold h-8 rounded-xl bg-rose-50 text-[#a4161a] border border-rose-200/90 hover:bg-[#a4161a] hover:!text-white hover:border-[#a4161a] transition-all duration-200 shadow-2xs"
              >
                View Profile & Consult
              </Button>
            </div>
          </div>
        ))}
      </div>

      <DoctorProfileModal
        doctor={selectedDoctor}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onStartConsultation={handleStartConsultation}
      />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4.5 DEDICATED MENTAL HEALTH CONSULTATION (Dr. Maya - Doctor #11)
   ═══════════════════════════════════════════════════════════════ */
function LandingMentalHealthSection() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const mayaAgent = AIDoctorAgents.find(
    (a) => a.specialist === "Mental Health Counsellor"
  ) || {
    id: 11,
    specialist: "Mental Health Counsellor",
    doctorName: "Dr. Maya",
    image: "/doctor11.jpg",
    description:
      "Provides a safe, non-judgmental space for emotional support, stress relief, and mental wellness guidance.",
  };

  const handleStartConsultation = async (customPrompt?: string) => {
    if (!user) {
      router.push("/sign-up");
      return;
    }

    try {
      setLoading(true);
      const promptToUse =
        customPrompt ||
        "Emotional wellness consultation and supportive conversation.";

      const res = await axios.post("/api/session-chat", {
        notes: promptToUse,
        selectedDoctor: mayaAgent,
      });

      if (res.data?.sessionId) {
        router.push(`/dashboard/medical-agent/${res.data.sessionId}`);
      }
    } catch (err) {
      console.error("Failed to start mental health session:", err);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const QUICK_MOODS = [
    {
      label: "Feeling Overwhelmed",
      icon: Flame,
      prompt:
        "I am feeling overwhelmed with everything going on right now and need emotional support.",
      desc: "Work, study, or life stress",
    },
    {
      label: "Can't Sleep & Anxious",
      icon: Moon,
      prompt:
        "My mind won't stop racing and anxiety is making it really hard to sleep.",
      desc: "Late-night racing thoughts",
    },
    {
      label: "Low Mood & Sadness",
      icon: CloudRain,
      prompt:
        "I've been feeling down and low on energy lately, and I don't know who to talk to.",
      desc: "Need gentle emotional comfort",
    },
    {
      label: "Just Need to Vent",
      icon: Smile,
      prompt:
        "I just need a safe, non-judgmental space to talk through some things on my mind.",
      desc: "Safe, non-judgmental listening",
    },
  ];

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 py-16">
      <div className="text-center mb-10 space-y-2">
        <p
          className="text-[11px] font-bold tracking-[0.16em] uppercase"
          style={{ color: "#a4161a" }}
        >
          Emotional Wellness & Counselling
        </p>
        <h2 className="text-3xl md:text-5xl font-extrabold text-charcoal tracking-tight leading-tight">
          Dedicated Mental Health{" "}
          <span className="italic font-serif font-normal text-[#a4161a]">
            Support & Counselling
          </span>
        </h2>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          Private, 24/7 safe space for compassionate emotional listening, stress decompression, and mindfulness with Dr. Maya.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-rose-100 bg-gradient-to-br from-white via-rose-50/25 to-gray-50/50 p-6 sm:p-10 shadow-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-10">
          {/* Left Side: Avatar + Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative shrink-0">
              <div className="relative h-28 w-28 sm:h-32 sm:w-32 overflow-hidden rounded-3xl border-2 border-rose-200/80 bg-slate-100 shadow-md">
                <Image
                  src={mayaAgent.image || "/doctor11.jpg"}
                  alt="Dr. Maya - Mental Health Counsellor"
                  fill
                  className="object-cover object-top"
                  sizes="128px"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 flex items-center gap-1.5 rounded-full bg-emerald-600 border-2 border-white px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                Available 24/7
              </div>
            </div>

            <div className="space-y-3 max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#a4161a] bg-rose-50 border border-rose-200/80 px-3 py-0.5 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-[#a4161a]" />
                  Emotional Wellness Specialist (Doctor #11)
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full">
                  100% Free & Confidential
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                Dr. Maya{" "}
                <span className="text-xs sm:text-sm font-normal text-gray-500 font-sans">
                  (AI Mental Health Counsellor)
                </span>
              </h3>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Connect for non-judgmental active listening, calming anxiety decompression, and healthy emotional coping techniques.{" "}
                <strong className="text-gray-900 font-semibold">
                  Strictly zero medication prescribed
                </strong>{" "}
                — designed entirely around your emotional wellbeing and crisis safety.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-gray-600">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Zero Medications Prescribed
                </span>
                <span className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-[#a4161a]" />
                  Empathetic Active Listening
                </span>
                <span className="flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-indigo-600" />
                  Mindfulness & Decompression
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Action Buttons */}
          <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3 items-stretch lg:items-end justify-center">
            <button
              onClick={() => handleStartConsultation()}
              disabled={loading}
              className="group flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-[#a4161a] hover:bg-[#8b1116] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  Connecting with Dr. Maya...
                </>
              ) : (
                <>
                  <MessageSquareHeart className="w-4.5 h-4.5 text-rose-200" />
                  Talk with Dr. Maya
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <a
              href="tel:988"
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-rose-300 text-xs text-gray-600 hover:text-[#a4161a] transition-all text-center cursor-pointer shadow-2xs"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#a4161a]" />
              <span>
                Crisis support? Call/Text <strong>988</strong> Lifeline (24/7)
              </span>
            </a>
          </div>
        </div>

        {/* Quick Mood Prompts */}
        <div className="mt-8 pt-6 border-t border-gray-200/70">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#a4161a]" />
            Choose how you're feeling to start a confidential voice session:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {QUICK_MOODS.map((mood, idx) => {
              const Icon = mood.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleStartConsultation(mood.prompt)}
                  disabled={loading}
                  className="group flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-gray-200/80 hover:border-[#a4161a]/40 hover:bg-rose-50/40 transition-all duration-200 text-left shadow-2xs hover:shadow-sm cursor-pointer"
                >
                  <div className="h-9 w-9 rounded-xl bg-rose-50 group-hover:bg-[#a4161a]/10 flex items-center justify-center shrink-0 transition-colors">
                    <Icon className="w-4.5 h-4.5 text-[#a4161a] transition-colors" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-900 group-hover:text-[#a4161a] truncate transition-colors">
                      {mood.label}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate">
                      {mood.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
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
          <p
            className="text-[11px] font-bold tracking-[0.16em] uppercase"
            style={{ color: "#a4161a" }}
          >
            Clinical Documentation
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-charcoal tracking-tight leading-tight">
            Hospital-Grade SOAP Reports{" "}
            <span className="italic font-serif font-normal text-[#a4161a]">
              Generated Automatically
            </span>
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Every voice consultation automatically compiles into an
            industry-standard clinical summary covering Chief Complaint,
            History, Differential Assessments, and Recommendations — ready to
            export as a formatted PDF for physicians.
          </p>
          <ul className="space-y-2.5 text-sm text-gray-700">
            {[
              "Automatic extraction of Chief Complaint and Duration",
              "Differential clinical assessments with triage flags",
              "Downloadable formatted PDF reports for physical doctors",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                  ✓
                </span>
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
              <span className="font-bold text-gray-900">
                Clinical SOAP Report
              </span>
              <span className="text-gray-400">• Session #MV-8492</span>
            </div>
            <span className="font-bold text-primary bg-rose-50 px-2 py-0.5 rounded">
              PDF Ready
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl">
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold">
                Specialist
              </span>
              <p className="font-bold text-gray-800">
                Dr. Elliot (General Physician)
              </p>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 uppercase font-bold">
                Triage Status
              </span>
              <p className="font-bold text-emerald-600">
                Non-Emergent / Stable
              </p>
            </div>
          </div>
          <div className="space-y-2 text-gray-700">
            <div>
              <span className="font-bold text-gray-900 uppercase text-[10px]">
                Chief Complaint:
              </span>
              <p className="bg-gray-50 p-2 rounded-lg mt-1 text-gray-600">
                48-hour history of sore throat, dry cough, and mild fatigue. No
                dyspnea reported.
              </p>
            </div>
            <div>
              <span className="font-bold text-gray-900 uppercase text-[10px]">
                Recommendations:
              </span>
              <p className="bg-gray-50 p-2 rounded-lg mt-1 text-gray-600">
                Supportive care, hydration, rest. Follow up with in-person
                clinic if fever exceeds 101°F.
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
    <section
      id="solutions"
      className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pt-5 pb-20"
    >
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
                  <span className="text-primary text-xl font-light shrink-0">
                    +
                  </span>
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
            <h3 className="text-xl font-bold text-charcoal mb-4">
              Common questions
            </h3>
            <div className="mv-card overflow-hidden p-1">
              {FAQS.map((faq, idx) => (
                <details
                  key={faq.q}
                  className="mv-detail border-b border-gray-100 last:border-0"
                  open={idx === 0}
                >
                  <summary className="flex items-center justify-between gap-4 px-5 py-5 text-[1.05rem] font-semibold text-charcoal hover:text-primary transition-colors">
                    {faq.q}
                    <span className="text-primary text-xl font-light shrink-0">
                      +
                    </span>
                  </summary>
                  <div className="px-5 pb-5">
                    <p className="text-gray-600 text-[0.95rem] leading-relaxed">
                      {faq.a}
                    </p>
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
            <h3 className="text-lg font-bold text-charcoal mb-4">
              Common searches this page answers
            </h3>
            <div className="grid gap-2.5">
              {SEO_TERMS.map((t) => (
                <span
                  key={t}
                  className="block text-[0.92rem] px-3.5 py-3 rounded-2xl"
                  style={{
                    background: "#fdf2f2",
                    border: "1px solid #fbd5d5",
                    color: "#4a1011",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Explore more */}
          <div className="mv-card p-5">
            <h3 className="text-lg font-bold text-charcoal mb-4">
              Explore more
            </h3>
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
              Experience the future of digital triage. Start a free voice
              consultation with an AI doctor or explore our specialist roster.
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
  return <AppFooter />;
}

/* ═══════════════════════════════════════════════════════════════
   PAGE ROOT
   ═══════════════════════════════════════════════════════════════ */
export default function Page() {
  return (
    <div className="mv-shell">
      <Navbar />
      <main className="space-y-0">
        {/* 1. Hero Section - Soft Light Ambient Canvas */}
        <section className="w-full bg-gradient-to-b from-gray-50/90 via-white to-gray-50/30 border-b border-gray-200/60">
          <Hero />
        </section>

        {/* 2. Feature Grid - Distinct Soft Slate Canvas */}
        <section className="w-full bg-[#f8fafc] border-b border-gray-200/60 py-4">
          <FeatureGrid />
        </section>

        {/* 2.5 Complete Clinical Care Suite Canvas */}
        <section className="w-full bg-gradient-to-b from-white via-rose-50/20 to-gray-50/30 border-b border-gray-200/60 py-4">
          <LandingClinicalSuite />
        </section>

        {/* 3. How It Works - Clean White Canvas */}
        <section className="w-full bg-white border-b border-gray-200/60 py-4">
          <HowItWorks />
        </section>

        {/* 4. Specialist Roster - Soft Tinted Canvas */}
        <section className="w-full bg-gradient-to-b from-white via-red-50/20 to-gray-50/30 border-b border-gray-200/60 py-4">
          <SpecialistRoster />
        </section>

        {/* 4.5 Dedicated Mental Health Section (Dr. Maya - Doctor #11) */}
        <section className="w-full bg-rose-50/30 border-b border-gray-200/60 py-4">
          <LandingMentalHealthSection />
        </section>

        {/* 5. Clinical SOAP Section - Distinct Soft Slate Canvas */}
        <section className="w-full bg-[#f8fafc] border-b border-gray-200/60 py-4">
          <ClinicalSOAPSection />
        </section>

        {/* 6. Body Grid Section */}
        <section className="w-full bg-white py-4">
          <BodyGrid />
        </section>
      </main>
      <Footer />
    </div>
  );
}
