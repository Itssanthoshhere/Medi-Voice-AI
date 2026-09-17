"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  FileText,
  ArrowUpRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Loader2,
  Sparkles,
  Search,
  Filter,
  History,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MedicalReportDialog, {
  MedicalReportData,
} from "../dashboard/medical-agent/_components/MedicalReportDialog";

type ConsultationHistoryItem = {
  id: number;
  sessionId: string;
  notes?: string;
  selectedDoctor?: {
    id?: number;
    specialist?: string;
    image?: string;
  };
  conversation?: any[];
  report?: MedicalReportData;
  createdOn?: string;
};

type FilterType = "all" | "with-report" | "in-progress";

function getRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSecs < 60) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? "" : "s"} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  if (diffWeeks < 5)
    return `${diffWeeks} week${diffWeeks === 1 ? "" : "s"} ago`;
  return `${diffMonths} month${diffMonths === 1 ? "" : "s"} ago`;
}

function HistoryPage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [historyList, setHistoryList] = useState<ConsultationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedReport, setSelectedReport] = useState<MedicalReportData | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    if (isUserLoaded && user) {
      fetchHistory();
    } else if (isUserLoaded && !user) {
      setLoading(false);
    }
  }, [isUserLoaded, user]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/session-chat");
      if (Array.isArray(res.data)) {
        setHistoryList(res.data);
      }
    } catch (err) {
      console.error("Error fetching consultation history:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredList = useMemo(() => {
    let list = historyList;

    // Apply status filter
    if (filter === "with-report") {
      list = list.filter((item) => !!item.report);
    } else if (filter === "in-progress") {
      list = list.filter((item) => !item.report);
    }

    // Apply search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((item) => {
        const specialist =
          item.selectedDoctor?.specialist?.toLowerCase() || "";
        const notes = item.notes?.toLowerCase() || "";
        const complaint =
          item.report?.chiefComplaint?.toLowerCase() || "";
        const user =
          item.report?.user?.toLowerCase() || "";
        return (
          specialist.includes(q) ||
          notes.includes(q) ||
          complaint.includes(q) ||
          user.includes(q) ||
          item.sessionId.toLowerCase().includes(q)
        );
      });
    }

    return list;
  }, [historyList, filter, searchQuery]);

  const handleOpenReport = (report: MedicalReportData) => {
    setSelectedReport(report);
    setIsReportOpen(true);
  };

  const reportCount = historyList.filter((i) => !!i.report).length;
  const inProgressCount = historyList.length - reportCount;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm text-gray-500 font-medium">
          Loading consultation history...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Back link */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* Section 1: Header & Stats Canvas (Soft Ambient Light Shading) */}
      <section className="bg-gradient-to-b from-gray-50/90 via-white to-gray-50/40 p-6 sm:p-8 rounded-3xl border border-gray-200/60 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
            <History className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-2xl text-gray-900">
              Consultation History
            </h1>
            <p className="text-sm text-gray-500">
              Browse and manage all your past medical consultations.
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-xs">
            <CalendarDays className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-800">
              {historyList.length}
            </span>
            <span className="text-xs text-gray-500">Total</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-800">
              {reportCount}
            </span>
            <span className="text-xs text-emerald-600">With Reports</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl shadow-xs">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-semibold text-slate-700">
              {inProgressCount}
            </span>
            <span className="text-xs text-slate-500">In Progress</span>
          </div>
        </div>
      </section>

      {/* Section 2: Search, Filters & History Cards Canvas (Soft Slate Shading) */}
      <section className="bg-[#f8fafc] p-6 sm:p-8 rounded-3xl border border-gray-200/60 shadow-xs space-y-6">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by doctor, notes, complaint, or session ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400 hidden sm:block" />
            {(["all", "with-report", "in-progress"] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
                  filter === f
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                }`}
              >
                {f === "all"
                  ? "All"
                  : f === "with-report"
                    ? "With Report"
                    : "In Progress"}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
      {filteredList.length === 0 ? (
        <div className="flex items-center flex-col justify-center p-10 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 text-center">
          <Image
            src="/medical-assistance.png"
            alt="No consultations"
            width={140}
            height={140}
            style={{ width: "auto", height: "auto" }}
          />
          <h2 className="font-bold text-lg mt-4 text-gray-900">
            {searchQuery || filter !== "all"
              ? "No matching consultations"
              : "No Consultations Yet"}
          </h2>
          <p className="text-gray-500 text-sm mt-1 max-w-sm">
            {searchQuery || filter !== "all"
              ? "Try adjusting your search or filter criteria."
              : "Start a new consultation from the dashboard to see your history here."}
          </p>
          {!searchQuery && filter === "all" && (
            <Link href="/dashboard">
              <Button className="mt-4 text-white font-medium">
                Go to Dashboard
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredList.map((item) => {
            const docInfo = item.selectedDoctor || {};
            const specialist = docInfo.specialist || "AI Medical Specialist";
            const docImage = docInfo.image || "/doctor1.jpg";
            const hasReport = !!item.report;

            return (
              <div
                key={item.sessionId || item.id}
                className="p-4 rounded-2xl border border-gray-200/90 bg-white hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top card metadata */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={docImage}
                        alt={specialist}
                        width={44}
                        height={44}
                        className="w-11 h-11 rounded-full object-cover border border-primary/20 shadow-2xs"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                          {specialist}
                          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="font-medium text-gray-500">
                            {item.createdOn
                              ? getRelativeTime(item.createdOn)
                              : "Recent"}
                          </span>
                          {item.createdOn && (
                            <>
                              <span className="text-gray-300">·</span>
                              <span>
                                {new Date(item.createdOn).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status badge */}
                    {hasReport ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Report Ready
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-50 text-slate-600 border border-slate-200">
                        <Clock className="w-3 h-3" />
                        In Progress
                      </span>
                    )}
                  </div>

                  {/* Notes snippet or Chief complaint */}
                  <div className="mb-4">
                    {item.report?.chiefComplaint ? (
                      <p className="text-xs text-gray-700 line-clamp-2 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        &ldquo;{item.report.chiefComplaint}&rdquo;
                      </p>
                    ) : item.notes ? (
                      <p className="text-xs text-gray-600 line-clamp-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <strong className="text-gray-800">Notes:</strong>{" "}
                        {item.notes}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        No initial notes provided.
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  {hasReport ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenReport(item.report!)}
                      className="text-xs h-8 border-emerald-200 bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100 flex items-center gap-1.5 font-semibold"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-700" />
                      View Report
                    </Button>
                  ) : (
                    <span className="text-[11px] text-gray-400 font-mono">
                      ID: {item.sessionId?.slice(0, 8)}...
                    </span>
                  )}

                  <Link
                    href={`/dashboard/medical-agent/${item.sessionId}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors ml-auto group-hover:translate-x-0.5 duration-150"
                  >
                    Open Room
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </section>

      {/* Report Modal */}
      <MedicalReportDialog
        open={isReportOpen}
        onOpenChange={setIsReportOpen}
        report={selectedReport}
      />
    </div>
  );
}

export default HistoryPage;
