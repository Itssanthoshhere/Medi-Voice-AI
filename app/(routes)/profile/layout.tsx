import AppHeader from "../dashboard/_components/AppHeader";

function ProfileLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <AppHeader />
      <div className="px-6 md:px-16 lg:px-32 py-10 max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}

export default ProfileLayout;
