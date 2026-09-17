"use client";

import React, { useState, useEffect } from "react";
import { AIDoctorAgents, DoctorAgent } from "@/shared/list";
import {
  Pill,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  X,
  Plus,
  Loader2,
  Stethoscope,
  Calendar,
} from "lucide-react";

interface FamilyMember {
  memberId: string;
  name: string;
  relationship: string;
}

interface AddPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddPrescriptionModal({
  isOpen,
  onClose,
  onSuccess,
}: AddPrescriptionModalProps) {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("self");
  const [selectedMemberName, setSelectedMemberName] = useState<string>("Self");
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorAgent>(AIDoctorAgents[0]);

  const [medicationName, setMedicationName] = useState<string>("");
  const [dosage, setDosage] = useState<string>("1 Tablet (500mg)");
  const [frequency, setFrequency] = useState<string>("Twice Daily");
  const [timing, setTiming] = useState<string>("After Meals");
  const [totalDays, setTotalDays] = useState<number>(7);
  const [instructions, setInstructions] = useState<string>("Take with warm water after meals.");
  const [refillsRemaining, setRefillsRemaining] = useState<number>(1);

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchFamilyMembers();
      setErrorMsg(null);
    }
  }, [isOpen]);

  const fetchFamilyMembers = async () => {
    try {
      const res = await fetch("/api/family-members");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setFamilyMembers(data);
          const self = data.find((m: FamilyMember) => m.relationship === "Self");
          if (self) {
            setSelectedMemberId(self.memberId);
            setSelectedMemberName(self.name);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch family members:", err);
    }
  };

  const handleMemberChange = (memberId: string) => {
    setSelectedMemberId(memberId);
    const m = familyMembers.find((item) => item.memberId === memberId);
    if (m) {
      setSelectedMemberName(m.name);
    } else {
      setSelectedMemberName("Self");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicationName.trim() || !dosage.trim()) {
      setErrorMsg("Medication name and dosage are required.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const startDate = new Date().toISOString().split("T")[0];
    const end = new Date();
    end.setDate(end.getDate() + Number(totalDays));
    const endDate = end.toISOString().split("T")[0];

    try {
      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          familyMemberId: selectedMemberId,
          patientName: selectedMemberName,
          doctorId: selectedDoctor.specialist.toLowerCase().replace(/\s+/g, "-"),
          doctorName: selectedDoctor.doctorName || selectedDoctor.name || "Dr. Elliot",
          specialization: selectedDoctor.specialist,
          medicationName: medicationName.trim(),
          dosage: dosage.trim(),
          frequency,
          timing,
          startDate,
          endDate,
          totalDays: Number(totalDays),
          instructions,
          refillsRemaining: Number(refillsRemaining),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add prescription.");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save prescription.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-gray-200 p-6 sm:p-8 shadow-2xl text-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-50 text-[#a4161a] border border-red-100">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Add New E-Prescription</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Log a new prescription, dosage schedule, and refill reminders.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Patient Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Patient Profile
              </label>
              <select
                value={selectedMemberId}
                onChange={(e) => handleMemberChange(e.target.value)}
                className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#a4161a] focus:bg-white transition"
              >
                {familyMembers.map((m) => (
                  <option key={m.memberId} value={m.memberId}>
                    {m.name} ({m.relationship})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Prescribing Doctor
              </label>
              <select
                value={selectedDoctor.id}
                onChange={(e) => {
                  const doc = AIDoctorAgents.find((d) => String(d.id) === e.target.value);
                  if (doc) setSelectedDoctor(doc);
                }}
                className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#a4161a] focus:bg-white transition"
              >
                {AIDoctorAgents.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.doctorName || doc.specialist} ({doc.specialist})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Medication Name & Dosage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Medication Name & Strength *
              </label>
              <input
                type="text"
                required
                value={medicationName}
                onChange={(e) => setMedicationName(e.target.value)}
                placeholder="e.g. Amoxicillin 500mg"
                className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#a4161a] focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Single Dose Strength *
              </label>
              <input
                type="text"
                required
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g. 1 Tablet, 5 ml"
                className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#a4161a] focus:bg-white transition"
              />
            </div>
          </div>

          {/* Frequency & Timing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Daily Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#a4161a] focus:bg-white transition"
              >
                <option value="Once Daily">Once Daily (Morning)</option>
                <option value="Twice Daily">Twice Daily (Morning & Night)</option>
                <option value="Thrice Daily">Thrice Daily (Morning, Noon, Night)</option>
                <option value="As Needed">As Needed (PRN)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Meal Timing
              </label>
              <select
                value={timing}
                onChange={(e) => setTiming(e.target.value)}
                className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#a4161a] focus:bg-white transition"
              >
                <option value="After Meals">After Meals</option>
                <option value="Before Meals">Before Meals</option>
                <option value="With Water">With Water</option>
                <option value="Empty Stomach">Empty Stomach</option>
              </select>
            </div>
          </div>

          {/* Duration & Refills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Total Course Duration (Days)
              </label>
              <input
                type="number"
                min={1}
                max={365}
                value={totalDays}
                onChange={(e) => setTotalDays(Number(e.target.value))}
                className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-xs text-gray-900 focus:outline-none focus:border-[#a4161a] focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Refills Remaining
              </label>
              <input
                type="number"
                min={0}
                max={20}
                value={refillsRemaining}
                onChange={(e) => setRefillsRemaining(Number(e.target.value))}
                className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-xs text-gray-900 focus:outline-none focus:border-[#a4161a] focus:bg-white transition"
              />
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Doctor Instructions & Precautions
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Finish the full 7-day antibiotic course even if feeling better..."
              rows={3}
              className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#a4161a] focus:bg-white transition resize-none"
            />
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#a4161a] hover:bg-[#8b1116] text-white font-bold text-xs transition shadow-md disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  Save Prescription <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
