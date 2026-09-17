import Link from "next/link";
import AddNewSessionDialog from "./_components/AddNewSessionDialog";
import DoctorsAgentList from "./_components/DoctorsAgentList";
import HistoryList from "./_components/HistoryList";
import MentalHealthSection from "./_components/MentalHealthSection";
import RecentReportsPreview from "./_components/RecentReportsPreview";
import SymptomCheckerBanner from "./_components/SymptomCheckerBanner";
import UpcomingAppointmentsWidget from "./_components/UpcomingAppointmentsWidget";
import MedicationTrackerWidget from "./_components/MedicationTrackerWidget";
import VitalsMonitorWidget from "./_components/VitalsMonitorWidget";

function Dashboard() {
  return (
    <div className="space-y-8 pb-12">
      {/* Section 1: Dashboard Header & Quick Action Canvas (Soft Ambient Light Shading) */}
      <section className="bg-gradient-to-b from-gray-50/90 via-white to-gray-50/40 p-6 sm:p-8 rounded-3xl border border-gray-200/60 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight">
            My <span className="italic font-serif font-normal text-[#a4161a]">Dashboard</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage your AI medical consultations, doctor specialists, and clinical SOAP reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/appointments"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:border-[#a4161a] hover:text-[#a4161a] shadow-xs transition-all"
          >
            Appointments &rarr;
          </Link>

          <AddNewSessionDialog
            btnText="+ Consult With Doctor"
            className="!text-white font-bold bg-[#a4161a] hover:bg-[#8b1116] px-5 py-2.5 rounded-xl shadow-md transition-all"
          />
        </div>
      </section>

      {/* Section 2: Smart Symptom Checker Hero Banner */}
      <section>
        <SymptomCheckerBanner />
      </section>

      {/* Section 2.5: Scheduled Appointments, Medication & Live Vitals Widgets */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UpcomingAppointmentsWidget />
        <MedicationTrackerWidget />
        <VitalsMonitorWidget />
      </section>

      {/* Section 3: Consultation History Canvas (Soft Slate Shading) */}
      <section className="bg-[#f8fafc] p-6 sm:p-8 rounded-3xl border border-gray-200/60 shadow-xs space-y-4">
        <HistoryList />
      </section>

      {/* Section 4: Recent Lab Reports & Biomarker Trends Preview */}
      <section className="bg-gradient-to-b from-rose-50/30 via-white to-gray-50/20 p-6 sm:p-8 rounded-3xl border border-gray-200/60 shadow-xs space-y-4">
        <RecentReportsPreview />
      </section>

      {/* Section 5: AI Specialist Roster Canvas (The 10 Specialists) */}
      <section className="bg-gradient-to-b from-white via-red-50/20 to-gray-50/30 p-6 sm:p-8 rounded-3xl border border-gray-200/60 shadow-xs space-y-4">
        <DoctorsAgentList />
      </section>

      {/* Section 5: Dedicated Mental Health & Emotional Counselling */}
      <section>
        <MentalHealthSection />
      </section>
    </div>
  );
}

export default Dashboard;

