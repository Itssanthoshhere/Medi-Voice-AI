import React from "react";
import AppHeader from "@/app/(routes)/dashboard/_components/AppHeader";

export const metadata = {
  title: "Appointments | MediVoice AI",
  description: "Schedule and manage doctor appointments and voice consultations with 11 specialist AI doctors.",
};

export default function AppointmentsLayout({
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
