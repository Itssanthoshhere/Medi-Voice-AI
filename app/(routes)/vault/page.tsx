"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import {
  ArrowLeft,
  Upload,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  Trash2,
  Loader2,
  Search,
  FlaskConical,
  CalendarDays,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  GitCompareArrows,
  Activity,
  X,
  CheckCircle2,
  Clock,
  BarChart3,
  HeartPulse,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Types ─────────────────────────────────────────────────────────
type BiomarkerParam = {
  name: string;
  value: string;
  referenceRange?: string;
  status?: string;
  interpretation?: string;
  unit?: string;
};

type VaultReport = {
  id: number;
  reportId: string;
  userEmail: string;
  fileName?: string;
  reportTitle: string;
  testDate?: string | null;
  patientSummary?: string;
  parameters?: BiomarkerParam[];
  deficienciesOrAbnormalities?: string[];
  suggestedNextSteps?: string[];
  rawText?: string;
  createdAt?: string;
};

type ComparisonResult = {
  biomarkerTrends: {
    name: string;
    values: { date: string; value: string; status: string }[];
    trend: "improving" | "stable" | "worsening" | "new_finding";
    interpretation: string;
  }[];
  overallSummary: string;
  keyImprovements: string[];
  areasOfConcern: string[];
  disclaimer: string;
};

type ActiveView = "vault" | "upload" | "compare" | "detail";

