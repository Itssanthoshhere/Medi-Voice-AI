"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import BookAppointmentModal from "@/components/BookAppointmentModal";
import RescheduleModal from "@/components/RescheduleModal";
import { AIDoctorAgents } from "@/shared/list";
import {
  Calendar,
  Clock,
  User,
  Plus,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  CalendarPlus,
  Trash2,
  RefreshCw,
  Loader2,
  Building2,
  Video,
  Mic,
  ArrowRight,
} from "lucide-react";

interface Appointment {
  id: number;
  appointmentId: string;
  primaryUserEmail: string;
  familyMemberId?: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  appointmentDate: string;
  timeSlot: string;
  consultationType: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  chiefComplaint?: string;
  createdAt?: string;
}

interface FamilyMember {
  memberId: string;
  name: string;
  relationship: string;
}

export default function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>("Scheduled");
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string>("all");
  
  const [isBookModalOpen, setIsBookModalOpen] = useState<boolean>(false);
  const [reschedulingAppointment, setReschedulingAppointment] = useState<Appointment | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
    fetchFamilyMembers();
  }, [statusFilter, selectedMemberFilter]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      let url = `/api/appointments?status=${encodeURIComponent(statusFilter)}&familyMemberId=${encodeURIComponent(selectedMemberFilter)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setAppointments(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
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

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm("Are you sure you want to cancel this scheduled appointment?")) {
      return;
    }

    setActionLoadingId(appointmentId);
    try {
      const res = await fetch(`/api/appointments?appointmentId=${encodeURIComponent(appointmentId)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchAppointments();
      }
    } catch (err) {
      console.error("Failed to cancel appointment:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const generateGoogleCalendarUrl = (apt: Appointment) => {
    const title = encodeURIComponent(`MediVoice AI: ${apt.consultationType} with ${apt.doctorName}`);
    const details = encodeURIComponent(
      `Patient: ${apt.patientName}\nDoctor: ${apt.doctorName} (${apt.specialization})\nChief Complaint: ${apt.chiefComplaint || "N/A"}\n\nLaunch Session: https://medi-voice-assistant.vercel.app/dashboard/medical-agent`
    );
    const location = encodeURIComponent("MediVoice AI Platform");
    const [year, month, day] = apt.appointmentDate.split("-");
    const dateFormatted = `${year}${month}${day}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dateFormatted}T090000Z/${dateFormatted}T093000Z`;
  };

  const [startingSessionId, setStartingSessionId] = useState<string | null>(null);

  const getDoctorAvatar = (specialization: string) => {
    const matched = AIDoctorAgents.find(
      (d) => d.specialist.toLowerCase() === specialization.toLowerCase()
    );
    return matched?.image || "/doctor1.jpg";
  };

  const handleStartSession = async (apt: Appointment) => {
    const doctor =
      AIDoctorAgents.find(
        (d) => d.specialist.toLowerCase() === apt.specialization.toLowerCase()
      ) || AIDoctorAgents[0];

    setStartingSessionId(apt.appointmentId);
    try {
      const res = await fetch("/api/session-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notes: apt.chiefComplaint || `Appointment consultation with ${apt.doctorName}`,
          selectedDoctor: doctor,
          familyMemberId: apt.familyMemberId || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data?.sessionId) {
        router.push("/dashboard/medical-agent/" + data.sessionId);
      } else if (data?.error === "SUBSCRIPTION_REQUIRED" || data?.error === "INSUFFICIENT_CREDITS") {
        alert(data.message || "Plan upgrade or consultation credits required.");
        router.push("/billing");
      } else {
        alert(data.error || "Could not start session. Please try again.");
      }
    } catch (err) {
      console.error("Error starting appointment session:", err);
      alert("Failed to start session. Please try again.");
    } finally {
      setStartingSessionId(null);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-gray-50/90 via-white to-gray-50/40 border border-gray-200/60 p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-[#a4161a] border border-red-100 text-xs font-semibold mb-3">
              <Calendar className="w-3.5 h-3.5" /> Doctor Availability & Appointment Scheduler
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Appointments <span className="italic font-serif font-normal text-[#a4161a]">Hub</span>
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm mt-1 max-w-xl">
              Schedule, reschedule, track, and manage consultations with 11 specialist AI doctors or partner clinic providers for you and your family members.
            </p>
          </div>

          <button
            onClick={() => setIsBookModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#a4161a] hover:bg-[#8b1116] text-white font-bold text-xs sm:text-sm transition shadow-md flex-shrink-0"
          >
            <Plus className="w-4 h-4" /> Book New Appointment
          </button>
        </div>
      </div>

      {/* Filter Tabs & Family Switcher Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-gray-200/80 shadow-xs">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {[
            { id: "Scheduled", label: "Upcoming" },
            { id: "Completed", label: "Completed" },
            { id: "Cancelled", label: "Cancelled" },
            { id: "all", label: "All Appointments" },
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

      {/* Appointments List Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-[#a4161a] gap-3">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-xs font-medium text-gray-500">Loading scheduled appointments...</span>
        </div>
      ) : appointments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {appointments.map((apt) => {
            const avatar = getDoctorAvatar(apt.specialization);
            const isScheduled = apt.status === "Scheduled";
            const isCompleted = apt.status === "Completed";
            const isCancelled = apt.status === "Cancelled";

            return (
              <div
                key={apt.appointmentId}
                className="group relative rounded-3xl bg-white border border-gray-200/80 hover:border-[#a4161a]/40 p-6 transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  {/* Top Doctor Info & Status */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                        <Image
                          src={avatar}
                          alt={apt.doctorName}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base leading-snug">
                          {apt.doctorName}
                        </h3>
                        <span className="inline-block text-xs text-[#a4161a] font-bold">
                          {apt.specialization}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                        isScheduled
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : isCompleted
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}
                    >
                      {isScheduled && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {isCompleted && <Sparkles className="w-3.5 h-3.5" />}
                      {isCancelled && <XCircle className="w-3.5 h-3.5" />}
                      {apt.status}
                    </span>
                  </div>

                  {/* Details Card */}
                  <div className="space-y-2.5 bg-gray-50/80 rounded-2xl p-4 border border-gray-200/60 mb-4 text-xs">
                    <div className="flex items-center justify-between text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#a4161a]" />
                        <span>Date & Time:</span>
                      </div>
                      <span className="font-bold text-gray-900">
                        {apt.appointmentDate} • {apt.timeSlot}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#a4161a]" />
                        <span>Patient Profile:</span>
                      </div>
                      <span className="font-bold text-gray-900">
                        {apt.patientName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-gray-600">
                      <div className="flex items-center gap-2">
                        {apt.consultationType.includes("Voice") ? (
                          <Mic className="w-4 h-4 text-[#a4161a]" />
                        ) : apt.consultationType.includes("Video") ? (
                          <Video className="w-4 h-4 text-[#a4161a]" />
                        ) : (
                          <Building2 className="w-4 h-4 text-[#a4161a]" />
                        )}
                        <span>Mode:</span>
                      </div>
                      <span className="font-semibold text-gray-800">
                        {apt.consultationType}
                      </span>
                    </div>

                    {apt.chiefComplaint && (
                      <div className="pt-2 border-t border-gray-200/60 text-gray-600">
                        <span className="font-bold text-gray-800">Chief Complaint: </span>
                        {apt.chiefComplaint}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100 flex-wrap">
                  {isScheduled ? (
                    <>
                      <div className="flex items-center gap-2">
                        <a
                          href={generateGoogleCalendarUrl(apt)}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition"
                          title="Add to Google Calendar"
                        >
                          <CalendarPlus className="w-3.5 h-3.5 text-[#a4161a]" /> Calendar
                        </a>

                        <button
                          onClick={() => setReschedulingAppointment(apt)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold transition"
                          title="Reschedule Date & Time"
                        >
                          <RefreshCw className="w-3.5 h-3.5 text-amber-700" /> Reschedule
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          disabled={startingSessionId === apt.appointmentId}
                          onClick={() => handleStartSession(apt)}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#a4161a] hover:bg-[#8b1116] text-white font-bold text-xs transition shadow-xs disabled:opacity-50"
                        >
                          {startingSessionId === apt.appointmentId ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Starting...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" /> Start Session
                            </>
                          )}
                        </button>

                        <button
                          disabled={actionLoadingId === apt.appointmentId}
                          onClick={() => handleCancelAppointment(apt.appointmentId)}
                          className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Cancel Appointment"
                        >
                          {actionLoadingId === apt.appointmentId ? (
                            <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsBookModalOpen(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-[#a4161a]" /> Book Follow-up Consultation
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
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-extrabold text-gray-900 mb-1">
            No {statusFilter !== "all" ? statusFilter.toLowerCase() : ""} appointments found
          </h3>
          <p className="text-xs text-gray-500 mb-6">
            You don't have any appointments scheduled under this filter. Book a consultation with one of our 11 specialist AI doctors.
          </p>
          <button
            onClick={() => setIsBookModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#a4161a] hover:bg-[#8b1116] text-white font-bold text-sm transition shadow-md"
          >
            <Plus className="w-4 h-4" /> Book First Appointment
          </button>
        </div>
      )}

      {/* Appointment Booking Wizard Modal */}
      <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onSuccess={() => fetchAppointments()}
      />

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={!!reschedulingAppointment}
        onClose={() => setReschedulingAppointment(null)}
        appointment={reschedulingAppointment}
        onSuccess={() => fetchAppointments()}
      />
    </div>
  );
}
