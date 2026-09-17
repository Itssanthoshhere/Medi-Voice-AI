"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Activity, Heart, Gauge, Zap, ChevronRight, Plus, Loader2 } from "lucide-react";
import LogVitalsModal from "@/components/LogVitalsModal";

interface VitalRecord {
  id: number;
  vitalId: string;
  patientName: string;
  heartRate?: number;
  bpSystolic?: number;
  bpDiastolic?: number;
  bloodOxygen?: number;
  status: string;
  recordedAt?: string;
}

export default function VitalsMonitorWidget() {
  const [latestVital, setLatestVital] = useState<VitalRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchLatestVital();
  }, []);

  const fetchLatestVital = async () => {
    try {
      const res = await fetch("/api/vitals");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setLatestVital(data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch latest vital:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl bg-[#f8fafc] border border-gray-200/60 p-6 shadow-xs space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-red-50 text-[#a4161a] border border-red-100">
            <Activity className="w-4 h-4" />
          </div>
          <h3 className="font-extrabold text-gray-900 text-base">Live Vital Signs</h3>
        </div>

        <Link
          href="/vitals"
          className="text-xs font-bold text-[#a4161a] hover:text-[#8b1116] flex items-center gap-1 transition"
        >
          View All <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-6 text-[#a4161a] gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs text-gray-500">Loading vitals...</span>
        </div>
      ) : latestVital ? (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-xs">
            <div>
              <span className="text-[10px] font-bold text-gray-400 block uppercase">Heart Rate</span>
              <span className="text-sm font-extrabold text-gray-900">
                {latestVital.heartRate ? `${latestVital.heartRate} BPM` : "--"}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 block uppercase">Blood Pressure</span>
              <span className="text-sm font-extrabold text-gray-900">
                {latestVital.bpSystolic && latestVital.bpDiastolic
                  ? `${latestVital.bpSystolic}/${latestVital.bpDiastolic}`
                  : "--"}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 block uppercase">SpO₂</span>
              <span className="text-sm font-extrabold text-gray-900">
                {latestVital.bloodOxygen ? `${latestVital.bloodOxygen}%` : "--"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 px-1">
            <span>Patient: <strong className="text-gray-800">{latestVital.patientName}</strong></span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                latestVital.status === "Normal"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              {latestVital.status}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 bg-white rounded-2xl border border-gray-200/80 p-4">
          <p className="text-xs text-gray-500 mb-3 font-medium">No health vitals logged yet.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-[#a4161a] border border-red-200 text-xs font-bold transition"
          >
            <Plus className="w-3.5 h-3.5" /> Log Vitals
          </button>
        </div>
      )}

      <LogVitalsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchLatestVital()}
      />
    </div>
  );
}
