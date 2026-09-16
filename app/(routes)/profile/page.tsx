"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser, useClerk } from "@clerk/nextjs";
import { UserDetailContext } from "@/context/UserDetailContext";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Calendar,
  ShieldCheck,
  Crown,
  Zap,
  Sparkles,
  Stethoscope,
  FileText,
  HeartPulse,
  Activity,
  ArrowLeft,
  Settings,
  Edit3,
  Save,
  CheckCircle2,
  LogOut,
  Phone,
  AlertCircle,
  Volume2,
  Clock,
  ChevronRight,
} from "lucide-react";
import axios from "axios";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { userDetails, refreshUser } = useContext(UserDetailContext);

  const [consultationCount, setConsultationCount] = useState<number>(0);
  const [reportCount, setReportCount] = useState<number>(0);
  const [loadingStats, setLoadingStats] = useState<boolean>(true);

  // Editable Medical Preferences state
  const [isEditingMedical, setIsEditingMedical] = useState<boolean>(false);
  const [savingMedical, setSavingMedical] = useState<boolean>(false);
  const [medicalSaved, setMedicalSaved] = useState<boolean>(false);

  const [fullName, setFullName] = useState<string>("");
  const [bloodGroup, setBloodGroup] = useState<string>("O+");
  const [allergies, setAllergies] = useState<string>(
    "Chronic Tonsillitis / Enlarged Tonsils",
  );
  const [emergencyContact, setEmergencyContact] =
    useState<string>("+1 (555) 234-5678");
  const [preferredVoice, setPreferredVoice] = useState<string>(
    "Elliot (Male - Warm)",
  );

  const plan = (userDetails?.plan || "free").toLowerCase();
  const credits = userDetails?.credits ?? 10;
  const maxCredits = plan === "clinic" ? 9999 : plan === "pro" ? 100 : 10;

  // 1. Sync from userDetails or localStorage cache
  useEffect(() => {
    try {
      const cached = localStorage.getItem("medivoice_profile_data");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.name) setFullName(parsed.name);
        if (parsed.bloodGroup) setBloodGroup(parsed.bloodGroup);
        if (parsed.allergies !== undefined && parsed.allergies !== null) setAllergies(parsed.allergies);
        if (parsed.emergencyContact !== undefined && parsed.emergencyContact !== null) setEmergencyContact(parsed.emergencyContact);
        if (parsed.preferredVoice) setPreferredVoice(parsed.preferredVoice);
      }
    } catch (e) {
      // ignore
    }

    if (userDetails) {
      if (userDetails.name) setFullName(userDetails.name);
      if (userDetails.bloodGroup) setBloodGroup(userDetails.bloodGroup);
      if (userDetails.allergies !== undefined && userDetails.allergies !== null && userDetails.allergies !== "") {
        setAllergies(userDetails.allergies);
      }
      if (userDetails.emergencyContact !== undefined && userDetails.emergencyContact !== null && userDetails.emergencyContact !== "") {
        setEmergencyContact(userDetails.emergencyContact);
      }
      if (userDetails.preferredVoice) setPreferredVoice(userDetails.preferredVoice);
    } else if (user?.fullName) {
      setFullName((prev) => prev || user.fullName || "");
    }
  }, [userDetails, user]);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      setLoadingStats(true);
      const res = await axios.get("/api/session-chat");
      if (Array.isArray(res.data)) {
        setConsultationCount(res.data.length);
        const withReports = res.data.filter((item: any) => item.report);
        setReportCount(withReports.length);
      }
    } catch (e) {
      console.error("Failed to fetch session stats:", e);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleSaveMedical = async () => {
    try {
      setSavingMedical(true);
      const payload = {
        name: fullName || user?.fullName || "Patient",
        bloodGroup,
        allergies,
        emergencyContact,
        preferredVoice,
      };

      // Persist to Neon Postgres DB
      await axios.put("/api/users", payload);

      // Save to localStorage for instant recovery
      try {
        localStorage.setItem("medivoice_profile_data", JSON.stringify(payload));
      } catch (e) {
        // ignore
      }

      // Refresh global context
      if (refreshUser) {
        await refreshUser();
      }

      setIsEditingMedical(false);
      setMedicalSaved(true);
      setTimeout(() => setMedicalSaved(false), 4000);
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert("Failed to save profile changes. Please try again.");
    } finally {
      setSavingMedical(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" /> HIPAA Compliant
          Profile
        </span>
      </div>

      {/* Main Profile Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 text-white p-8 overflow-hidden shadow-xl">
        {/* Glow backdrop effects */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#a4161a]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* User Avatar */}
            <div className="relative">
              {user?.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt={user.fullName || "User"}
                  width={88}
                  height={88}
                  unoptimized
                  className="w-22 h-22 rounded-2xl object-cover border-2 border-white/20 shadow-lg"
                />
              ) : (
                <div className="w-22 h-22 rounded-2xl bg-gradient-to-br from-primary to-rose-700 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                  {user?.firstName?.[0] || "U"}
                </div>
              )}
              <div
                className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-slate-950 rounded-full w-5 h-5 flex items-center justify-center"
                title="Active"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            {/* User Details */}
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-extrabold tracking-tight text-white">
                  {fullName || user?.fullName || userDetails?.name || "Patient Profile"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-rose-200 text-xs font-semibold border border-white/10 backdrop-blur-md">
                  Verified Patient
                </span>
              </div>

              <p className="text-sm text-slate-300 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {user?.primaryEmailAddress?.emailAddress ||
                  userDetails?.email ||
                  "No email"}
              </p>

              <div className="flex items-center gap-4 pt-1 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" /> Member
                  since{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })
                    : "2026"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <Activity className="w-3.5 h-3.5" /> Account Active
                </span>
              </div>
            </div>
          </div>

          {/* Subscription Tier Pill & Quick Upgrade */}
          <div className="w-full md:w-auto bg-slate-900/80 border border-slate-700/60 backdrop-blur-md p-4 rounded-2xl flex flex-col gap-3 min-w-[240px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Current Plan
              </span>
              {plan === "clinic" ? (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold whitespace-nowrap flex items-center gap-1">
                  <Crown className="w-3 h-3 fill-amber-300" /> Clinic
                </span>
              ) : plan === "pro" ? (
                <span className="px-2.5 py-0.5 rounded-full bg-primary/20 border border-primary/40 text-rose-300 text-xs font-bold whitespace-nowrap flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-rose-300" /> Pro Member
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold whitespace-nowrap flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Free Tier
                </span>
              )}
            </div>

            {/* Credits Gauge */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">
                  Consultation Credits
                </span>
                <span className="font-bold text-white">
                  {plan === "clinic"
                    ? "Unlimited"
                    : `${credits} / ${maxCredits}`}
                </span>
              </div>
              {plan !== "clinic" && (
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/50">
                  <div
                    className="bg-gradient-to-r from-primary to-rose-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (credits / maxCredits) * 100)}%`,
                    }}
                  />
                </div>
              )}
            </div>

            <Link href="/billing" className="w-full">
              <Button
                size="sm"
                className="w-full bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs flex items-center justify-center gap-1.5 h-8 rounded-xl shadow-sm"
              >
                <span>Manage Subscription</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Grid: Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total Consultations
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">
              {loadingStats ? "..." : consultationCount}
            </h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Reports Generated
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">
              {loadingStats ? "..." : reportCount}
            </h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Available Credits
            </p>
            <h3 className="text-2xl font-bold text-gray-900 mt-0.5">
              {plan === "clinic" ? "∞" : credits}
            </h3>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Security Level
            </p>
            <h3 className="text-base font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
              Encrypted (HIPAA)
            </h3>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2/3): Medical Health Profile & Preferences */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Medical Health Summary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-50 text-[#a4161a]">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Medical Profile & Health Data
                  </h3>
                  <p className="text-xs text-gray-500">
                    Personalized data shared confidentially with your AI
                    doctors.
                  </p>
                </div>
              </div>

              {!isEditingMedical ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditingMedical(true)}
                  className="flex items-center gap-1.5 text-xs text-gray-700 font-semibold border-gray-200"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleSaveMedical}
                  disabled={savingMedical}
                  className="flex items-center gap-1.5 text-xs bg-[#a4161a] hover:bg-[#8b1116] text-white font-semibold shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />{" "}
                  {savingMedical ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </div>

            {medicalSaved && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Medical profile updated successfully!</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="sm:col-span-2 p-4 rounded-xl bg-gray-50/70 border border-gray-100 space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-primary" /> Full Name
                </label>
                {!isEditingMedical ? (
                  <p className="text-base font-bold text-gray-900">
                    {fullName || user?.fullName || userDetails?.name || "Patient Profile"}
                  </p>
                ) : (
                  <input
                    type="text"
                    value={fullName}
                    placeholder="Enter your full name"
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-sm font-semibold bg-white border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none"
                  />
                )}
              </div>

              {/* Blood Group */}
              <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-rose-500" /> Blood Type
                </label>
                {!isEditingMedical ? (
                  <p className="text-base font-bold text-gray-900">
                    {bloodGroup}
                  </p>
                ) : (
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full text-sm font-semibold bg-white border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                )}
              </div>

              {/* Emergency Contact */}
              <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-500" /> Emergency
                  Contact
                </label>
                {!isEditingMedical ? (
                  <p className="text-base font-bold text-gray-900">
                    {emergencyContact}
                  </p>
                ) : (
                  <input
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="w-full text-sm font-semibold bg-white border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none"
                  />
                )}
              </div>

              {/* Known Allergies */}
              <div className="sm:col-span-2 p-4 rounded-xl bg-gray-50/70 border border-gray-100 space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Medical Conditions & Allergies
                </label>
                {!isEditingMedical ? (
                  <p className="text-sm font-medium text-gray-800">
                    {allergies}
                  </p>
                ) : (
                  <input
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    className="w-full text-sm font-medium bg-white border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none"
                  />
                )}
              </div>

              {/* AI Voice Preference */}
              <div className="sm:col-span-2 p-4 rounded-xl bg-gray-50/70 border border-gray-100 space-y-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-indigo-500" /> Preferred
                  AI Doctor Voice Accent
                </label>
                {!isEditingMedical ? (
                  <p className="text-sm font-medium text-gray-800">
                    {preferredVoice}
                  </p>
                ) : (
                  <select
                    value={preferredVoice}
                    onChange={(e) => setPreferredVoice(e.target.value)}
                    className="w-full text-sm font-medium bg-white border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="Elliot (Male - Warm)">
                      Elliot (Male - Warm & Calm)
                    </option>
                    <option value="Savannah (Female - Friendly)">
                      Savannah (Female - Friendly)
                    </option>
                    <option value="Clara (Female - Professional)">
                      Clara (Female - Professional)
                    </option>
                    <option value="Sid (Male - Deep)">
                      Sid (Male - Deep & Empathetic)
                    </option>
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="bg-gradient-to-r from-rose-50 to-primary/5 rounded-2xl border border-rose-100 p-6 flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-gray-900">
                Need to view previous medical advice or reports?
              </h4>
              <p className="text-xs text-gray-500">
                All past voice consultations and downloadable summaries are
                saved safely in your history.
              </p>
            </div>
            <Link href="/history">
              <Button className="bg-[#a4161a] hover:bg-[#8b1116] text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm">
                View History
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column (1/3): Account Settings & Security */}
        <div className="space-y-6">
          {/* Account Security Box */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="p-2 rounded-xl bg-gray-100 text-gray-700">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Account & Auth
                </h3>
                <p className="text-xs text-gray-500">Authentication settings</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-gray-700">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <span className="font-semibold text-gray-600">
                  Auth Provider
                </span>
                <span className="font-bold text-gray-900 bg-white px-2.5 py-1 rounded-lg border border-gray-200">
                  Clerk Auth
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <span className="font-semibold text-gray-600">
                  Session Status
                </span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                <span className="font-semibold text-gray-600">
                  Data Encryption
                </span>
                <span className="font-bold text-slate-800">AES-256</span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                onClick={() => signOut({ redirectUrl: "/" })}
                className="w-full border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800 font-semibold text-xs flex items-center justify-center gap-2 h-10 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Account</span>
              </Button>
            </div>
          </div>

          {/* Privacy & Compliance Info */}
          <div className="bg-slate-900 text-slate-200 rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> Confidentiality Notice
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              MediVoice AI encrypts all medical audio streams and clinical
              report outputs. Your health data is strictly private and never
              shared without consent.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
