"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Pill, Clock, CheckCircle2, ChevronRight, Plus, Loader2 } from "lucide-react";
import AddPrescriptionModal from "@/components/AddPrescriptionModal";

interface Prescription {
  id: number;
  prescriptionId: string;
  patientName: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  status: string;
  lastTakenAt?: string;
}

export default function MedicationTrackerWidget() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchActivePrescriptions();
  }, []);

  const fetchActivePrescriptions = async () => {
    try {
      const res = await fetch("/api/prescriptions?status=Active");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setPrescriptions(data.slice(0, 3));
        }
      }
    } catch (err) {
      console.error("Failed to fetch active prescriptions:", err);
    } finally {
      setLoading(false);
    }
  };

  const isDoseTakenToday = (lastTakenAt?: string) => {
    if (!lastTakenAt) return false;
    return new Date(lastTakenAt).toDateString() === new Date().toDateString();
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
        fetchActivePrescriptions();
      }
    } catch (err) {
      console.error("Failed to log dose taken:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="rounded-3xl bg-[#f8fafc] border border-gray-200/60 p-6 shadow-xs space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-red-50 text-[#a4161a] border border-red-100">
            <Pill className="w-4 h-4" />
          </div>
          <h3 className="font-extrabold text-gray-900 text-base">Today's Medication Schedule</h3>
        </div>

        <Link
          href="/prescriptions"
          className="text-xs font-bold text-[#a4161a] hover:text-[#8b1116] flex items-center gap-1 transition"
        >
          View All <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-6 text-[#a4161a] gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs text-gray-500">Loading daily doses...</span>
        </div>
      ) : prescriptions.length > 0 ? (
        <div className="space-y-3">
          {prescriptions.map((rx) => {
            const taken = isDoseTakenToday(rx.lastTakenAt);
            return (
              <div
                key={rx.prescriptionId}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-gray-200/80 hover:border-[#a4161a]/30 transition shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#a4161a] border border-red-100 flex items-center justify-center font-bold flex-shrink-0 text-xs">
                    💊
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 text-xs truncate">
                      {rx.medicationName}
                    </h4>
                    <p className="text-[11px] text-[#a4161a] font-bold truncate">
                      {rx.dosage} • {rx.frequency}
                    </p>
                    <p className="text-[10px] text-gray-500 font-medium">For: {rx.patientName}</p>
                  </div>
                </div>

                <button
                  disabled={actionLoadingId === rx.prescriptionId}
                  onClick={() => handleLogDoseTaken(rx)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition flex-shrink-0 ${
                    taken
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-[#a4161a] hover:bg-[#8b1116] text-white shadow-xs"
                  }`}
                >
                  {actionLoadingId === rx.prescriptionId ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : taken ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 inline mr-1" /> Taken Today
                    </>
                  ) : (
                    "Mark Taken"
                  )}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 bg-white rounded-2xl border border-gray-200/80 p-4">
          <p className="text-xs text-gray-500 mb-3 font-medium">No active medications logged.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-[#a4161a] border border-red-200 text-xs font-bold transition"
          >
            <Plus className="w-3.5 h-3.5" /> Add Prescription
          </button>
        </div>
      )}

      <AddPrescriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchActivePrescriptions()}
      />
    </div>
  );
}
