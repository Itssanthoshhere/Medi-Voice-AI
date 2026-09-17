"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AIDoctorAgents } from "@/shared/list";
import { Calendar, Clock, Sparkles, ChevronRight, Plus, Loader2 } from "lucide-react";
import BookAppointmentModal from "@/components/BookAppointmentModal";

interface Appointment {
  id: number;
  appointmentId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  appointmentDate: string;
  timeSlot: string;
  consultationType: string;
  status: string;
}

export default function UpcomingAppointmentsWidget() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchUpcoming();
  }, []);

  const fetchUpcoming = async () => {
    try {
      const res = await fetch("/api/appointments?status=Scheduled");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setAppointments(data.slice(0, 3)); // show top 3 upcoming
        }
      }
    } catch (err) {
      console.error("Failed to fetch upcoming appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const getDoctorAvatar = (specialization: string) => {
    const matched = AIDoctorAgents.find(
      (d) => d.specialist.toLowerCase() === specialization.toLowerCase()
    );
    return matched?.image || "/doctor1.jpg";
  };

  return (
    <div className="rounded-3xl bg-[#f8fafc] border border-gray-200/60 p-6 shadow-xs space-y-4 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-red-50 text-[#a4161a] border border-red-100">
            <Calendar className="w-4 h-4" />
          </div>
          <h3 className="font-extrabold text-gray-900 text-base">Upcoming Appointments</h3>
        </div>

        <Link
          href="/appointments"
          className="text-xs font-bold text-[#a4161a] hover:text-[#8b1116] flex items-center gap-1 transition"
        >
          View All <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-6 text-[#a4161a] gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-xs text-gray-500">Loading appointments...</span>
        </div>
      ) : appointments.length > 0 ? (
        <div className="space-y-3">
          {appointments.map((apt) => {
            const avatar = getDoctorAvatar(apt.specialization);
            return (
              <div
                key={apt.appointmentId}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-gray-200/80 hover:border-[#a4161a]/30 transition shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                    <Image
                      src={avatar}
                      alt={apt.doctorName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 text-xs truncate">
                      {apt.doctorName}
                    </h4>
                    <p className="text-[11px] text-[#a4161a] font-bold truncate">
                      {apt.specialization} • {apt.patientName}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-0.5 font-medium">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span>{apt.appointmentDate} at {apt.timeSlot}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/dashboard/medical-agent")}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#a4161a] hover:bg-[#8b1116] text-white font-bold text-[11px] transition shadow-xs flex-shrink-0"
                >
                  <Sparkles className="w-3 h-3" /> Start Session
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-6 bg-white rounded-2xl border border-gray-200/80 p-4">
          <p className="text-xs text-gray-500 mb-3 font-medium">No upcoming appointments scheduled.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-[#a4161a] border border-red-200 text-xs font-bold transition"
          >
            <Plus className="w-3.5 h-3.5" /> Schedule Consultation
          </button>
        </div>
      )}

      <BookAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchUpcoming()}
      />
    </div>
  );
}
