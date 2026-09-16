import AppHeader from "./_components/AppHeader";
import AppFooter from "@/components/AppFooter";

function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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

export default DashboardLayout;
