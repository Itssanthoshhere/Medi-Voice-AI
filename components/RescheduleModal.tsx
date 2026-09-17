"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AIDoctorAgents } from "@/shared/list";
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronRight,
  Loader2,
  RefreshCw,
} from "lucide-react";

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
  chiefComplaint?: string;
}

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onSuccess: () => void;
}

export default function RescheduleModal({
  isOpen,
  onClose,
  appointment,
  onSuccess,
}: RescheduleModalProps) {
  const [newDate, setNewDate] = useState<string>("");
  const [newTimeSlot, setNewTimeSlot] = useState<string>("");
  const [chiefComplaint, setChiefComplaint] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<
    { time: string; available: boolean }[]
  >([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [rescheduleLoading, setRescheduleLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
    if (isOpen && appointment) {
      setNewDate(appointment.appointmentDate || upcomingDates[0]?.isoDate || "");
      setNewTimeSlot(appointment.timeSlot || "");
      setChiefComplaint(appointment.chiefComplaint || "");
      setErrorMsg(null);
    }
  }, [isOpen, appointment]);

  useEffect(() => {
    if (appointment && newDate) {
      fetchAvailability(appointment.doctorId, newDate);
    }
  }, [appointment, newDate]);

  const fetchAvailability = async (doctorId: string, dateStr: string) => {
    setLoadingSlots(true);
    try {
      const res = await fetch(
        `/api/doctor-availability?doctorId=${encodeURIComponent(doctorId)}&date=${encodeURIComponent(dateStr)}`
      );
      if (res.ok) {
        const data = await res.json();
        const slots = data.slots || [];
        setAvailableSlots(slots);
        // If current slot isn't available on the new date, pick first available slot
        const isCurrentAvailable = slots.find(
          (s: any) => s.time === appointment?.timeSlot && (s.available || appointment?.appointmentDate === dateStr)
        );
        if (!isCurrentAvailable) {
          const firstAvail = slots.find((s: any) => s.available);
          if (firstAvail) setNewTimeSlot(firstAvail.time);
        }
      }
    } catch (err) {
      console.error("Failed to fetch availability:", err);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleReschedule = async () => {
    if (!appointment || !newDate || !newTimeSlot) {
      setErrorMsg("Please choose a valid date and time slot.");
      return;
    }

    setRescheduleLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId: appointment.appointmentId,
          appointmentDate: newDate,
          timeSlot: newTimeSlot,
          chiefComplaint,
          status: "Scheduled",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to reschedule appointment.");
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to reschedule. Please try again.");
    } finally {
      setRescheduleLoading(false);
    }
  };

  if (!isOpen || !appointment) return null;

  const doctorAvatar =
    AIDoctorAgents.find(
      (d) => d.specialist.toLowerCase() === appointment.specialization.toLowerCase()
    )?.image || "/doctor1.jpg";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-gray-200 p-6 sm:p-8 shadow-2xl text-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Reschedule Appointment</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Ref ID: <span className="font-mono text-[#a4161a] font-bold">{appointment.appointmentId}</span>
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

        {/* Current Appointment Brief */}
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200 mb-6">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-200 border border-gray-300 flex-shrink-0">
            <Image
              src={doctorAvatar}
              alt={appointment.doctorName}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 text-sm">{appointment.doctorName}</h4>
            <p className="text-xs text-[#a4161a] font-bold">{appointment.specialization}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Patient: <span className="font-semibold text-gray-800">{appointment.patientName}</span>
            </p>
          </div>
          <div className="text-right text-xs bg-white px-3 py-1.5 rounded-xl border border-gray-200">
            <span className="text-gray-400 block text-[10px]">Current Slot</span>
            <span className="font-bold text-gray-800">{appointment.appointmentDate}</span>
            <span className="block text-[#a4161a] font-semibold">{appointment.timeSlot}</span>
          </div>
        </div>

        {/* Step 1: Pick New Date */}
        <div className="space-y-5">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
              1. Select New Date
            </h3>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {upcomingDates.map((item) => {
                const isSelected = newDate === item.isoDate;
                return (
                  <button
                    key={item.isoDate}
                    onClick={() => setNewDate(item.isoDate)}
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

          {/* Step 2: Pick New Time Slot */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
              2. Select New Time Slot
            </h3>
            {loadingSlots ? (
              <div className="flex items-center justify-center py-6 text-[#a4161a] gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-xs text-gray-500">Checking availability...</span>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-[200px] overflow-y-auto pr-1">
                {availableSlots.map((slotItem) => {
                  const isSameSlotAsOriginal =
                    appointment.appointmentDate === newDate && appointment.timeSlot === slotItem.time;
                  const isAvailable = slotItem.available || isSameSlotAsOriginal;
                  const isSelected = newTimeSlot === slotItem.time;

                  return (
                    <button
                      key={slotItem.time}
                      disabled={!isAvailable}
                      onClick={() => setNewTimeSlot(slotItem.time)}
                      className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        !isAvailable
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

          {/* Optional: Chief Complaint */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              3. Chief Complaint / Notes (Optional)
            </h3>
            <textarea
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              placeholder="Update any symptoms or notes for this rescheduled visit..."
              rows={2}
              className="w-full rounded-2xl bg-gray-50 border border-gray-200 p-3 text-xs text-gray-900 focus:outline-none focus:border-[#a4161a] focus:bg-white transition resize-none"
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              disabled={rescheduleLoading || !newTimeSlot}
              onClick={handleReschedule}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#a4161a] hover:bg-[#8b1116] text-white font-bold text-xs transition shadow-md disabled:opacity-50"
            >
              {rescheduleLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                </>
              ) : (
                <>
                  Confirm Reschedule <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
