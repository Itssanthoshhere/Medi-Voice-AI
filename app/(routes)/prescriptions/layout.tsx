import React from "react";
import AppHeader from "@/app/(routes)/dashboard/_components/AppHeader";

export const metadata = {
  title: "Prescriptions & Medication Tracker | MediVoice AI",
  description: "Track active e-prescriptions, daily dosage schedules, refills, and medication guidelines.",
};

export default function PrescriptionsLayout({
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
