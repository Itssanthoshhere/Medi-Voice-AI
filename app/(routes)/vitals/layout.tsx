import React from "react";
import AppHeader from "@/app/(routes)/dashboard/_components/AppHeader";

export const metadata = {
  title: "Real-Time Vitals & Health Monitoring | MediVoice AI",
  description: "Track live heart rate, blood pressure, SpO2 oxygen levels, blood glucose, and temperature logs with clinical anomaly detection.",
};

export default function VitalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#faf9f7] text-gray-900 flex flex-col font-sans">
      <AppHeader />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
