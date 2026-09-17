"use client";

import { useState, useEffect, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  Calendar,
  Clock,
  FileText,
  Search,
  Filter,
  Sparkles,
  Stethoscope,
  FlaskConical,
  AlertTriangle,
  HeartPulse,
  CheckCircle2,
  ArrowUpRight,
  Loader2,
  ChevronRight,
  ShieldAlert,
  CalendarDays,
  X,
  ExternalLink,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MedicalReportDialog, {
  MedicalReportData,
} from "../dashboard/medical-agent/_components/MedicalReportDialog";
import { TimelineEvent } from "@/app/api/health-timeline/route";
import AddNewSessionDialog from "../dashboard/_components/AddNewSessionDialog";

function getRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Recent";

  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffSecs < 60) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? "" : "s"} ago`;
  if (diffHours < 24) return `${diffHours} hr${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  if (diffWeeks < 5) return `${diffWeeks} wk${diffWeeks === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getStatusBadge(status: string) {
  switch (status) {
    case "abnormal_detected":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          Abnormal Flagged
        </span>
      );
    case "urgent":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300 animate-pulse">
          <ShieldAlert className="w-3 h-3 text-red-600" />
          Urgent Review
        </span>
      );
    case "completed":
    case "normal":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Verified Normal
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
          <Clock className="w-3 h-3" />
          Recorded
        </span>
      );
  }
}

function getEventIcon(eventType: string) {
  switch (eventType) {
    case "consultation":
      return <Stethoscope className="w-5 h-5 text-[#a4161a]" />;
    case "lab_report":
      return <FlaskConical className="w-5 h-5 text-amber-600" />;
    case "mental_health":
      return <HeartPulse className="w-5 h-5 text-indigo-600" />;
    case "emergency_alert":
      return <ShieldAlert className="w-5 h-5 text-red-600" />;
    default:
      return <Activity className="w-5 h-5 text-gray-600" />;
  }
}

function getEventIconBg(eventType: string) {
  switch (eventType) {
    case "consultation":
      return "bg-red-50 border-red-200 ring-4 ring-red-50/50";
    case "lab_report":
      return "bg-amber-50 border-amber-200 ring-4 ring-amber-50/50";
    case "mental_health":
      return "bg-indigo-50 border-indigo-200 ring-4 ring-indigo-50/50";
    case "emergency_alert":
      return "bg-red-100 border-red-300 ring-4 ring-red-100/50 animate-pulse";
    default:
      return "bg-gray-50 border-gray-200 ring-4 ring-gray-50/50";
  }
}

export default function TimelinePage() {
  const { user, isLoaded: isUserLoaded } = useUser();

  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalConsultations: 0,
    totalLabReports: 0,
    totalAbnormalities: 0,
    healthIndexScore: 95,
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals state
  const [selectedSoapReport, setSelectedSoapReport] = useState<MedicalReportData | null>(null);
  const [isSoapModalOpen, setIsSoapModalOpen] = useState(false);

  const [selectedLabPayload, setSelectedLabPayload] = useState<any | null>(null);
  const [isLabModalOpen, setIsLabModalOpen] = useState(false);

  useEffect(() => {
    if (isUserLoaded && user) {
      fetchTimeline();
    } else if (isUserLoaded && !user) {
      setLoading(false);
    }
  }, [isUserLoaded, user]);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/health-timeline");
      if (res.data) {
        setEvents(res.data.events || []);
        if (res.data.stats) {
          setStats(res.data.stats);
        }
      }
    } catch (err) {
      console.error("Error fetching health timeline:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      // Type filter
      if (filterType !== "all" && ev.eventType !== filterType) {
        return false;
      }
      // Search filter
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesTitle = ev.title.toLowerCase().includes(q);
        const matchesSummary = ev.summary.toLowerCase().includes(q);
        const matchesDoctor = (ev.doctorName || "").toLowerCase().includes(q);
        const matchesBadge = (ev.badgeText || "").toLowerCase().includes(q);
        return matchesTitle || matchesSummary || matchesDoctor || matchesBadge;
      }
      return true;
    });
  }, [events, filterType, searchQuery]);

  const openSoapModal = (report: MedicalReportData) => {
    setSelectedSoapReport(report);
    setIsSoapModalOpen(true);
  };

  const openLabModal = (payload: any) => {
    setSelectedLabPayload(payload);
    setIsLabModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] gap-4">
        <Loader2 className="w-10 h-10 text-[#a4161a] animate-spin" />
        <p className="text-sm font-semibold text-gray-600">
          Synthesizing your patient clinical timeline...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header Canvas */}
      <section className="bg-gradient-to-b from-rose-50/70 via-white to-gray-50/30 p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-[#a4161a] border border-red-200 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              Unified Clinical Record
            </span>
          </div>
          <h1 className="font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight">
            Patient <span className="italic font-serif font-normal text-[#a4161a]">Health Timeline</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-xl">
            Chronological interactive history of doctor consultations, SOAP clinical notes, lab report diagnostics, and biomarker extractions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/vault">
            <Button
              variant="outline"
              className="text-xs font-semibold h-10 px-4 border-gray-300 text-gray-700 hover:bg-gray-100 shadow-2xs"
            >
              <FlaskConical className="w-4 h-4 mr-1.5 text-amber-600" />
              Report Vault
            </Button>
          </Link>
          <AddNewSessionDialog
            btnText="+ New Consultation"
            className="!text-white font-bold bg-[#a4161a] hover:bg-[#8b1116] px-5 py-2.5 rounded-xl shadow-md transition-all text-xs"
          />
        </div>
      </section>

      {/* Aggregate Stats Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-[#a4161a]">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {stats.totalEvents}
            </p>
            <p className="text-xs text-gray-500 font-medium">Total Clinical Events</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-blue-700">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {stats.totalConsultations}
            </p>
            <p className="text-xs text-gray-500 font-medium">Doctor Consultations</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-amber-700">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {stats.totalLabReports}
            </p>
            <p className="text-xs text-gray-500 font-medium">Saved Lab Reports</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-2xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-extrabold text-emerald-700 tracking-tight">
                {stats.healthIndexScore}
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">
                /100
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">Clinical Health Index</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: "all", label: "All Events", icon: Layers },
            { id: "consultation", label: "Consultations", icon: Stethoscope },
            { id: "lab_report", label: "Lab Reports", icon: FlaskConical },
            { id: "mental_health", label: "Mental Health", icon: HeartPulse },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = filterType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                  isActive
                    ? "bg-[#a4161a] text-white shadow-xs"
                    : "bg-gray-100/80 text-gray-600 hover:bg-gray-200/70"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search symptoms, doctors, lab parameters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#a4161a] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Visual Vertical Timeline Stream */}
      {filteredEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-dashed border-gray-300 text-center space-y-3">
          <Image
            src="/medical-assistance.png"
            alt="No timeline events"
            width={140}
            height={140}
            style={{ width: "auto", height: "auto" }}
          />
          <h3 className="font-bold text-base text-gray-900">
            No Timeline Events Found
          </h3>
          <p className="text-xs text-gray-500 max-w-md">
            {searchQuery || filterType !== "all"
              ? "No events match your current filter criteria. Try clearing the search or changing filters."
              : "You haven't recorded any voice consultations or uploaded lab reports yet. Start by consulting with an AI specialist."}
          </p>

          <div className="pt-2 flex items-center gap-3">
            {(searchQuery || filterType !== "all") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setFilterType("all");
                }}
                className="text-xs font-semibold"
              >
                Clear Filters
              </Button>
            )}
            <AddNewSessionDialog
              btnText="+ Start Consult"
              className="!text-white font-medium text-xs"
            />
          </div>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-[#a4161a]/60 before:via-rose-300/40 before:to-gray-200">
          {filteredEvents.map((ev, idx) => {
            const isConsultation =
              ev.eventType === "consultation" || ev.eventType === "mental_health";
            const isLab = ev.eventType === "lab_report";

            return (
              <div key={ev.id} className="relative group">
                {/* Timeline Icon Node */}
                <div
                  className={`absolute -left-6 sm:-left-10 top-3 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center bg-white shadow-xs transition-transform group-hover:scale-110 z-10 ${getEventIconBg(
                    ev.eventType
                  )}`}
                >
                  {getEventIcon(ev.eventType)}
                </div>

                {/* Main Event Card */}
                <div className="ml-4 sm:ml-6 p-5 sm:p-6 rounded-2xl border border-gray-200/90 bg-white hover:border-[#a4161a]/30 hover:shadow-md transition-all">
                  {/* Card Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      {ev.doctorImage && (
                        <Image
                          src={ev.doctorImage}
                          alt={ev.doctorName || "Doctor"}
                          width={38}
                          height={38}
                          className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0"
                        />
                      )}
                      <div>
                        <h3 className="font-extrabold text-base text-gray-900 tracking-tight flex items-center gap-2">
                          {ev.title}
                          {ev.eventType === "mental_health" && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                              Mental Health
                            </span>
                          )}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          <span className="font-semibold text-gray-700">
                            {ev.doctorName}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1 text-gray-400">
                            <Clock className="w-3 h-3" />
                            {getRelativeTime(ev.date)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      {getStatusBadge(ev.status)}
                    </div>
                  </div>

                  {/* Summary / Notes Box */}
                  <div className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100 text-xs text-gray-700 space-y-1.5 my-3">
                    <p className="line-clamp-3 leading-relaxed font-sans">
                      {ev.summary}
                    </p>
                  </div>

                  {/* Lab Abnormalities / Parameter Highlights */}
                  {isLab && Array.isArray(ev.payload?.deficienciesOrAbnormalities) && ev.payload.deficienciesOrAbnormalities.length > 0 && (
                    <div className="mb-3 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-gray-500 mr-1">
                        Flagged Biomarkers:
                      </span>
                      {ev.payload.deficienciesOrAbnormalities.map((item: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200"
                        >
                          ⚠️ {item}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3 text-xs">
                    <div className="text-[11px] font-mono text-gray-400">
                      {ev.date ? new Date(ev.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
                    </div>

                    <div className="flex items-center gap-2">
                      {isConsultation && ev.payload?.report && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openSoapModal(ev.payload.report)}
                          className="h-8 text-xs font-semibold border-emerald-200 bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100"
                        >
                          <FileText className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                          View SOAP Report
                        </Button>
                      )}

                      {isConsultation && ev.payload?.sessionId && (
                        <Link href={`/dashboard/medical-agent/${ev.payload.sessionId}`}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs font-semibold text-[#a4161a] border-red-200 hover:bg-red-50"
                          >
                            Open Room
                            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                          </Button>
                        </Link>
                      )}

                      {isLab && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openLabModal(ev.payload)}
                          className="h-8 text-xs font-semibold border-amber-200 bg-amber-50/70 text-amber-900 hover:bg-amber-100"
                        >
                          <FlaskConical className="w-3.5 h-3.5 mr-1 text-amber-700" />
                          View Biomarkers & Report
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Global SOAP Report Modal */}
      <MedicalReportDialog
        open={isSoapModalOpen}
        onOpenChange={setIsSoapModalOpen}
        report={selectedSoapReport}
      />

      {/* Global Lab Parameters Modal */}
      {selectedLabPayload && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs ${
            isLabModalOpen ? "block" : "hidden"
          }`}
        >
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl border border-gray-200 space-y-5">
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  Lab Diagnostic Detail
                </span>
                <h2 className="text-xl font-extrabold text-gray-900 mt-1">
                  {selectedLabPayload.reportTitle || "Medical Lab Report"}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Test Date: {selectedLabPayload.testDate || "N/A"} · File: {selectedLabPayload.fileName || "Uploaded File"}
                </p>
              </div>
              <button
                onClick={() => setIsLabModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Patient Summary */}
            {selectedLabPayload.patientSummary && (
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/80">
                <h4 className="text-xs font-bold text-gray-800 mb-1">Clinical Summary</h4>
                <p className="text-xs text-gray-700 leading-relaxed">
                  {selectedLabPayload.patientSummary}
                </p>
              </div>
            )}

            {/* Extracted Biomarker Parameters Table */}
            {Array.isArray(selectedLabPayload.parameters) && selectedLabPayload.parameters.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4 text-amber-600" />
                  Extracted Biomarker Parameters ({selectedLabPayload.parameters.length})
                </h4>
                <div className="overflow-x-auto border border-gray-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50 text-gray-600 border-b border-gray-200 font-semibold">
                      <tr>
                        <th className="p-3">Biomarker</th>
                        <th className="p-3">Extracted Value</th>
                        <th className="p-3">Reference Range</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedLabPayload.parameters.map((param: any, idx: number) => {
                        const statusLower = (param.status || "").toLowerCase();
                        const isHighLow = statusLower.includes("high") || statusLower.includes("low") || statusLower.includes("abnormal");
                        return (
                          <tr key={idx} className={isHighLow ? "bg-amber-50/40" : ""}>
                            <td className="p-3 font-semibold text-gray-900">{param.name}</td>
                            <td className="p-3 font-mono font-bold text-gray-800">
                              {param.value} {param.unit || ""}
                            </td>
                            <td className="p-3 text-gray-500 font-mono">{param.referenceRange || "N/A"}</td>
                            <td className="p-3">
                              {isHighLow ? (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                                  {param.status}
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                                  {param.status || "Normal"}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Suggested Next Steps */}
            {Array.isArray(selectedLabPayload.suggestedNextSteps) && selectedLabPayload.suggestedNextSteps.length > 0 && (
              <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100 space-y-2">
                <h4 className="text-xs font-bold text-[#a4161a] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Suggested Next Steps & Follow-ups
                </h4>
                <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
                  {selectedLabPayload.suggestedNextSteps.map((step: string, idx: number) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLabModalOpen(false)}
                className="text-xs font-semibold"
              >
                Close View
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
