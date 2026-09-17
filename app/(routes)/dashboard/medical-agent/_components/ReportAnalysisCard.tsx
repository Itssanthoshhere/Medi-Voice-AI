"use client";

import React from "react";
import {
  FileText,
  AlertCircle,
  CheckCircle,
  Info,
  ShieldAlert,
  Activity,
  ArrowRight,
} from "lucide-react";

export interface ReportParameter {
  name: string;
  value: string;
  referenceRange?: string;
  status: "Normal" | "Low" | "High" | "Critical" | string;
  interpretation?: string;
}

export interface AnalyzedReportData {
  reportTitle?: string;
  patientSummary?: string;
  parameters?: ReportParameter[];
  deficienciesOrAbnormalities?: string[];
  suggestedNextSteps?: string[];
  disclaimer?: string;
}

interface ReportAnalysisCardProps {
  data: AnalyzedReportData;
}

export default function ReportAnalysisCard({ data }: ReportAnalysisCardProps) {
  if (!data) return null;

  return (
    <div className="w-full my-4 rounded-3xl bg-white border border-rose-200/80 shadow-lg overflow-hidden font-sans space-y-0 text-gray-800">
      {/* Top Card Header */}
      <div className="bg-gradient-to-r from-red-900 via-slate-900 to-gray-900 text-white p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-white/10 border border-white/20 text-rose-300">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-rose-300">
              AI CLINICAL PATHOLOGY ANALYSIS
            </span>
            <h4 className="text-base font-extrabold text-white">
              {data.reportTitle || "Medical Test Report Summary"}
            </h4>
          </div>
        </div>
        <span className="text-xs font-bold bg-rose-500/20 text-rose-200 border border-rose-400/30 px-3 py-1 rounded-full">
          Lab Verified
        </span>
      </div>

      <div className="p-5 space-y-5 bg-gradient-to-b from-rose-50/20 via-white to-gray-50/40">
        {/* Patient Summary */}
        {data.patientSummary && (
          <p className="text-xs text-gray-700 leading-relaxed font-medium bg-white p-3.5 rounded-2xl border border-gray-200/80 shadow-2xs">
            {data.patientSummary}
          </p>
        )}

        {/* Identified Deficiencies / Abnormalities */}
        {data.deficienciesOrAbnormalities &&
          data.deficienciesOrAbnormalities.length > 0 && (
            <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 text-xs space-y-2">
              <p className="font-extrabold text-amber-900 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                Identified Key Health Conditions / Deficiencies:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {data.deficienciesOrAbnormalities.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-amber-100/90 border border-amber-300 text-amber-900 rounded-xl font-bold text-[11px]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

        {/* Parameter Breakdown */}
        {data.parameters && data.parameters.length > 0 && (
          <div className="space-y-2.5">
            <p className="text-xs font-bold text-gray-900 flex items-center gap-1.5 uppercase tracking-wider">
              <Activity className="w-4 h-4 text-primary" />
              Detailed Test Levels & Interpretations:
            </p>
            <div className="space-y-2.5">
              {data.parameters.map((param, idx) => {
                const isLow = param.status?.toLowerCase().includes("low");
                const isHigh = param.status?.toLowerCase().includes("high");
                const isCritical = param.status
                  ?.toLowerCase()
                  .includes("critical");

                const badgeBg = isCritical
                  ? "bg-red-100 text-red-800 border-red-300"
                  : isLow || isHigh
                    ? "bg-rose-100 text-rose-800 border-rose-300"
                    : "bg-emerald-100 text-emerald-800 border-emerald-300";

                return (
                  <div
                    key={idx}
                    className="p-3.5 bg-white rounded-2xl border border-gray-200/80 shadow-2xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-gray-900">
                        {param.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-700">
                          {param.value}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${badgeBg}`}
                        >
                          {param.status}
                        </span>
                      </div>
                    </div>

                    {param.referenceRange && (
                      <p className="text-[10px] text-gray-400 font-semibold">
                        Normal Range: {param.referenceRange}
                      </p>
                    )}

                    {param.interpretation && (
                      <p className="text-xs text-gray-600 leading-relaxed pt-0.5">
                        {param.interpretation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Suggested Next Steps */}
        {data.suggestedNextSteps && data.suggestedNextSteps.length > 0 && (
          <div className="space-y-2 bg-blue-50/60 border border-blue-100 rounded-2xl p-4 text-xs">
            <p className="font-extrabold text-blue-900 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600 shrink-0" />
              Suggested Next Steps & Clinical Discussion Topics:
            </p>
            <ul className="space-y-1.5 text-blue-900/90 font-medium pl-1">
              {data.suggestedNextSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Mandatory Physician Confirmation Disclaimer */}
        <div className="bg-rose-50 border border-rose-200/90 rounded-2xl p-3.5 text-xs text-rose-950 space-y-1 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-[#a4161a] shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed font-semibold">
            {data.disclaimer ||
              "IMPORTANT NOTICE: All AI report interpretations and test suggestions are for educational reference only. Any medication, dosage, or treatment plan MUST be evaluated and prescribed by a licensed healthcare professional."}
          </p>
        </div>
      </div>
    </div>
  );
}
