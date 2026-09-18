"use client";

import React, { useState } from "react";
import {
  Heart,
  User,
  Phone,
  Shield,
  Volume2,
  Sparkles,
  CheckCircle2,
  Loader2,
  Activity,
  ArrowRight,
} from "lucide-react";
import axios from "axios";

interface OnboardingModalProps {
  isOpen: boolean;
  userEmail: string;
  initialName?: string;
  onComplete: (updatedUserData: any) => void;
}

export default function OnboardingModal({
  isOpen,
  userEmail,
  initialName = "",
  onComplete,
}: OnboardingModalProps) {
  const [name, setName] = useState<string>(initialName);
  const [bloodGroup, setBloodGroup] = useState<string>("O+");
  const [emergencyContact, setEmergencyContact] = useState<string>("");
  const [allergies, setAllergies] = useState<string>("None");
  const [preferredVoice, setPreferredVoice] = useState<string>(
    "Elliot (Male - Warm)",
  );
  const [seedDemoData, setSeedDemoData] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Update user profile details
      const updateRes = await axios.put("/api/users", {
        name,
        bloodGroup,
        emergencyContact,
        allergies,
        preferredVoice,
      });

      // 2. Save to localStorage for instant profile sync
      try {
        localStorage.setItem("medivoice_profile_data", JSON.stringify(updateRes.data));
      } catch (e) {
        // ignore
      }

      // 3. If seed option checked, seed sample prescriptions
      if (seedDemoData) {
        try {
          await axios.get("/api/prescriptions?seed=true");
        } catch (err) {
          console.error("Auto-seed demo prescriptions warning:", err);
        }
      }

      onComplete(updateRes.data);
    } catch (err: any) {
      console.error("Failed to complete onboarding:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-2xl space-y-6 p-6 sm:p-8">
        {/* Header Decoration */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-red-50 text-[#a4161a] border border-red-100 flex items-center justify-center">
            <Heart className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-50 text-[#a4161a] border border-red-100 text-[11px] font-bold mb-1">
              <Sparkles className="w-3 h-3" /> Welcome to MediVoice AI
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Personalize Your Profile
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          Setup your emergency contact, blood profile, and AI voice preference
          to get started with your personal medical assistant.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#a4161a]" /> Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Santhosh Kumar"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 font-medium focus:outline-none focus:border-[#a4161a] focus:ring-1 focus:ring-[#a4161a] transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Blood Group */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#a4161a]" /> Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 font-medium focus:outline-none focus:border-[#a4161a] focus:ring-1 focus:ring-[#a4161a] transition cursor-pointer bg-white"
              >
                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                  (bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* Emergency Contact */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#a4161a]" /> Emergency
                Contact
              </label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 font-medium focus:outline-none focus:border-[#a4161a] focus:ring-1 focus:ring-[#a4161a] transition"
              />
            </div>
          </div>

          {/* Known Allergies */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#a4161a]" /> Known Allergies
              / Medical Notes
            </label>
            <input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g. Penicillin, Dust, None"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 font-medium focus:outline-none focus:border-[#a4161a] focus:ring-1 focus:ring-[#a4161a] transition"
            />
          </div>

          {/* Preferred Voice */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-[#a4161a]" /> AI Doctor Voice
              Persona
            </label>
            <select
              value={preferredVoice}
              onChange={(e) => setPreferredVoice(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 font-medium focus:outline-none focus:border-[#a4161a] focus:ring-1 focus:ring-[#a4161a] transition cursor-pointer bg-white"
            >
              <option value="Elliot (Male - Warm)">
                Elliot (Male - Warm & Reassuring)
              </option>
              <option value="Sophia (Female - Caring)">
                Sophia (Female - Empathetic & Soft)
              </option>
              <option value="Dr. Sid (Male - Professional)">
                Dr. Sid (Male - Clinical & Concise)
              </option>
            </select>
          </div>

          {/* Seed Demo Checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-200/80 cursor-pointer text-xs font-medium text-gray-700 hover:bg-gray-100/70 transition">
              <input
                type="checkbox"
                checked={seedDemoData}
                onChange={(e) => setSeedDemoData(e.target.checked)}
                className="w-4 h-4 rounded text-[#a4161a] focus:ring-[#a4161a] cursor-pointer"
              />
              <span>
                Seed sample medical data (Prescriptions & Health Timeline) for
                demonstration
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 rounded-2xl bg-[#a4161a] hover:bg-[#8b1116] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving Profile...
                </>
              ) : (
                <>
                  Complete Setup & Launch Portal{" "}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
