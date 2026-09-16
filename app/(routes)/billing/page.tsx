"use client";

import { useState, useContext } from "react";
import Link from "next/link";
import axios from "axios";
import { UserDetailContext } from "@/context/UserDetailContext";
import {
  Check,
  X,
  Sparkles,
  Zap,
  Building2,
  ArrowLeft,
  Crown,
  Shield,
  Clock,
  Stethoscope,
  ArrowRight,
  FileText,
  Headphones,
  Users,
  Infinity,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type BillingCycle = "monthly" | "yearly";

const plans = [
  {
    name: "Free",
    key: "free_user",
    icon: Sparkles,
    iconColor: "text-gray-500",
    iconBg: "bg-gray-100",
    description: "Get started with AI-powered medical consultations",
    monthlyPrice: 0,
    yearlyPrice: 0,
    badge: null,
    trialNotice: null,
    borderColor: "border-gray-200",
    ctaText: "Current Plan",
    ctaVariant: "outline" as const,
    ctaDisabled: true,
    features: [
      { text: "3 consultations / month", included: true },
      { text: "1 medical report / month", included: true },
      { text: "2 general AI doctors", included: true },
      { text: "5 min max per call", included: true },
      { text: "7-day history retention", included: true },
      { text: "Export reports (TXT / Print)", included: false },
      { text: "Priority AI models", included: false },
      { text: "Multi-patient profiles", included: false },
    ],
  },
  {
    name: "Pro",
    key: "pro_user",
    icon: Zap,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    description: "For individuals who need regular AI consultations",
    monthlyPrice: 9.99,
    yearlyPrice: 99.99,
    badge: "Most Popular",
    trialNotice: "7-Day Free Trial",
    borderColor: "border-primary/50",
    ctaText: "Upgrade to Pro",
    ctaVariant: "default" as const,
    ctaDisabled: false,
    features: [
      { text: "25 consultations / month", included: true },
      { text: "Unlimited medical reports", included: true },
      { text: "All specialist AI doctors", included: true },
      { text: "30 min max per call", included: true },
      { text: "6-month history retention", included: true },
      { text: "Export reports (TXT / Print)", included: true },
      { text: "Priority AI models", included: true },
      { text: "Multi-patient profiles", included: false },
    ],
  },
  {
    name: "Clinic",
    key: "clinic_user",
    icon: Building2,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    description: "For clinics and healthcare professionals",
    monthlyPrice: 29.99,
    yearlyPrice: 299.99,
    badge: "Best Value",
    trialNotice: "30-Day Risk-Free Trial",
    borderColor: "border-amber-300",
    ctaText: "Upgrade to Clinic",
    ctaVariant: "default" as const,
    ctaDisabled: false,
    features: [
      { text: "Unlimited consultations", included: true },
      { text: "Unlimited reports + PDF export", included: true },
      { text: "All specialists + custom prompts", included: true },
      { text: "Unlimited call duration", included: true },
      { text: "Permanent history retention", included: true },
      { text: "Export reports (PDF / TXT / Print)", included: true },
      { text: "Priority AI models", included: true },
      { text: "Up to 50 patient profiles", included: true },
    ],
  },
];

const guaranteeCards = [
  {
    icon: Stethoscope,
    title: "Included usage",
    description: "All plans include access to 10+ AI Doctor agents with bundled voice calls and instant medical summaries.",
  },
  {
    icon: Clock,
    title: "Cancel anytime",
    description: "Start monthly or yearly with total freedom. Cancel anytime directly from your dashboard billing settings.",
  },
  {
    icon: Sparkles,
    title: "7-day trial window",
    description: "Validate MediVoice AI with full specialist consultations before any commitment on our Pro plan.",
  },
  {
    icon: Shield,
    title: "30-day money-back",
    description: "Risk-free 30-day evaluation period for Clinic plans. 100% full refund if you are not fully satisfied.",
  },
];

const highlights = [
  {
    icon: Stethoscope,
    title: "AI-Powered Doctors",
    description: "Consult with specialized AI medical agents trained on clinical guidelines.",
  },
  {
    icon: FileText,
    title: "Clinical Reports",
    description: "Auto-generated structured reports with symptoms, diagnosis, and recommendations.",
  },
  {
    icon: Shield,
    title: "HIPAA-Ready",
    description: "Enterprise-grade security and privacy for all your medical data.",
  },
  {
    icon: Headphones,
    title: "Voice Consultations",
    description: "Natural voice conversations with AI doctors — just like a real visit.",
  },
];

const faqs = [
  {
    question: "Do you offer a free trial or money-back guarantee?",
    answer:
      "Yes! Our Pro plan features a 7-day free trial window, and our Clinic plan comes with a 30-day risk-free money-back guarantee.",
  },
  {
    question: "Can I change or cancel my plan anytime?",
    answer:
      "Yes! You can upgrade, downgrade, or cancel your plan at any time with one click. Changes take effect immediately.",
  },
  {
    question: "What happens when I exceed my consultation limit?",
    answer:
      "You'll receive a notification when you're close to your limit. You can upgrade your plan anytime to get instant extra consultations.",
  },
  {
    question: "Are the AI consultations a replacement for real doctors?",
    answer:
      "No. MediVoice AI provides AI-assisted preliminary assessments and health information. Always consult a licensed healthcare provider for medical emergencies.",
  },
  {
    question: "Is my medical data secure?",
    answer:
      "Absolutely. We use end-to-end encryption and follow HIPAA compliance standards. Your data is never shared with third parties.",
  },
];

function BillingPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { userDetails, refreshUser } = useContext(UserDetailContext);
  const currentPlan = (userDetails?.plan || "free").toLowerCase();

  const handleUpgrade = async (planKey: string) => {
    const targetPlan = planKey === "pro_user" ? "pro" : planKey === "clinic_user" ? "clinic" : "free";
    try {
      setUpgradingPlan(planKey);
      setSuccessMessage(null);

      await axios.put("/api/users", {
        plan: targetPlan,
      });

      if (refreshUser) {
        await refreshUser();
      }

      setSuccessMessage(`Successfully upgraded to the ${targetPlan.toUpperCase()} plan!`);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      console.error("Failed to upgrade plan:", err);
    } finally {
      setUpgradingPlan(null);
    }
  };

  const getPrice = (plan: (typeof plans)[0]) => {
    return billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = (plan: (typeof plans)[0]) => {
    if (plan.monthlyPrice === 0) return 0;
    const yearlyMonthly = plan.yearlyPrice / 12;
    return Math.round(((plan.monthlyPrice - yearlyMonthly) / plan.monthlyPrice) * 100);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
          <Crown className="w-3.5 h-3.5" />
          Subscription Plans
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Choose the Right Plan for You
        </h1>
        <p className="text-gray-500 text-base max-w-lg mx-auto leading-relaxed">
          Unlock the full power of AI-assisted medical consultations.
          Start free, upgrade when you&apos;re ready.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-all ${
              billingCycle === "monthly"
                ? "bg-primary text-white border-primary shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-4 py-2 text-sm font-semibold rounded-lg border transition-all relative ${
              billingCycle === "yearly"
                ? "bg-primary text-white border-primary shadow-sm"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Yearly
            <span className="absolute -top-2.5 -right-3 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full border border-emerald-200">
              Save 17%
            </span>
          </button>
        </div>
      </div>

      {/* Success alert banner */}
      {successMessage && (
        <div className="max-w-md mx-auto p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-sm font-semibold shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => {
          const price = getPrice(plan);
          const savings = getSavings(plan);
          const Icon = plan.icon;

          const isCurrentPlan =
            (plan.key === "free_user" && currentPlan === "free") ||
            (plan.key === "pro_user" && currentPlan === "pro") ||
            (plan.key === "clinic_user" && currentPlan === "clinic");

          const isUpgrading = upgradingPlan === plan.key;

          return (
            <div
              key={plan.key}
              className={`relative rounded-2xl border-2 ${
                isCurrentPlan ? "border-emerald-500 bg-emerald-50/20" : plan.borderColor
              } bg-white p-6 flex flex-col transition-all hover:shadow-lg ${
                plan.badge === "Most Popular" && !isCurrentPlan ? "shadow-md scale-[1.02]" : ""
              }`}
            >
              {/* Badge */}
              {isCurrentPlan ? (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1 rounded-full border shadow-sm bg-emerald-600 text-white border-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Active Plan
                </div>
              ) : plan.badge ? (
                <div
                  className={`absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1 rounded-full border shadow-sm ${
                    plan.badge === "Most Popular"
                      ? "bg-primary text-white border-primary"
                      : "bg-amber-50 text-amber-800 border-amber-300"
                  }`}
                >
                  {plan.badge}
                </div>
              ) : null}

              {/* Plan Header */}
              <div className="flex items-center gap-3 mb-4 mt-1">
                <div className={`p-2.5 rounded-xl ${plan.iconBg}`}>
                  <Icon className={`w-5 h-5 ${plan.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-gray-500">{plan.description}</p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-gray-900">
                    ${price === 0 ? "0" : price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">
                    /{billingCycle === "monthly" ? "mo" : "yr"}
                  </span>
                </div>
                {plan.trialNotice && (
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{plan.trialNotice}</span>
                  </div>
                )}
                {billingCycle === "yearly" && savings > 0 && (
                  <p className="text-xs text-emerald-600 font-semibold mt-1">
                    Save {savings}% vs monthly
                  </p>
                )}
                {price === 0 && (
                  <p className="text-xs text-gray-400 font-medium mt-1">
                    Free forever — no credit card needed
                  </p>
                )}
              </div>

              {/* CTA */}
              <Button
                variant={isCurrentPlan ? "outline" : plan.ctaVariant}
                disabled={isCurrentPlan || isUpgrading}
                onClick={() => handleUpgrade(plan.key)}
                className={`w-full mb-6 font-semibold flex items-center justify-center gap-2 ${
                  isCurrentPlan
                    ? "border-emerald-300 text-emerald-700 bg-emerald-50 cursor-default"
                    : plan.ctaVariant === "default"
                    ? "text-white shadow-sm"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {isUpgrading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Upgrading...
                  </>
                ) : isCurrentPlan ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Current Plan
                  </>
                ) : (
                  `Upgrade to ${plan.name}`
                )}
              </Button>

              {/* Features */}
              <div className="space-y-3 flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  What&apos;s included
                </p>
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    {feature.included ? (
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        feature.included
                          ? "text-gray-700 font-medium"
                          : "text-gray-400"
                      }`}
                    >
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 4 Bottom Guarantee Cards (Reference layout) */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {guaranteeCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-sm text-gray-900">{card.title}</h4>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{card.description}</p>
            </div>
          );
        })}
      </div>

      {/* Highlights */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-8">
          Why MediVoice AI?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/15 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-bold text-sm text-gray-900 mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <h4 className="font-bold text-sm text-gray-900 mb-1.5">
                {faq.question}
              </h4>
              <p className="text-sm text-gray-500 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-10 border border-primary/15">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Ready to Transform Your Healthcare?
        </h2>
        <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">
          Join thousands of users who trust MediVoice AI for quick,
          reliable, and accessible medical consultations.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/dashboard">
            <Button className="bg-[#a4161a] hover:bg-[#8b1116] !text-white font-bold px-6 h-11 rounded-xl shadow-md flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              <span>Start AI Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/history">
            <Button
              variant="outline"
              className="font-semibold px-6 h-11 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              <span>View Consultation History</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BillingPage;
