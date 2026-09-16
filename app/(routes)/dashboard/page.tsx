import AddNewSessionDialog from "./_components/AddNewSessionDialog";
import DoctorsAgentList from "./_components/DoctorsAgentList";
import HistoryList from "./_components/HistoryList";

function Dashboard() {
  return (
    <div className="space-y-8 pb-12">
      {/* Section 1: Dashboard Header & Quick Action Canvas (Soft Ambient Light Shading) */}
      <section className="bg-gradient-to-b from-gray-50/90 via-white to-gray-50/40 p-6 sm:p-8 rounded-3xl border border-gray-200/60 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight">
            My Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage your AI medical consultations, doctor specialists, and clinical SOAP reports.
          </p>
        </div>

        <AddNewSessionDialog
          btnText="+ Consult With Doctor"
          className="!text-white font-bold bg-[#a4161a] hover:bg-[#8b1116] px-5 py-2.5 rounded-xl shadow-md transition-all"
        />
      </section>

      {/* Section 2: Consultation History Canvas (Soft Slate Shading) */}
      <section className="bg-[#f8fafc] p-6 sm:p-8 rounded-3xl border border-gray-200/60 shadow-xs space-y-4">
        <HistoryList />
      </section>

      {/* Section 3: AI Specialist Roster Canvas (Soft Tinted Shading) */}
      <section className="bg-gradient-to-b from-white via-red-50/20 to-gray-50/30 p-6 sm:p-8 rounded-3xl border border-gray-200/60 shadow-xs space-y-4">
        <DoctorsAgentList />
      </section>
    </div>
  );
}

export default Dashboard;