// ─── Helper ────────────────────────────────────────────────────────
function getStatusColor(status?: string) {
  switch (status?.toLowerCase()) {
    case "high":
    case "critical":
      return "text-red-600 bg-red-50 border-red-200";
    case "low":
      return "text-amber-600 bg-amber-50 border-amber-200";
    case "normal":
      return "text-emerald-600 bg-emerald-50 border-emerald-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

function getTrendIcon(trend: string) {
  switch (trend) {
    case "improving":
      return <TrendingUp className="w-4 h-4 text-emerald-600" />;
    case "worsening":
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    case "stable":
      return <Minus className="w-4 h-4 text-blue-500" />;
    default:
      return <Activity className="w-4 h-4 text-gray-400" />;
  }
}

function getTrendBadge(trend: string) {
  const map: Record<string, string> = {
    improving: "bg-emerald-50 text-emerald-700 border-emerald-200",
    worsening: "bg-red-50 text-red-700 border-red-200",
    stable: "bg-blue-50 text-blue-700 border-blue-200",
    new_finding: "bg-purple-50 text-purple-700 border-purple-200",
  };
  return map[trend] || "bg-gray-50 text-gray-600 border-gray-200";
}

function formatDate(d?: string | null) {
  if (!d) return "Date unknown";
  try {
    return new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return d;
  }
}

// ═══════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════
export default function VaultPage() {
  const { user, isLoaded } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress || "";

  const [reports, setReports] = useState<VaultReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<ActiveView>("vault");
  const [searchQuery, setSearchQuery] = useState("");

  // Upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadText, setUploadText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [uploadError, setUploadError] = useState("");

  // Compare state
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [comparing, setComparing] = useState(false);
  const [comparisonResult, setComparisonResult] =
    useState<ComparisonResult | null>(null);

  // Detail state
  const [detailReport, setDetailReport] = useState<VaultReport | null>(null);

  // Expanded report in list
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);

  // ─── Data Fetch ──────────────────────────────────────────────────
  const fetchReports = useCallback(async () => {
    if (!email) return;
    try {
      setLoading(true);
      const res = await axios.get(`/api/report-vault?email=${encodeURIComponent(email)}`);
      setReports(res.data.reports || []);
    } catch (err) {
      console.error("Failed to fetch vault:", err);
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    if (isLoaded && email) fetchReports();
    else if (isLoaded && !email) setLoading(false);
  }, [isLoaded, email, fetchReports]);

  // ─── Upload & Analyze ────────────────────────────────────────────
  const handleAnalyze = async () => {
    if (!uploadFile && !uploadText.trim()) {
      setUploadError("Please select a file or paste report text.");
      return;
    }
    setAnalyzing(true);
    setUploadError("");
    setAnalysisResult(null);

    try {
      let fileData: string | null = null;
      let fileName = uploadFile?.name || "pasted-report";

      if (uploadFile) {
        const reader = new FileReader();
        fileData = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(uploadFile);
        });
      }

      const res = await axios.post("/api/analyze-report", {
        reportText: uploadText || null,
        fileData,
        fileName,
      });

      if (res.data.report) {
        setAnalysisResult(res.data.report);
      } else {
        setUploadError(res.data.error || "Analysis failed.");
      }
    } catch (err: any) {
      const errMsg =
        err?.response?.data?.error || "Analysis failed. Please try again.";
      setUploadError(errMsg);
      // Still set partial report if returned with the error
      if (err?.response?.data?.report) {
        setAnalysisResult(err.response.data.report);
      }
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveToVault = async () => {
    if (!analysisResult || !email) return;
    setSaving(true);
    try {
      await axios.post("/api/report-vault", {
        email,
        reportId: uuidv4(),
        fileName: uploadFile?.name || "pasted-report.txt",
        reportTitle: analysisResult.reportTitle || "Lab Report",
        testDate: analysisResult.testDate || null,
        patientSummary: analysisResult.patientSummary || "",
        parameters: analysisResult.parameters || [],
        deficienciesOrAbnormalities:
          analysisResult.deficienciesOrAbnormalities || [],
        suggestedNextSteps: analysisResult.suggestedNextSteps || [],
        rawText: uploadText || null,
      });
      // Reset and refresh
      setUploadFile(null);
      setUploadText("");
      setAnalysisResult(null);
      setActiveView("vault");
      await fetchReports();
    } catch (err: any) {
      setUploadError(
        err?.response?.data?.error || "Failed to save. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ─── Delete ──────────────────────────────────────────────────────
  const handleDelete = async (reportId: string) => {
    if (!confirm("Remove this report from your vault?")) return;
    try {
      await axios.delete(`/api/report-vault?reportId=${reportId}`);
      setReports((prev) => prev.filter((r) => r.reportId !== reportId));
      if (detailReport?.reportId === reportId) {
        setDetailReport(null);
        setActiveView("vault");
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // ─── Compare ─────────────────────────────────────────────────────
  const toggleCompareSelect = (reportId: string) => {
    setSelectedForCompare((prev) =>
      prev.includes(reportId)
        ? prev.filter((id) => id !== reportId)
        : prev.length < 4
          ? [...prev, reportId]
          : prev,
    );
  };

  const handleCompare = async () => {
    if (selectedForCompare.length < 2) return;
    setComparing(true);
    setComparisonResult(null);

    const reportsToCompare = reports
      .filter((r) => selectedForCompare.includes(r.reportId))
      .map((r) => ({
        reportTitle: r.reportTitle,
        testDate: r.testDate,
        parameters: (r.parameters as BiomarkerParam[]) || [],
      }));

    try {
      const res = await axios.post("/api/compare-reports", {
        reports: reportsToCompare,
      });
      setComparisonResult(res.data.comparison);
    } catch (err) {
      console.error("Comparison failed:", err);
    } finally {
      setComparing(false);
    }
  };

  // ─── Filtered list ───────────────────────────────────────────────
  const filteredReports = useMemo(() => {
    if (!searchQuery.trim()) return reports;
    const q = searchQuery.toLowerCase();
    return reports.filter(
      (r) =>
        r.reportTitle.toLowerCase().includes(q) ||
        r.fileName?.toLowerCase().includes(q) ||
        r.patientSummary?.toLowerCase().includes(q) ||
        r.testDate?.toLowerCase().includes(q),
    );
  }, [reports, searchQuery]);

  // ─── Derived Stats ───────────────────────────────────────────────
  const totalAbnormal = reports.reduce((acc, r) => {
    const params = (r.parameters as BiomarkerParam[]) || [];
    return (
      acc +
      params.filter(
        (p) => p.status?.toLowerCase() !== "normal" && p.status,
      ).length
    );
  }, 0);

  const totalNormal = reports.reduce((acc, r) => {
    const params = (r.parameters as BiomarkerParam[]) || [];
    return (
      acc +
      params.filter((p) => p.status?.toLowerCase() === "normal").length
    );
  }, 0);

  // ─── Loading ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#a4161a] animate-spin" />
        <p className="text-sm text-gray-500 font-medium">
          Loading your report vault...
        </p>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════
  return (
    <div className="space-y-8 pb-16">
      {/* Back link */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#a4161a] font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      {/* ════════════ HEADER SECTION ════════════ */}
      <section className="bg-gradient-to-b from-rose-50/60 via-white to-gray-50/40 p-6 sm:p-8 rounded-3xl border border-gray-200/60 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#a4161a]/10">
              <FlaskConical className="w-6 h-6 text-[#a4161a]" />
            </div>
            <div>
              <h1 className="font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight">
                Medical Report{" "}
                <span className="italic font-serif font-normal text-[#a4161a]">
                  Vault
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Store, track, and compare your lab reports over time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeView === "vault" && (
              <>
                <Button
                  onClick={() => {
                    setActiveView("upload");
                    setAnalysisResult(null);
                    setUploadError("");
                  }}
                  className="bg-[#a4161a] hover:bg-[#8b1116] text-white font-bold px-4 py-2 rounded-xl shadow-md text-sm"
                >
                  <Upload className="w-4 h-4 mr-1.5" />
                  Upload Report
                </Button>
                {reports.length >= 2 && (
                  <Button
                    onClick={() => {
                      setActiveView("compare");
                      setSelectedForCompare([]);
                      setComparisonResult(null);
                    }}
                    variant="outline"
                    className="font-semibold px-4 py-2 rounded-xl text-sm border-[#a4161a]/30 text-[#a4161a] hover:bg-[#a4161a]/5"
                  >
                    <GitCompareArrows className="w-4 h-4 mr-1.5" />
                    Compare
                  </Button>
                )}
              </>
            )}
            {activeView !== "vault" && (
              <Button
                onClick={() => {
                  setActiveView("vault");
                  setAnalysisResult(null);
                  setUploadError("");
                  setComparisonResult(null);
                  setDetailReport(null);
                }}
                variant="outline"
                className="font-semibold px-4 py-2 rounded-xl text-sm"
              >
                <X className="w-4 h-4 mr-1" />
                Back to Vault
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-xs">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-800">
              {reports.length}
            </span>
            <span className="text-xs text-gray-500">Reports</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-800">
              {totalNormal}
            </span>
            <span className="text-xs text-emerald-600">Normal</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl shadow-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-800">
              {totalAbnormal}
            </span>
            <span className="text-xs text-amber-600">Abnormal</span>
          </div>
        </div>
      </section>

      {/* ════════════ UPLOAD VIEW ════════════ */}
      {activeView === "upload" && (
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/60 shadow-xs space-y-6">
          <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <Upload className="w-5 h-5 text-[#a4161a]" />
            Upload & Analyze Lab Report
          </h2>

          {/* Drag & drop zone */}
          <label className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-[#a4161a]/50 hover:bg-rose-50/30 transition-all">
            <Upload className="w-10 h-10 text-gray-400 mb-3" />
            <p className="text-sm text-gray-600 font-medium">
              {uploadFile
                ? uploadFile.name
                : "Click or drag to upload a lab report"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Supports PDF, PNG, JPG, JPEG
            </p>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setUploadFile(file);
                  setUploadError("");
                }
              }}
            />
          </label>

          {/* Or paste text */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              Or paste report text directly:
            </label>
            <textarea
              value={uploadText}
              onChange={(e) => setUploadText(e.target.value)}
              rows={5}
              placeholder="Paste your lab report text here..."
              className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a4161a]/30 focus:border-[#a4161a]/50 transition-all placeholder:text-gray-400 resize-none"
            />
          </div>

          {uploadError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {uploadError}
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="bg-[#a4161a] hover:bg-[#8b1116] text-white font-bold px-6 py-2.5 rounded-xl shadow-md"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FlaskConical className="w-4 h-4 mr-1.5" />
                  Analyze Report
                </>
              )}
            </Button>
          </div>

          {/* Analysis result preview */}
          {analysisResult && (
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900">
                  {analysisResult.reportTitle || "Analysis Result"}
                </h3>
                <Button
                  onClick={handleSaveToVault}
                  disabled={saving}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl shadow-md text-sm"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      Save to Vault
                    </>
                  )}
                </Button>
              </div>

              {analysisResult.patientSummary && (
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  {analysisResult.patientSummary}
                </p>
              )}

              {analysisResult.parameters?.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left px-4 py-2.5 font-semibold text-gray-700">
                          Parameter
                        </th>
                        <th className="text-left px-4 py-2.5 font-semibold text-gray-700">
                          Value
                        </th>
                        <th className="text-left px-4 py-2.5 font-semibold text-gray-700">
                          Reference
                        </th>
                        <th className="text-left px-4 py-2.5 font-semibold text-gray-700">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysisResult.parameters.map(
                        (p: BiomarkerParam, i: number) => (
                          <tr
                            key={i}
                            className="border-b border-gray-100 hover:bg-gray-50/50"
                          >
                            <td className="px-4 py-2.5 font-medium text-gray-900">
                              {p.name}
                            </td>
                            <td className="px-4 py-2.5 text-gray-700">
                              {p.value}
                            </td>
                            <td className="px-4 py-2.5 text-gray-500">
                              {p.referenceRange || "—"}
                            </td>
                            <td className="px-4 py-2.5">
                              <span
                                className={`inline-flex px-2 py-0.5 rounded-md text-xs font-bold border ${getStatusColor(p.status)}`}
                              >
                                {p.status || "N/A"}
                              </span>
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {analysisResult.disclaimer && (
                <p className="text-[11px] text-gray-400 italic mt-2">
                  {analysisResult.disclaimer}
                </p>
              )}
            </div>
          )}
        </section>
      )}

      {/* ════════════ COMPARE VIEW ════════════ */}
      {activeView === "compare" && (
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/60 shadow-xs space-y-6">
          <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
            <GitCompareArrows className="w-5 h-5 text-[#a4161a]" />
            Compare Reports (select 2–4)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {reports.map((r) => {
              const isSelected = selectedForCompare.includes(r.reportId);
              return (
                <button
                  key={r.reportId}
                  onClick={() => toggleCompareSelect(r.reportId)}
                  className={`text-left p-4 rounded-2xl border-2 transition-all ${
                    isSelected
                      ? "border-[#a4161a] bg-rose-50/50 shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 line-clamp-1">
                        {r.reportTitle}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatDate(r.testDate || r.createdAt)}
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        isSelected
                          ? "border-[#a4161a] bg-[#a4161a]"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                    {((r.parameters as BiomarkerParam[]) || []).length}{" "}
                    parameters ·{" "}
                    {r.fileName || "report"}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              onClick={handleCompare}
              disabled={selectedForCompare.length < 2 || comparing}
              className="bg-[#a4161a] hover:bg-[#8b1116] text-white font-bold px-6 py-2.5 rounded-xl shadow-md disabled:opacity-40"
            >
              {comparing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  Analyzing Trends...
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4 mr-1.5" />
                  Compare {selectedForCompare.length} Reports
                </>
              )}
            </Button>
            <span className="text-xs text-gray-400">
              {selectedForCompare.length}/4 selected
            </span>
          </div>

          {/* Comparison Results */}
          {comparisonResult && (
            <div className="space-y-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-[#a4161a]" />
                <h3 className="font-bold text-lg text-gray-900">
                  Biomarker Trend Analysis
                </h3>
              </div>

              {/* Overall summary */}
              <div className="p-4 bg-gradient-to-r from-rose-50/60 to-amber-50/40 rounded-2xl border border-rose-100">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {comparisonResult.overallSummary}
                </p>
              </div>

              {/* Key improvements & concerns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {comparisonResult.keyImprovements?.length > 0 && (
                  <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 space-y-2">
                    <h4 className="text-sm font-bold text-emerald-800 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4" />
                      Key Improvements
                    </h4>
                    <ul className="space-y-1">
                      {comparisonResult.keyImprovements.map((item, i) => (
                        <li
                          key={i}
                          className="text-xs text-emerald-700 flex items-start gap-1.5"
                        >
                          <CheckCircle2 className="w-3 h-3 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {comparisonResult.areasOfConcern?.length > 0 && (
                  <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
                    <h4 className="text-sm font-bold text-amber-800 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      Areas of Concern
                    </h4>
                    <ul className="space-y-1">
                      {comparisonResult.areasOfConcern.map((item, i) => (
                        <li
                          key={i}
                          className="text-xs text-amber-700 flex items-start gap-1.5"
                        >
                          <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Trend cards */}
              <div className="space-y-3">
                {comparisonResult.biomarkerTrends?.map((trend, i) => (
                  <div
                    key={i}
                    className="p-4 bg-white rounded-2xl border border-gray-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTrendIcon(trend.trend)}
                        <h4 className="text-sm font-bold text-gray-900">
                          {trend.name}
                        </h4>
                      </div>
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-lg text-[11px] font-bold border capitalize ${getTrendBadge(trend.trend)}`}
                      >
                        {trend.trend.replace("_", " ")}
                      </span>
                    </div>

                    {/* Value progression */}
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      {trend.values?.map((v, vi) => (
                        <div key={vi} className="flex items-center gap-1">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getStatusColor(v.status)}`}
                          >
                            {v.value}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            ({v.date})
                          </span>
                          {vi < trend.values.length - 1 && (
                            <ArrowUpRight className="w-3 h-3 text-gray-300" />
                          )}
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-gray-500 italic">
                      {trend.interpretation}
                    </p>
                  </div>
                ))}
              </div>

              {comparisonResult.disclaimer && (
                <p className="text-[11px] text-gray-400 italic">
                  {comparisonResult.disclaimer}
                </p>
              )}
            </div>
          )}
        </section>
      )}

      {/* ════════════ DETAIL VIEW ════════════ */}
      {activeView === "detail" && detailReport && (
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/60 shadow-xs space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-bold text-xl text-gray-900">
                {detailReport.reportTitle}
              </h2>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {formatDate(detailReport.testDate || detailReport.createdAt)}
                </span>
                {detailReport.fileName && (
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    {detailReport.fileName}
                  </span>
                )}
              </div>
            </div>
            <Button
              onClick={() => handleDelete(detailReport.reportId)}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50 text-xs"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Delete
            </Button>
          </div>

          {detailReport.patientSummary && (
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <h3 className="text-sm font-semibold text-gray-800 mb-1">
                Patient Summary
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {detailReport.patientSummary}
              </p>
            </div>
          )}

          {/* Parameters table */}
          {((detailReport.parameters as BiomarkerParam[]) || []).length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-700">
                      Parameter
                    </th>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-700">
                      Value
                    </th>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-700">
                      Reference Range
                    </th>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="text-left px-4 py-2.5 font-semibold text-gray-700">
                      Interpretation
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {((detailReport.parameters as BiomarkerParam[]) || []).map(
                    (p, i) => (
                      <tr
                        key={i}
                        className="border-b border-gray-100 hover:bg-gray-50/50"
                      >
                        <td className="px-4 py-2.5 font-medium text-gray-900">
                          {p.name}
                        </td>
                        <td className="px-4 py-2.5 text-gray-700 font-mono text-xs">
                          {p.value}
                        </td>
                        <td className="px-4 py-2.5 text-gray-500 text-xs">
                          {p.referenceRange || "—"}
                        </td>
                        <td className="px-4 py-2.5">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-md text-xs font-bold border ${getStatusColor(p.status)}`}
                          >
                            {p.status || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-xs text-gray-500 max-w-xs">
                          {p.interpretation || "—"}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Deficiencies */}
          {(detailReport.deficienciesOrAbnormalities as string[])?.length >
            0 && (
            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
              <h3 className="text-sm font-bold text-amber-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Key Findings & Abnormalities
              </h3>
              <ul className="space-y-1">
                {(detailReport.deficienciesOrAbnormalities as string[]).map(
                  (item, i) => (
                    <li
                      key={i}
                      className="text-xs text-amber-700 flex items-start gap-1.5"
                    >
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </div>
          )}

          {/* Next steps */}
          {(detailReport.suggestedNextSteps as string[])?.length > 0 && (
            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-2">
              <h3 className="text-sm font-bold text-blue-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Suggested Next Steps
              </h3>
              <ul className="space-y-1">
                {(detailReport.suggestedNextSteps as string[]).map(
                  (item, i) => (
                    <li
                      key={i}
                      className="text-xs text-blue-700 flex items-start gap-1.5"
                    >
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* ════════════ VAULT LIST (Main view) ════════════ */}
      {activeView === "vault" && (
        <section className="bg-[#f8fafc] p-6 sm:p-8 rounded-3xl border border-gray-200/60 shadow-xs space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports by title, date, or summary..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-[#a4161a]/30 focus:border-[#a4161a]/50 transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Empty state */}
          {filteredReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 text-center">
              <FlaskConical className="w-12 h-12 text-gray-300 mb-3" />
              <h2 className="font-bold text-lg text-gray-900">
                {searchQuery ? "No matching reports" : "Your Vault is Empty"}
              </h2>
              <p className="text-gray-500 text-sm mt-1 max-w-md">
                {searchQuery
                  ? "Try a different search term."
                  : "Upload your first medical lab report to start tracking biomarkers over time."}
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => setActiveView("upload")}
                  className="mt-4 bg-[#a4161a] hover:bg-[#8b1116] text-white font-bold rounded-xl"
                >
                  <Upload className="w-4 h-4 mr-1.5" />
                  Upload First Report
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Timeline Header */}
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Clock className="w-4 h-4 text-gray-400" />
                Health Timeline
                <span className="text-xs font-normal text-gray-400">
                  ({filteredReports.length} report
                  {filteredReports.length !== 1 ? "s" : ""})
                </span>
              </div>

              {/* Timeline-style report cards */}
              <div className="relative space-y-4">
                {/* Timeline line */}
                <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-[#a4161a]/30 via-gray-200 to-transparent hidden sm:block" />

                {filteredReports.map((r) => {
                  const params = (r.parameters as BiomarkerParam[]) || [];
                  const abnormalCount = params.filter(
                    (p) =>
                      p.status?.toLowerCase() !== "normal" && p.status,
                  ).length;
                  const isExpanded = expandedReportId === r.reportId;

                  return (
                    <div
                      key={r.reportId}
                      className="relative sm:pl-12 group"
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-[11px] top-5 w-[18px] h-[18px] rounded-full border-2 border-[#a4161a]/40 bg-white group-hover:border-[#a4161a] group-hover:bg-rose-50 transition-all hidden sm:flex items-center justify-center z-10">
                        <div className="w-2 h-2 rounded-full bg-[#a4161a]/60 group-hover:bg-[#a4161a] transition-all" />
                      </div>

                      <div className="p-4 sm:p-5 bg-white rounded-2xl border border-gray-200/90 hover:border-[#a4161a]/30 hover:shadow-md transition-all">
                        {/* Card header */}
                        <div className="flex items-start justify-between gap-3">
                          <div
                            className="flex-1 cursor-pointer"
                            onClick={() => {
                              setDetailReport(r);
                              setActiveView("detail");
                            }}
                          >
                            <h3 className="font-bold text-sm text-gray-900 hover:text-[#a4161a] transition-colors line-clamp-1">
                              {r.reportTitle}
                            </h3>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <CalendarDays className="w-3 h-3" />
                                {formatDate(r.testDate || r.createdAt)}
                              </span>
                              <span>{params.length} parameters</span>
                              {abnormalCount > 0 && (
                                <span className="text-amber-600 font-semibold">
                                  {abnormalCount} abnormal
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() =>
                                setExpandedReportId(
                                  isExpanded ? null : r.reportId,
                                )
                              }
                              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
                              title={isExpanded ? "Collapse" : "Expand"}
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(r.reportId)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Summary snippet */}
                        {r.patientSummary && !isExpanded && (
                          <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                            {r.patientSummary}
                          </p>
                        )}

                        {/* Expanded: show parameter table */}
                        {isExpanded && params.length > 0 && (
                          <div className="mt-4 overflow-x-auto border border-gray-100 rounded-xl">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                  <th className="text-left px-3 py-2 font-semibold text-gray-600">
                                    Parameter
                                  </th>
                                  <th className="text-left px-3 py-2 font-semibold text-gray-600">
                                    Value
                                  </th>
                                  <th className="text-left px-3 py-2 font-semibold text-gray-600">
                                    Reference
                                  </th>
                                  <th className="text-left px-3 py-2 font-semibold text-gray-600">
                                    Status
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {params.map((p, i) => (
                                  <tr
                                    key={i}
                                    className="border-b border-gray-50 hover:bg-gray-50/50"
                                  >
                                    <td className="px-3 py-2 font-medium text-gray-800">
                                      {p.name}
                                    </td>
                                    <td className="px-3 py-2 text-gray-600 font-mono">
                                      {p.value}
                                    </td>
                                    <td className="px-3 py-2 text-gray-400">
                                      {p.referenceRange || "—"}
                                    </td>
                                    <td className="px-3 py-2">
                                      <span
                                        className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold border ${getStatusColor(p.status)}`}
                                      >
                                        {p.status || "N/A"}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
}
