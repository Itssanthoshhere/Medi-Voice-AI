"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  Heart,
  Gauge,
  Thermometer,
  Droplet,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Zap,
} from "lucide-react";

interface FamilyMember {
  memberId: string;
  name: string;
  relationship: string;
}

interface LogVitalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LogVitalsModal({
  isOpen,
  onClose,
  onSuccess,
}: LogVitalsModalProps) {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("self");
  const [selectedMemberName, setSelectedMemberName] = useState<string>("Self");

  const [heartRate, setHeartRate] = useState<string>("72");
  const [bpSystolic, setBpSystolic] = useState<string>("120");
  const [bpDiastolic, setBpDiastolic] = useState<string>("80");
  const [bloodOxygen, setBloodOxygen] = useState<string>("98");
  const [temperature, setTemperature] = useState<string>("98.6");
  const [bloodGlucose, setBloodGlucose] = useState<string>("95");
  const [notes, setNotes] = useState<string>("");

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

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/vitals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          familyMemberId: selectedMemberId,
          patientName: selectedMemberName,
          heartRate: heartRate ? Number(heartRate) : null,
          bpSystolic: bpSystolic ? Number(bpSystolic) : null,
          bpDiastolic: bpDiastolic ? Number(bpDiastolic) : null,
          bloodOxygen: bloodOxygen ? Number(bloodOxygen) : null,
          temperature: temperature ? temperature.trim() : "98.6",
          bloodGlucose: bloodGlucose ? Number(bloodGlucose) : null,
          notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to log vitals.");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save vital reading.");
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
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Log Health Vitals</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Record daily vital metrics for health monitoring and anomaly detection.
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

          {/* Core Metrics: Heart Rate & Blood Pressure */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#a4161a]" /> Heart Rate (BPM)
              </label>
              <input
                type="number"
                min={30}
                max={220}
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                placeholder="e.g. 72"
                className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-xs text-gray-900 focus:outline-none focus:border-[#a4161a] focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-[#a4161a]" /> Blood Pressure (Systolic / Diastolic)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={60}
                  max={240}
                  value={bpSystolic}
                  onChange={(e) => setBpSystolic(e.target.value)}
                  placeholder="Systolic (120)"
                  className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-xs text-gray-900 focus:outline-none focus:border-[#a4161a] focus:bg-white transition text-center font-bold"
                />
                <span className="text-gray-400 font-bold">/</span>
                <input
                  type="number"
                  min={40}
                  max={140}
                  value={bpDiastolic}
                  onChange={(e) => setBpDiastolic(e.target.value)}
                  placeholder="Diastolic (80)"
                  className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-xs text-gray-900 focus:outline-none focus:border-[#a4161a] focus:bg-white transition text-center font-bold"
                />
              </div>
            </div>
          </div>

          {/* SpO2, Temperature & Blood Glucose */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-blue-600" /> Blood Oxygen (SpO₂ %)
              </label>
              <input
                type="number"
                min={70}
                max={100}
                value={bloodOxygen}
                onChange={(e) => setBloodOxygen(e.target.value)}
                placeholder="e.g. 98"
                className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-xs text-gray-900 focus:outline-none focus:border-[#a4161a] focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-amber-600" /> Temperature (°F)
              </label>
              <input
                type="text"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="e.g. 98.6"
                className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-xs text-gray-900 focus:outline-none focus:border-[#a4161a] focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5 text-rose-600" /> Blood Glucose (mg/dL)
              </label>
              <input
                type="number"
                min={40}
                max={500}
                value={bloodGlucose}
                onChange={(e) => setBloodGlucose(e.target.value)}
                placeholder="e.g. 95"
                className="w-full rounded-xl bg-gray-50 border border-gray-200 p-3 text-xs text-gray-900 focus:outline-none focus:border-[#a4161a] focus:bg-white transition"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Vitals Context / Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Recorded post morning walk, feeling well..."
              rows={2}
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
                  Save Vital Reading <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
