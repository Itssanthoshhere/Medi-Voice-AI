import AppHeader from "../dashboard/_components/AppHeader";
import AppFooter from "@/components/AppFooter";

export const metadata = {
  title: "Patient Health Timeline | MediVoice AI",
  description:
    "Interactive continuous clinical health timeline merging AI doctor consultations, SOAP reports, lab diagnostics, and biomarker extractions.",
};

function TimelineLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <AppHeader />
      <main className="flex-1 px-4 sm:px-6 lg:px-10 xl:px-12 py-10 w-full max-w-[1440px] mx-auto">
        {children}
      </main>
      <AppFooter />
    </div>
  );
}

export default TimelineLayout;
