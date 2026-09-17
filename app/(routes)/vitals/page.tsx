"use client";

import React, { useState, useEffect } from "react";
import LogVitalsModal from "@/components/LogVitalsModal";
import {
  Activity,
  Heart,
  Gauge,
  Thermometer,
  Droplet,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Plus,
  Filter,
  Trash2,
  Loader2,
  Zap,
  User,
  Clock,
  ShieldAlert,
} from "lucide-react";

interface VitalRecord {
  id: number;
  vitalId: string;
  primaryUserEmail: string;
  familyMemberId?: string;
  patientName: string;
  heartRate?: number;
  bpSystolic?: number;
  bpDiastolic?: number;
  bloodOxygen?: number;
  temperature?: string;
  bloodGlucose?: number;
  status: "Normal" | "Elevated" | "Warning";
  notes?: string;
  recordedAt?: string;
  createdAt?: string;
}

interface FamilyMember {
  memberId: string;
  name: string;
  relationship: string;
}

export default function VitalsPage() {
  const [vitals, setVitals] = useState<VitalRecord[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string>("all");
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchVitals();
    fetchFamilyMembers();
  }, [selectedMemberFilter]);

  const fetchVitals = async () => {
    setLoading(true);
    try {
      let url = `/api/vitals?familyMemberId=${encodeURIComponent(selectedMemberFilter)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setVitals(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch vitals:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFamilyMembers = async () => {
    try {
      const res = await fetch("/api/family-members");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setFamilyMembers(data);
      }
    } catch (err) {
      console.error("Failed to fetch family members:", err);
    }
  };

  const handleDeleteVital = async (vitalId: string) => {
    if (!confirm("Are you sure you want to delete this vital record?")) return;

    setDeletingId(vitalId);
    try {
      const res = await fetch(`/api/vitals?vitalId=${encodeURIComponent(vitalId)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchVitals();
      }
    } catch (err) {
      console.error("Failed to delete vital:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const latestVital = vitals[0] || null;

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-gray-50/90 via-white to-gray-50/40 border border-gray-200/60 p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#a4161a] border border-red-100 text-xs font-semibold mb-3">
              <Activity className="w-3.5 h-3.5" /> Real-Time Health Monitoring & Vitals Tracker
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Health <span className="italic font-serif font-normal text-[#a4161a]">Vitals</span>
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1 max-w-xl">
              Track live heart rate, blood pressure, SpO₂ oxygen saturation, blood glucose, and temperature with automated clinical anomaly detection.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#a4161a] hover:bg-[#8b1116] text-white font-bold text-xs sm:text-sm transition shadow-md flex-shrink-0"
          >
            <Plus className="w-4 h-4" /> Log Vital Signs
          </button>
        </div>
      </div>

      {/* Family Member Filter Bar */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-xs">
        <div className="flex items-center gap-2 font-bold text-xs text-gray-900">
          <Activity className="w-4 h-4 text-[#a4161a]" />
          <span>Vitals Dashboard</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs">
          <Filter className="w-3.5 h-3.5 text-[#a4161a]" />
          <span className="text-gray-500 font-semibold">Patient:</span>
          <select
            value={selectedMemberFilter}
            onChange={(e) => setSelectedMemberFilter(e.target.value)}
            className="bg-transparent text-gray-900 font-bold focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-white text-gray-900">All Family Members</option>
            {familyMembers.map((m) => (
              <option key={m.memberId} value={m.memberId} className="bg-white text-gray-900">
                {m.name} ({m.relationship})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SECTION 1: Live Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Heart Rate */}
        <div className="rounded-3xl bg-white border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Heart Rate</span>
            <div className="p-2 rounded-xl bg-red-50 text-[#a4161a]">
              <Heart className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-gray-900">
              {latestVital?.heartRate ? `${latestVital.heartRate}` : "--"}{" "}
              <span className="text-xs font-semibold text-gray-400">BPM</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1 font-medium">Ref: 60 - 100 BPM</p>
          </div>
        </div>

        {/* Blood Pressure */}
        <div className="rounded-3xl bg-white border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Blood Pressure</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Gauge className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-gray-900">
              {latestVital?.bpSystolic && latestVital?.bpDiastolic
                ? `${latestVital.bpSystolic}/${latestVital.bpDiastolic}`
                : "--"}{" "}
              <span className="text-xs font-semibold text-gray-400">mmHg</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1 font-medium">Ref: &lt; 120/80 mmHg</p>
          </div>
        </div>

        {/* Blood Oxygen SpO2 */}
        <div className="rounded-3xl bg-white border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Blood Oxygen (SpO₂)</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-gray-900">
              {latestVital?.bloodOxygen ? `${latestVital.bloodOxygen}%` : "--"}
            </div>
            <p className="text-[11px] text-gray-400 mt-1 font-medium">Ref: 95% - 100%</p>
          </div>
        </div>

        {/* Blood Glucose */}
        <div className="rounded-3xl bg-white border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Blood Glucose</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Droplet className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-gray-900">
              {latestVital?.bloodGlucose ? `${latestVital.bloodGlucose}` : "--"}{" "}
              <span className="text-xs font-semibold text-gray-400">mg/dL</span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1 font-medium">Ref: 70 - 99 mg/dL</p>
          </div>
        </div>
      </div>

      {/* SECTION 2: Vitals History Log Table */}
      <div className="rounded-3xl bg-white border border-gray-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="font-extrabold text-gray-900 text-base">
            Recorded Vitals Log
          </h2>
          <span className="text-xs text-gray-500 font-medium">
            {vitals.length} total entries recorded
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-[#a4161a] gap-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-xs font-medium text-gray-500">Loading vital logs...</span>
          </div>
        ) : vitals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200/60 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3">Patient</th>
                  <th className="py-3 px-3">Heart Rate</th>
                  <th className="py-3 px-3">Blood Pressure</th>
                  <th className="py-3 px-3">SpO₂</th>
                  <th className="py-3 px-3">Glucose</th>
                  <th className="py-3 px-3">Temp</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-800">
                {vitals.map((v) => (
                  <tr key={v.vitalId} className="hover:bg-gray-50/60 transition">
                    <td className="py-3.5 px-3 font-semibold text-gray-900">
                      {v.recordedAt ? new Date(v.recordedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "--"}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-gray-900">{v.patientName}</td>
                    <td className="py-3.5 px-3">{v.heartRate ? `${v.heartRate} BPM` : "--"}</td>
                    <td className="py-3.5 px-3">{v.bpSystolic && v.bpDiastolic ? `${v.bpSystolic}/${v.bpDiastolic} mmHg` : "--"}</td>
                    <td className="py-3.5 px-3">{v.bloodOxygen ? `${v.bloodOxygen}%` : "--"}</td>
                    <td className="py-3.5 px-3">{v.bloodGlucose ? `${v.bloodGlucose} mg/dL` : "--"}</td>
                    <td className="py-3.5 px-3">{v.temperature ? `${v.temperature}°F` : "--"}</td>
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          v.status === "Normal"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : v.status === "Elevated"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {v.status === "Normal" && <CheckCircle2 className="w-3 h-3" />}
                        {v.status === "Elevated" && <AlertCircle className="w-3 h-3" />}
                        {v.status === "Warning" && <ShieldAlert className="w-3 h-3" />}
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        disabled={deletingId === v.vitalId}
                        onClick={() => handleDeleteVital(v.vitalId)}
                        className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        {deletingId === v.vitalId ? (
                          <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p className="text-xs mb-3">No health vitals logged yet.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 text-[#a4161a] border border-red-200 text-xs font-bold transition"
            >
              <Plus className="w-3.5 h-3.5" /> Log First Vital Reading
            </button>
          </div>
        )}
      </div>

      {/* Log Vitals Modal */}
      <LogVitalsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchVitals()}
      />
    </div>
  );
}
