import AppHeader from "../dashboard/_components/AppHeader";

function HistoryLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <AppHeader />

      <div className="px-4 sm:px-6 lg:px-10 xl:px-12 py-10 w-full max-w-[1440px] mx-auto">{children}</div>
    </div>
  );
}

export default HistoryLayout;
