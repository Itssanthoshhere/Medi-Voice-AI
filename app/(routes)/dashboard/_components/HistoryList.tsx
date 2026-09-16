"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  FileText,
  Calendar,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AddNewSessionDialog from "./AddNewSessionDialog";
import MedicalReportDialog, {
  MedicalReportData,
} from "../medical-agent/_components/MedicalReportDialog";

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

function HistoryList() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [historyList, setHistoryList] = useState<ConsultationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [selectedReport, setSelectedReport] =
    useState<MedicalReportData | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const displayedList = showAll ? historyList : historyList.slice(0, 3);

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

  const handleOpenReport = (report: MedicalReportData) => {
    setSelectedReport(report);
    setIsReportOpen(true);
  };

  if (loading) {
    return (
      <div className="mt-8 p-8 border border-gray-100 rounded-2xl bg-white/70 shadow-xs flex flex-col items-center justify-center gap-3 min-h-[180px]">
        <Loader2 className="w-7 h-7 text-primary animate-spin" />
        <p className="text-xs text-gray-500 font-medium">
          Loading your medical consultations...
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            Recent Consultations
            {historyList.length > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {historyList.length}
              </span>
            )}
          </h3>
          <p className="text-xs text-gray-500">
            View your consultation transcripts and generated clinical reports.
          </p>
        </div>

        {historyList.length > 3 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="text-xs font-semibold h-8 px-3 border-gray-300 text-gray-700 hover:bg-gray-100 shadow-2xs"
          >
            {showAll ? "Show Recent 3" : `Show All (${historyList.length})`}
          </Button>
        )}
      </div>

      {historyList.length === 0 ? (
        <div className="flex items-center flex-col justify-center p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 text-center">
          <Image
            src="/medical-assistance.png"
            alt="No consultations"
            width={160}
            height={160}
            style={{ width: "auto", height: "auto" }}
          />

          <h2 className="font-bold text-lg mt-3 text-gray-900">
            No Recent Consultations
          </h2>
          <p className="text-gray-500 text-xs mt-1 max-w-sm">
            It looks like you haven&apos;t consulted with any doctors yet. Start
            a new voice or chat session anytime.
          </p>

          <AddNewSessionDialog
            btnText="+ Start a Consultation"
            className="mt-4 text-white font-medium"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedList.map((item) => {
            const docInfo = item.selectedDoctor || {};
            const specialist = docInfo.specialist || "AI Medical Specialist";
            const docImage = docInfo.image || "/doctor1.png";
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
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span>
                            {item.createdOn
                              ? new Date(item.createdOn).toLocaleDateString()
                              : "Recent"}
                          </span>
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

      {historyList.length > 3 && (
        <div className="mt-5 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="text-xs font-semibold h-8 px-5 border-gray-300 hover:border-primary/50 text-gray-700 hover:text-primary transition-all shadow-2xs"
          >
            {showAll ? "Show Recent 3" : `Show All Consultations (${historyList.length})`}
          </Button>
        </div>
      )}

      {/* Global Report Modal for Dashboard */}
      <MedicalReportDialog
        open={isReportOpen}
        onOpenChange={setIsReportOpen}
        report={selectedReport}
      />
    </div>
  );
}

export default HistoryList;
