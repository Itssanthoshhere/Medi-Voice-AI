"use client";

import React, { useState, useEffect } from "react";
import AddPrescriptionModal from "@/components/AddPrescriptionModal";
import {
  Pill,
  Clock,
  User,
  Plus,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  Trash2,
  Loader2,
  Sun,
  Sunset,
  Moon,
  ShieldCheck,
  RefreshCw,
  Stethoscope,
} from "lucide-react";

interface Prescription {
  id: number;
  prescriptionId: string;
  primaryUserEmail: string;
  familyMemberId?: string;
  patientName: string;
  doctorId?: string;
  doctorName: string;
  specialization: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  timing: string;
  startDate: string;
  endDate?: string;
  totalDays: number;
  instructions?: string;
  refillsRemaining: number;
  status: "Active" | "Completed" | "Discontinued";
  lastTakenAt?: string;
  createdAt?: string;
}

interface FamilyMember {
  memberId: string;
  name: string;
  relationship: string;
}

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>("Active");
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string>("all");
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPrescriptions();
    fetchFamilyMembers();
  }, [statusFilter, selectedMemberFilter]);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      let url = `/api/prescriptions?status=${encodeURIComponent(statusFilter)}&familyMemberId=${encodeURIComponent(selectedMemberFilter)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPrescriptions(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch prescriptions:", err);
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

  const handleLogDoseTaken = async (rx: Prescription) => {
    setActionLoadingId(rx.prescriptionId);
    try {
      const todayISO = new Date().toISOString();
      const res = await fetch("/api/prescriptions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prescriptionId: rx.prescriptionId,
          lastTakenAt: todayISO,
        }),
      });

      if (res.ok) {
        fetchPrescriptions();
      }
    } catch (err) {
      console.error("Failed to log dose taken:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleUpdateStatus = async (prescriptionId: string, newStatus: string) => {
    setActionLoadingId(prescriptionId);
    try {
      const res = await fetch("/api/prescriptions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prescriptionId,
          status: newStatus,
        }),
      });

      if (res.ok) {
        fetchPrescriptions();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeletePrescription = async (prescriptionId: string) => {
    if (!confirm("Are you sure you want to delete this prescription?")) return;

    setActionLoadingId(prescriptionId);
    try {
      const res = await fetch(`/api/prescriptions?prescriptionId=${encodeURIComponent(prescriptionId)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchPrescriptions();
      }
    } catch (err) {
      console.error("Failed to delete prescription:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const isDoseTakenToday = (lastTakenAt?: string) => {
    if (!lastTakenAt) return false;
    const takenDate = new Date(lastTakenAt).toDateString();
    const todayDate = new Date().toDateString();
    return takenDate === todayDate;
  };

  const calculateDaysCompleted = (startDate: string, totalDays: number) => {
    const start = new Date(startDate).getTime();
    const now = new Date().getTime();
    const diffDays = Math.max(1, Math.floor((now - start) / (1000 * 60 * 60 * 24)) + 1);
    return Math.min(diffDays, totalDays);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-gray-50/90 via-white to-gray-50/40 border border-gray-200/60 p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#a4161a] border border-red-100 text-xs font-semibold mb-3">
              <Pill className="w-3.5 h-3.5" /> E-Prescriptions & Daily Medication Tracker
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Prescription <span className="italic font-serif font-normal text-[#a4161a]">Tracker</span>
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1 max-w-xl">
              Track active medications, daily dosage schedules, refills, and doctor guidelines for your entire family.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#a4161a] hover:bg-[#8b1116] text-white font-bold text-xs sm:text-sm transition shadow-md flex-shrink-0"
          >
            <Plus className="w-4 h-4" /> Add E-Prescription
          </button>
        </div>
      </div>

      {/* Filter Tabs & Family Switcher Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-gray-200/80 shadow-xs">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {[
            { id: "Active", label: "Active Medications" },
            { id: "Completed", label: "Completed Courses" },
            { id: "Discontinued", label: "Discontinued" },
            { id: "all", label: "All Prescriptions" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                statusFilter === tab.id
                  ? "bg-[#a4161a] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Family Member Filter */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs">
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

      {/* SECTION 1: Today's Pill Reminder Checklist */}
      {statusFilter === "Active" && (
        <div className="rounded-3xl bg-white border border-gray-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-red-50 text-[#a4161a] border border-red-100">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-gray-900 text-base">
                  Today's Dosage Checklist
                </h2>
                <p className="text-xs text-gray-500">
                  Click to log doses as you take your daily medication.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Morning Dose", time: "8:00 AM", icon: Sun, color: "text-amber-500 bg-amber-50" },
              { label: "Afternoon Dose", time: "2:00 PM", icon: Sunset, color: "text-orange-500 bg-orange-50" },
              { label: "Evening / Night", time: "9:00 PM", icon: Moon, color: "text-indigo-500 bg-indigo-50" },
            ].map((slot) => {
              const Icon = slot.icon;
              return (
                <div
                  key={slot.label}
                  className="rounded-2xl bg-gray-50/80 border border-gray-200/60 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-gray-200/60 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${slot.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-gray-900 text-xs">{slot.label}</span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-semibold">{slot.time}</span>
                  </div>

                  <div className="space-y-2">
                    {prescriptions.filter((p) => p.status === "Active").length > 0 ? (
                      prescriptions
                        .filter((p) => p.status === "Active")
                        .slice(0, 2)
                        .map((rx) => {
                          const taken = isDoseTakenToday(rx.lastTakenAt);
                          return (
                            <div
                              key={rx.prescriptionId}
                              className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-gray-200 text-xs shadow-2xs"
                            >
                              <div>
                                <span className="font-bold text-gray-900 block truncate">
                                  {rx.medicationName}
                                </span>
                                <span className="text-[10px] text-gray-500">
                                  {rx.dosage} • {rx.patientName}
                                </span>
                              </div>

                              <button
                                disabled={actionLoadingId === rx.prescriptionId}
                                onClick={() => handleLogDoseTaken(rx)}
                                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition ${
                                  taken
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-[#a4161a] hover:bg-[#8b1116] text-white shadow-2xs"
                                }`}
                              >
                                {actionLoadingId === rx.prescriptionId ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : taken ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3" /> Taken
                                  </>
                                ) : (
                                  "Mark Taken"
                                )}
                              </button>
                            </div>
                          );
                        })
                    ) : (
                      <p className="text-xs text-gray-400 py-2 text-center">No active doses for this slot.</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: Active Prescriptions Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-[#a4161a] gap-3">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-xs font-medium text-gray-500">Loading prescriptions...</span>
        </div>
      ) : prescriptions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {prescriptions.map((rx) => {
            const isActive = rx.status === "Active";
            const isCompleted = rx.status === "Completed";
            const isDiscontinued = rx.status === "Discontinued";
            const takenToday = isDoseTakenToday(rx.lastTakenAt);
            const daysDone = calculateDaysCompleted(rx.startDate, rx.totalDays);
            const progressPercent = Math.min(100, Math.round((daysDone / rx.totalDays) * 100));

            return (
              <div
                key={rx.prescriptionId}
                className="group relative rounded-3xl bg-white border border-gray-200/80 hover:border-[#a4161a]/40 p-6 transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  {/* Top Medication Info & Status */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#a4161a] border border-red-100 flex items-center justify-center font-bold flex-shrink-0">
                        <Pill className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-gray-900 text-base leading-snug">
                          {rx.medicationName}
                        </h3>
                        <span className="inline-block text-xs text-[#a4161a] font-bold">
                          {rx.dosage} • {rx.frequency}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : isCompleted
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}
                    >
                      {isActive && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {isCompleted && <ShieldCheck className="w-3.5 h-3.5" />}
                      {isDiscontinued && <XCircle className="w-3.5 h-3.5" />}
                      {rx.status}
                    </span>
                  </div>

                  {/* Course Progress Bar */}
                  {isActive && (
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 font-medium">Treatment Course:</span>
                        <span className="font-bold text-gray-900">
                          Day {daysDone} of {rx.totalDays} ({progressPercent}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#a4161a] h-full transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Details Card */}
                  <div className="space-y-2.5 bg-gray-50/80 rounded-2xl p-4 border border-gray-200/60 mb-4 text-xs">
                    <div className="flex items-center justify-between text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#a4161a]" />
                        <span>Patient Profile:</span>
                      </div>
                      <span className="font-bold text-gray-900">{rx.patientName}</span>
                    </div>

                    <div className="flex items-center justify-between text-gray-600">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-[#a4161a]" />
                        <span>Doctor:</span>
                      </div>
                      <span className="font-bold text-gray-900">
                        {rx.doctorName} ({rx.specialization})
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#a4161a]" />
                        <span>Timing & Refills:</span>
                      </div>
                      <span className="font-semibold text-gray-800">
                        {rx.timing} • {rx.refillsRemaining} Refills Left
                      </span>
                    </div>

                    {rx.instructions && (
                      <div className="pt-2 border-t border-gray-200/60 text-gray-600">
                        <span className="font-bold text-gray-800">Instructions: </span>
                        {rx.instructions}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100 flex-wrap">
                  {isActive ? (
                    <>
                      <button
                        disabled={actionLoadingId === rx.prescriptionId}
                        onClick={() => handleLogDoseTaken(rx)}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                          takenToday
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-[#a4161a] hover:bg-[#8b1116] text-white shadow-xs"
                        }`}
                      >
                        {actionLoadingId === rx.prescriptionId ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : takenToday ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" /> Taken Today
                          </>
                        ) : (
                          "Log Dose Taken"
                        )}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateStatus(rx.prescriptionId, "Discontinued")}
                          className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition"
                        >
                          Discontinue
                        </button>
                        <button
                          disabled={actionLoadingId === rx.prescriptionId}
                          onClick={() => handleDeletePrescription(rx.prescriptionId)}
                          className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(rx.prescriptionId, "Active")}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-[#a4161a]" /> Reactivate Prescription
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-3xl bg-white border border-gray-200/80 p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-full bg-red-50 text-[#a4161a] flex items-center justify-center mx-auto mb-4 border border-red-100">
            <Pill className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-extrabold text-gray-900 mb-1">
            No {statusFilter !== "all" ? statusFilter.toLowerCase() : ""} prescriptions found
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            You don't have any prescriptions logged under this filter. Add your active medications to get daily dose reminders.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#a4161a] hover:bg-[#8b1116] text-white font-bold text-sm transition shadow-md"
          >
            <Plus className="w-4 h-4" /> Add First E-Prescription
          </button>
        </div>
      )}

      {/* Add Prescription Modal */}
      <AddPrescriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchPrescriptions()}
      />
    </div>
  );
}
