"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AIDoctorAgents, DoctorAgent } from "@/shared/list";
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Video,
  Mic,
  Building2,
  CalendarPlus,
  Loader2,
} from "lucide-react";

interface FamilyMember {
  memberId: string;
  name: string;
  relationship: string;
  age?: number;
}

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDoctor?: DoctorAgent | null;
  onSuccess?: () => void;
}

export default function BookAppointmentModal({
  isOpen,
  onClose,
  preselectedDoctor,
  onSuccess,
}: BookAppointmentModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorAgent | null>(
    preselectedDoctor || AIDoctorAgents[0]
  );
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>("self");
  const [selectedMemberName, setSelectedMemberName] = useState<string>("Self");
  const [appointmentDate, setAppointmentDate] = useState<string>("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [consultationType, setConsultationType] = useState<string>(
    "Voice AI Consultation"
  );
  const [chiefComplaint, setChiefComplaint] = useState<string>("");

  const [availableSlots, setAvailableSlots] = useState<
    { time: string; available: boolean }[]
  >([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [createdAppointment, setCreatedAppointment] = useState<any>(null);

  // Initialize dates (Today + next 6 days)
  const getUpcomingDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const isoDate = `${yyyy}-${mm}-${dd}`;
      const label =
        i === 0
          ? "Today"
          : i === 1
          ? "Tomorrow"
          : d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      dates.push({ isoDate, label, dayName: d.toLocaleDateString("en-US", { weekday: "short" }) });
    }
    return dates;
  };

  const upcomingDates = getUpcomingDates();

  useEffect(() => {
    if (isOpen) {
      if (preselectedDoctor) {
        setSelectedDoctor(preselectedDoctor);
      }
      if (!appointmentDate && upcomingDates.length > 0) {
        setAppointmentDate(upcomingDates[0].isoDate);
      }
      fetchFamilyMembers();
    }
  }, [isOpen, preselectedDoctor]);

  useEffect(() => {
    if (selectedDoctor && appointmentDate) {
      fetchDoctorAvailability(
        selectedDoctor.specialist.toLowerCase().replace(/\s+/g, "-"),
        appointmentDate
      );
    }
  }, [selectedDoctor, appointmentDate]);

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

  const fetchDoctorAvailability = async (doctorId: string, dateStr: string) => {
    setLoadingSlots(true);
    try {
      const res = await fetch(
        `/api/doctor-availability?doctorId=${encodeURIComponent(doctorId)}&date=${encodeURIComponent(dateStr)}`
      );
      if (res.ok) {
        const data = await res.json();
        setAvailableSlots(data.slots || []);
        const firstAvailable = (data.slots || []).find((s: any) => s.available);
        if (firstAvailable) {
          setSelectedTimeSlot(firstAvailable.time);
        } else {
          setSelectedTimeSlot("");
        }
      }
    } catch (err) {
      console.error("Failed to fetch doctor availability:", err);
    } finally {
      setLoadingSlots(false);
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

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !appointmentDate || !selectedTimeSlot) {
      setBookingError("Please select a valid date and time slot.");
      return;
    }

    setBookingLoading(true);
    setBookingError(null);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          familyMemberId: selectedMemberId,
          patientName: selectedMemberName,
          doctorId: selectedDoctor.specialist.toLowerCase().replace(/\s+/g, "-"),
          doctorName: selectedDoctor.doctorName || selectedDoctor.name || "Dr. Specialist",
          specialization: selectedDoctor.specialist,
          appointmentDate,
          timeSlot: selectedTimeSlot,
          consultationType,
          chiefComplaint: chiefComplaint || "General medical consultation",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to book appointment");
      }

      setCreatedAppointment(data);
      setStep(5);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setBookingError(err.message || "Failed to book appointment. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  const generateGoogleCalendarUrl = (apt: any) => {
    if (!apt) return "#";
    const title = encodeURIComponent(`MediVoice AI: ${apt.consultationType} with ${apt.doctorName}`);
    const details = encodeURIComponent(
      `Patient: ${apt.patientName}\nDoctor: ${apt.doctorName} (${apt.specialization})\nChief Complaint: ${apt.chiefComplaint}\n\nLaunch Session: https://medi-voice-assistant.vercel.app/dashboard/medical-agent`
    );
    const location = encodeURIComponent("MediVoice AI Platform");
    const [year, month, day] = apt.appointmentDate.split("-");
    const dateFormatted = `${year}${month}${day}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dateFormatted}T090000Z/${dateFormatted}T093000Z`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-gray-200 p-6 sm:p-8 shadow-2xl text-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-red-50 text-[#a4161a] border border-red-100">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {step === 5 ? "Appointment Confirmed! 🎉" : "Schedule AI Consultation"}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Step {step} of 5 — {step === 1 && "Choose Specialist"}
                {step === 2 && "Select Patient"}
                {step === 3 && "Pick Date & Time"}
                {step === 4 && "Consultation Details"}
                {step === 5 && "Booking Summary"}
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

        {/* Progress bar */}
        {step < 5 && (
          <div className="w-full bg-gray-100 h-1.5 rounded-full mb-6 overflow-hidden">
            <div
              className="bg-[#a4161a] h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        )}

        {/* STEP 1: Select Specialist Doctor */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Select Specialist AI Doctor
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
              {AIDoctorAgents.map((doctor) => {
                const isSelected = selectedDoctor?.id === doctor.id;
                return (
                  <div
                    key={doctor.id}
                    onClick={() => setSelectedDoctor(doctor)}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all flex items-center gap-4 ${
                      isSelected
                        ? "bg-red-50/60 border-[#a4161a] shadow-sm"
                        : "bg-gray-50/50 border-gray-200 hover:bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                      <Image
                        src={doctor.image}
                        alt={doctor.doctorName || doctor.specialist}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900 text-sm truncate">
                          {doctor.doctorName || doctor.specialist}
                        </h4>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-[#a4161a] flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-[#a4161a] font-semibold">
                        {doctor.specialist}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">
                        {doctor.experience}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                onClick={() => setStep(2)}
                disabled={!selectedDoctor}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#a4161a] hover:bg-[#8b1116] text-white font-bold text-sm transition shadow-sm disabled:opacity-50"
              >
                Next: Select Patient <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Select Patient (Family Member) */}
        {step === 2 && (
          <div className="space-y-5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Who is this appointment for?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {familyMembers.length > 0 ? (
                familyMembers.map((member) => {
                  const isSelected = selectedMemberId === member.memberId;
                  return (
                    <div
                      key={member.memberId}
                      onClick={() => handleMemberChange(member.memberId)}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all flex items-center gap-3 ${
                        isSelected
                          ? "bg-red-50/60 border-[#a4161a] shadow-sm"
                          : "bg-gray-50/50 border-gray-200 hover:bg-white"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-red-100 text-[#a4161a] flex items-center justify-center font-bold text-sm">
                        {member.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {member.name}
                        </h4>
                        <span className="inline-block px-2.5 py-0.5 text-[10px] rounded-full bg-gray-100 text-gray-600 font-semibold border border-gray-200 mt-0.5">
                          {member.relationship} {member.age ? `• ${member.age} yrs` : ""}
                        </span>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-[#a4161a]" />
                      )}
                    </div>
                  );
                })
              ) : (
                <div
                  onClick={() => handleMemberChange("self")}
                  className="cursor-pointer rounded-2xl p-4 border border-[#a4161a] bg-red-50/60 flex items-center gap-3 col-span-2"
                >
                  <div className="w-10 h-10 rounded-full bg-red-100 text-[#a4161a] flex items-center justify-center font-bold">
                    P
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">Primary Account Holder</h4>
                    <span className="text-xs text-gray-500">Self</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-100">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 text-sm font-semibold transition"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#a4161a] hover:bg-[#8b1116] text-white font-bold text-sm transition shadow-sm"
              >
                Next: Select Date & Time <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Select Date & Time Slot */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                1. Select Consultation Date
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {upcomingDates.map((item) => {
                  const isSelected = appointmentDate === item.isoDate;
                  return (
                    <button
                      key={item.isoDate}
                      onClick={() => setAppointmentDate(item.isoDate)}
                      className={`flex-shrink-0 flex flex-col items-center px-4 py-2.5 rounded-2xl border text-xs transition-all min-w-[85px] ${
                        isSelected
                          ? "bg-[#a4161a] text-white font-bold border-[#a4161a] shadow-sm"
                          : "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <span className="uppercase text-[10px] opacity-80">{item.dayName}</span>
                      <span className="text-sm font-bold mt-0.5">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                2. Select Available Time Slot
              </h3>
              {loadingSlots ? (
                <div className="flex items-center justify-center py-8 text-[#a4161a] gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-xs text-gray-500">Checking doctor availability...</span>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {availableSlots.map((slotItem) => {
                    const isSelected = selectedTimeSlot === slotItem.time;
                    return (
                      <button
                        key={slotItem.time}
                        disabled={!slotItem.available}
                        onClick={() => setSelectedTimeSlot(slotItem.time)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                          !slotItem.available
                            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed line-through"
                            : isSelected
                            ? "bg-[#a4161a] text-white font-bold border-[#a4161a] shadow-sm"
                            : "bg-white border-gray-200 text-gray-700 hover:border-[#a4161a] hover:text-[#a4161a]"
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        {slotItem.time}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4 border-t border-gray-100">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 text-sm font-semibold transition"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                disabled={!selectedTimeSlot}
                onClick={() => setStep(4)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#a4161a] hover:bg-[#8b1116] text-white font-bold text-sm transition shadow-sm disabled:opacity-50"
              >
                Next: Chief Complaint <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Consultation Type & Chief Complaint */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                1. Select Consultation Mode
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    type: "Voice AI Consultation",
                    icon: Mic,
                    badge: "Recommended",
                    desc: "Real-time AI voice Agent session with automated SOAP report",
                  },
                  {
                    type: "Live Telehealth Video",
                    icon: Video,
                    badge: "Partner Clinic",
                    desc: "Video call with human physician partner",
                  },
                  {
                    type: "In-Person Clinic Visit",
                    icon: Building2,
                    badge: "Walk-in",
                    desc: "Schedule physical visit at affiliated hospital",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = consultationType === item.type;
                  return (
                    <div
                      key={item.type}
                      onClick={() => setConsultationType(item.type)}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                        isSelected
                          ? "bg-red-50/60 border-[#a4161a] shadow-sm"
                          : "bg-gray-50/50 border-gray-200 hover:bg-white"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Icon className={`w-5 h-5 ${isSelected ? "text-[#a4161a]" : "text-gray-400"}`} />
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-semibold border border-gray-200">
                            {item.badge}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 text-xs">{item.type}</h4>
                        <p className="text-[11px] text-gray-500 mt-1 leading-snug">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                2. Chief Complaint & Symptoms
              </h3>
              <textarea
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="Describe your main symptoms, duration, or reason for this appointment (e.g. High fever for 2 days, persistent dry cough...)"
                rows={3}
                className="w-full rounded-2xl bg-gray-50 border border-gray-200 p-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#a4161a] focus:bg-white transition resize-none"
              />
            </div>

            {bookingError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{bookingError}</span>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t border-gray-100">
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 text-sm font-semibold transition"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                disabled={bookingLoading}
                onClick={handleBookAppointment}
                className="flex items-center gap-2 px-7 py-3 rounded-xl bg-[#a4161a] hover:bg-[#8b1116] text-white font-bold text-sm transition shadow-md disabled:opacity-50"
              >
                {bookingLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Confirming...
                  </>
                ) : (
                  <>
                    Confirm & Schedule Appointment <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: Confirmation & Summary */}
        {step === 5 && createdAppointment && (
          <div className="space-y-6 text-center py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-gray-900">
                Appointment Scheduled Successfully!
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Reference ID: <span className="font-mono text-[#a4161a] font-bold">{createdAppointment.appointmentId}</span>
              </p>
            </div>

            {/* Summary Box */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-gray-200/80 pb-3">
                <span className="text-xs text-gray-500">Doctor</span>
                <span className="text-xs font-bold text-gray-900">
                  {createdAppointment.doctorName} ({createdAppointment.specialization})
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-200/80 pb-3">
                <span className="text-xs text-gray-500">Patient</span>
                <span className="text-xs font-bold text-gray-900">
                  {createdAppointment.patientName}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-200/80 pb-3">
                <span className="text-xs text-gray-500">Date & Time</span>
                <span className="text-xs font-bold text-[#a4161a]">
                  {createdAppointment.appointmentDate} at {createdAppointment.timeSlot}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Consultation Mode</span>
                <span className="text-xs font-semibold text-gray-800">
                  {createdAppointment.consultationType}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={generateGoogleCalendarUrl(createdAppointment)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-xs font-semibold transition"
              >
                <CalendarPlus className="w-4 h-4 text-[#a4161a]" /> Add to Google Calendar
              </a>
              <button
                onClick={() => {
                  onClose();
                  router.push("/dashboard/medical-agent");
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#a4161a] hover:bg-[#8b1116] text-white font-bold text-xs transition shadow-md"
              >
                <Sparkles className="w-4 h-4" /> Start Voice Consultation Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
