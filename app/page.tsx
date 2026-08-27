"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

/* ═══════════════════════════════════════════════════════════════
   ICONS — inline SVG, no extra dependency
   ═══════════════════════════════════════════════════════════════ */
const MicIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="8" y1="22" x2="16" y2="22" />
  </svg>
);
const ClockIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const UsersIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const FileTextIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
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
const ChevronDownIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
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
const MailIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const ChevronDownSmall = () => (
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
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
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

const NAV_LINKS = [
  { label: "Product", href: "/product", hasDropdown: true },
  { label: "Pricing", href: "/pricing" },
  { label: "Why", href: "/why" },
  { label: "Newsletter", href: "/newsletter", icon: MailIcon },
  { label: "Practice Types", href: "/for", hasDropdown: true },
  { label: "Blog", href: "/blog" },
];

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0"
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
              alt="MediVoice"
              width={180}
              height={180}
              className="rounded-xl"
            />
            {/* <span className="font-extrabold text-charcoal text-xl tracking-tight">
              MediVoice
            </span> */}
          </Link>

          {/* Desktop centre nav */}
          <nav
            className="hidden md:flex items-center gap-7 flex-1 justify-center"
            aria-label="Primary"
          >
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-1.5 text-[15px] font-bold text-charcoal hover:text-primary transition-colors whitespace-nowrap"
              >
                {l.icon && <l.icon />}
                {l.label}
                {l.hasDropdown && <ChevronDownSmall />}
              </Link>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-5 shrink-0">
            <Link
              href="/login"
              className="text-[15px] font-bold text-charcoal hover:text-primary transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              id="nav-get-started"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 text-[15px] font-semibold !text-white bg-primary hover:bg-primary-dark rounded-full transition-colors"
            >
              Get started
            </Link>
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
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-2 px-2 py-3 text-sm font-bold text-charcoal hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setOpen(false)}
              >
                {l.icon && <l.icon />}
                {l.label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
              <Link
                href="/login"
                className="px-2 py-2.5 text-sm font-bold text-charcoal"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2.5 text-sm font-bold !text-white bg-primary hover:bg-primary-dark rounded-full text-center transition-colors"
              >
                Get started
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════════════════════════
   2. HERO
   ═══════════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <section className="bg-surface py-20 sm:py-28 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Eyebrow */}
        <span
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200
          rounded-full text-[11px] font-bold text-primary tracking-[0.14em] uppercase mb-7"
        >
          <span
            className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"
            aria-hidden="true"
          />
          Voice AI Built for Medical Practices
        </span>

        {/* H1 */}
        <h1
          className="text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold text-charcoal
          tracking-tight leading-[1.04] mb-6 max-w-3xl mx-auto"
        >
          Never Miss a Patient Call.{" "}
          <span className="text-primary">Day or Night.</span>
        </h1>

        {/* Body copy */}
        <p className="text-lg text-gray-600 leading-relaxed mb-3 max-w-2xl mx-auto">
          MediVoice automates patient intake, appointment scheduling, and
          after-hours call handling with conversational AI. Your practice stays
          responsive 24/7 — without adding staff.
        </p>

        {/* Disclaimer */}
        <p className="text-sm text-muted mb-10 max-w-lg mx-auto">
          Intake and scheduling only. Not for medical advice or clinical
          diagnosis.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          <Link
            href="/signup"
            id="hero-cta-primary"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2
              px-6 py-3 text-base font-semibold !text-white bg-primary
              hover:bg-primary-dark rounded-lg transition-colors"
          >
            Start a measured pilot
          </Link>
          <Link
            href="/about"
            id="hero-cta-secondary"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2
              px-6 py-3 text-base font-semibold text-charcoal bg-white
              hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
          >
            About MediVoice <ArrowRightIcon />
          </Link>
        </div>

        {/* Fine print */}
        <p className="text-xs text-muted">
          For law firms,{" "}
          <Link
            href="https://legalvoice.app"
            className="underline underline-offset-2 hover:text-charcoal transition-colors"
          >
            LegalVoice
          </Link>{" "}
          provides Voice AI for automated client calls. MediVoice AI is intake
          and scheduling only — not medical advice.
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   3. STATS BAR
   ═══════════════════════════════════════════════════════════════ */
const STATS = [
  {
    value: "24/7",
    label: "Always-on patient intake — nights, weekends, and overflow",
  },
  {
    value: "1 captured call",
    label: "Can cover 5 years of platform cost at $100+ per visit",
  },
  {
    value: "$100+ / visit",
    label: "Revenue value of every missed or unanswered patient call",
  },
];

function StatBar() {
  return (
    <section
      className="bg-white border-b border-gray-200 py-12"
      aria-label="Key statistics"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="py-8 sm:py-0 sm:px-10 first:pl-0 last:pr-0 text-center sm:text-left"
            >
              <div className="text-3xl font-extrabold text-primary tracking-tight mb-2">
                {s.value}
              </div>
              <div className="text-sm text-muted leading-snug max-w-[220px] mx-auto sm:mx-0">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   4. FEATURE GRID
   ═══════════════════════════════════════════════════════════════ */
const FEATURES = [
  {
    Icon: ClockIcon,
    heading: "24/7 Coverage",
    body: "Answer every inbound call before it hits voicemail — nights, weekends, holidays, and peak overflow — so no patient is ever turned away.",
  },
  {
    Icon: UsersIcon,
    heading: "Human Handoff",
    body: "When a situation requires real judgment, MediVoice escalates to your staff instantly — with full call context already packaged and attached.",
  },
  {
    Icon: FileTextIcon,
    heading: "Reviewable Records",
    body: "Every call is logged, transcribed, and summarised in a structured format. Nothing falls through the cracks — and every interaction is auditable.",
  },
];

function FeatureGrid() {
  return (
    <section
      className="bg-surface py-20 border-b border-gray-200"
      aria-labelledby="features-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-primary mb-3">
            Core capabilities
          </p>
          <h2
            id="features-heading"
            className="text-3xl font-extrabold text-charcoal tracking-tight"
          >
            Built for every moment a patient reaches out
          </h2>
        </div>

        {/* 3-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <article
              key={f.heading}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-primary mb-5">
                <f.Icon />
              </div>
              <h3 className="text-base font-bold text-charcoal mb-2">
                {f.heading}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{f.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   5. TABBED SECTION
   ═══════════════════════════════════════════════════════════════ */
const TABS = [
  {
    id: "how",
    label: "How it works",
    heading: "From first ring to structured summary — automatically",
    points: [
      "Answer every inbound call instantly with a natural, conversational AI voice",
      "Collect the patient's chief complaint, insurance info, and visit reason",
      "Schedule the next available appointment or route to urgent care",
      "Send staff a structured summary — no follow-up calls required",
    ],
  },
  {
    id: "math",
    label: "The math",
    heading: "One captured call. Five years of ROI.",
    points: [
      "At $100+ per visit, every missed call is a measurable, direct revenue loss",
      "MediVoice's annual cost is recovered by a single captured appointment",
      "After-hours and overflow calls are the highest-risk unanswered moments",
      "Staff time saved on routine intake can be redirected to in-person care",
    ],
  },
  {
    id: "intake",
    label: "Patient intake",
    heading: "Structured intake — captured on the very first call",
    points: [
      "Chief complaint, symptoms, and urgency captured conversationally",
      "Insurance carrier, member ID, and coverage questions handled upfront",
      "EHR-compatible summaries ready for staff to review before the appointment",
      "No voicemail chains, callback delays, or missing information gaps",
    ],
  },
  {
    id: "scheduling",
    label: "Scheduling",
    heading: "Book, route, and confirm — without staff involvement",
    points: [
      "Book the next available slot in real time during the call",
      "Route time-sensitive cases to urgent care or on-call staff immediately",
      "Send an automated appointment confirmation message to the patient",
      "Flag and escalate situations that require immediate human judgment",
    ],
  },
];

function TabbedSection() {
  const [activeId, setActiveId] = useState(TABS[0].id);
  const tab = TABS.find((t) => t.id === activeId)!;

  return (
    <section
      className="bg-white py-20 border-b border-gray-200"
      aria-labelledby="tabs-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-primary mb-3">
            Platform detail
          </p>
          <h2
            id="tabs-heading"
            className="text-3xl font-extrabold text-charcoal tracking-tight"
          >
            Dig into what MediVoice actually does
          </h2>
        </div>

        {/* Tab buttons */}
        <div
          className="flex flex-wrap gap-2 mb-8"
          role="tablist"
          aria-label="Platform details"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={activeId === t.id}
              aria-controls={`tabpanel-${t.id}`}
              id={`tab-btn-${t.id}`}
              onClick={() => setActiveId(t.id)}
              className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-colors ${
                activeId === t.id
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-charcoal"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab panel */}
        <div
          role="tabpanel"
          id={`tabpanel-${tab.id}`}
          aria-labelledby={`tab-btn-${tab.id}`}
          className="bg-surface rounded-xl border border-gray-200 p-8"
        >
          <h3 className="text-xl font-bold text-charcoal mb-6">
            {tab.heading}
          </h3>
          <ul className="space-y-4" role="list">
            {tab.points.map((pt) => (
              <li key={pt} className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-red-50 flex items-center justify-center text-primary shrink-0">
                  <CheckIcon />
                </span>
                <span className="text-sm text-gray-700 leading-relaxed">
                  {pt}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   6. FAQ ACCORDION
   ═══════════════════════════════════════════════════════════════ */
const FAQS = [
  {
    q: "What is the best answering service for primary care practices?",
    a: "The best fit answers every call quickly, captures structured intake, books the next step, and routes urgent matters — instead of just taking a message. MediVoice AI is purpose-built for exactly this workflow.",
  },
  {
    q: "Can AI handle patient intake without giving medical advice?",
    a: "Yes. MediVoice AI handles intake, scheduling, follow-up, and routing while staying strictly focused on information gathering. It does not provide medical advice or clinical guidance of any kind.",
  },
  {
    q: "How do practices stop losing after-hours patients?",
    a: "With always-on coverage that answers immediately, captures structured intake, and moves the caller into a scheduling or escalation flow — regardless of time of day. MediVoice AI operates 24/7 for exactly this purpose.",
  },
  {
    q: "What's the difference between a medical answering service and patient intake software?",
    a: "A traditional answering service takes a message. Patient intake software captures structured visit details, schedules appointments, and automatically routes urgency-based calls — MediVoice AI does all three simultaneously.",
  },
  {
    q: "Is MediVoice suitable for high-volume or multi-location practices?",
    a: "Yes. MediVoice handles concurrent call volume without degradation — every caller receives an immediate response regardless of how many lines are active. Contact us for enterprise or multi-location pricing.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-charcoal group-hover:text-primary transition-colors">
          {q}
        </span>
        <span
          className={`shrink-0 text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <ChevronDownIcon />
        </span>
      </button>
      {open && (
        <div className="pb-5 pr-6">
          <p className="text-sm text-gray-600 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

function FAQAccordion() {
  return (
    <section
      className="bg-surface py-20 border-b border-gray-200"
      aria-labelledby="faq-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-primary mb-3">
              FAQ
            </p>
            <h2
              id="faq-heading"
              className="text-3xl font-extrabold text-charcoal tracking-tight"
            >
              Common questions
            </h2>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 px-6">
            {FAQS.map((faq) => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   7. SEO LINKS BLOCK
   ═══════════════════════════════════════════════════════════════ */
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

function SEOLinksBlock() {
  return (
    <section
      className="bg-white border-b border-gray-200 py-10"
      aria-label="Related searches"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.12em] mb-4">
          Related searches
        </p>
        <div className="flex flex-wrap gap-2">
          {SEO_TERMS.map((t) => (
            <span
              key={t}
              className="text-xs text-muted bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   8. RELATED LINKS ROW
   ═══════════════════════════════════════════════════════════════ */
const RELATED_LINKS = [
  { label: "AI medical receptionist", href: "/ai-receptionist" },
  { label: "AI answering service", href: "/answering-service" },
  { label: "Primary care page", href: "/for/primary-care" },
  { label: "Practice types", href: "/for" },
  { label: "LegalVoice — for law firms", href: "https://legalvoice.app" },
];

function RelatedLinks() {
  return (
    <section
      className="bg-white border-b border-gray-200 py-10"
      aria-label="Explore more"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.12em] mb-4">
          Explore more
        </p>
        <div className="flex flex-wrap gap-2">
          {RELATED_LINKS.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="text-sm font-semibold text-charcoal border border-gray-300 rounded-full
                px-4 py-2 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              {r.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   9. FINAL CTA BAND
   ═══════════════════════════════════════════════════════════════ */
function CTABand() {
  return (
    <section
      className="bg-primary py-20 text-center"
      aria-labelledby="final-cta-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2
          id="final-cta-heading"
          className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4 max-w-xl mx-auto"
        >
          Ready to stop losing patients to voicemail?
        </h2>
        <p className="text-red-100 mb-8 max-w-md mx-auto text-sm leading-relaxed">
          Start a measured pilot with no commitment required. One captured call
          can cover years of platform cost.
        </p>
        <Link
          href="/signup"
          id="final-cta"
          className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-bold
            text-primary bg-white hover:bg-gray-50 rounded-lg transition-colors"
        >
          Start a measured pilot <ArrowRightIcon />
        </Link>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   10. FOOTER
   ═══════════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div
        className="max-w-6xl mx-auto px-4 sm:px-6 py-8
        grid grid-cols-3 items-center gap-4"
      >
        {/* Left — copyright */}
        <p className="text-xs text-muted">
          &copy; {new Date().getFullYear()} DATAMAN ANALYTICS LLC d/b/a
          MediVoice AI.
        </p>

        {/* Center — logo */}
        <div className="flex justify-center">
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
              width={150}
              height={150}
              className="rounded-xl opacity-85 hover:opacity-100 transition-opacity"
            />
          </Link>
        </div>

        {/* Right — nav links */}
        <nav className="flex gap-6 justify-end" aria-label="Footer">
          {[
            { label: "About", href: "/about" },
            { label: "Privacy", href: "/privacy" },
            { label: "SMS Terms", href: "/sms-terms" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-xs text-muted hover:text-charcoal transition-colors"
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
    <>
      <Navbar />
      <main>
        <Hero />
        <StatBar />
        <FeatureGrid />
        <TabbedSection />
        <FAQAccordion />
        <SEOLinksBlock />
        <RelatedLinks />
        <CTABand />
      </main>
      <Footer />
    </>
  );
}
