"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import Link from "next/link";
import {
  FlaskConical,
  ArrowUpRight,
  CalendarDays,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Upload,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type BiomarkerParam = {
  name: string;
  value: string;
  status?: string;
};

type VaultReport = {
  id: number;
  reportId: string;
  reportTitle: string;
  testDate?: string | null;
  patientSummary?: string;
  parameters?: BiomarkerParam[];
  createdAt?: string;
};

function formatDate(d?: string | null) {
  if (!d) return "Date unknown";
  try {
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return d;
  }
}

export default function RecentReportsPreview() {
  const { user, isLoaded } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress || "";
  const [reports, setReports] = useState<VaultReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && email) {
      axios
        .get(`/api/report-vault?email=${encodeURIComponent(email)}`)
        .then((res) => setReports((res.data.reports || []).slice(0, 3)))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else if (isLoaded) {
      setLoading(false);
    }
  }, [isLoaded, email]);

  return (
    <div className="space-y-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#a4161a]/10">
            <FlaskConical className="w-5 h-5 text-[#a4161a]" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-gray-900">
              Recent Lab Reports
            </h2>
            <p className="text-xs text-gray-500">
              Your latest uploaded medical reports & biomarker trends
            </p>
          </div>
        </div>
        <Link
          href="/vault"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#a4161a] hover:text-[#8b1116] transition-colors"
        >
          View Full Vault
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
        </div>
      ) : reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 px-6 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 text-center">
          <FileText className="w-10 h-10 text-gray-300 mb-2" />
          <p className="text-sm text-gray-600 font-medium">
            No lab reports uploaded yet
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Upload your first medical report to track biomarkers over time.
          </p>
          <Link href="/vault">
            <Button className="mt-3 bg-[#a4161a] hover:bg-[#8b1116] text-white text-xs font-bold rounded-xl px-4">
              <Upload className="w-3.5 h-3.5 mr-1" />
              Upload Report
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {reports.map((r) => {
            const params = (r.parameters as BiomarkerParam[]) || [];
            const abnormalCount = params.filter(
              (p) =>
                p.status?.toLowerCase() !== "normal" && p.status,
            ).length;
            const normalCount = params.filter(
              (p) => p.status?.toLowerCase() === "normal",
            ).length;

            return (
              <Link
                key={r.reportId}
                href="/vault"
                className="p-4 bg-white rounded-2xl border border-gray-200/90 hover:border-[#a4161a]/40 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-[#a4161a] transition-colors">
                    {r.reportTitle}
                  </h4>
                  <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#a4161a] shrink-0 transition-colors" />
                </div>

                <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                  <CalendarDays className="w-3 h-3" />
                  {formatDate(r.testDate || r.createdAt)}
                </div>

                <div className="flex items-center gap-2 mt-3">
                  {normalCount > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      {normalCount} Normal
                    </span>
                  )}
                  {abnormalCount > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <AlertTriangle className="w-3 h-3" />
                      {abnormalCount} Abnormal
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
