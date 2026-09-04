"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuOptions = [
  {
    id: 1,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    id: 2,
    name: "History",
    path: "/history",
  },
  {
    id: 3,
    name: "Pricing",
    path: "/pricing",
  },
  {
    id: 4,
    name: "Profile",
    path: "/profile",
  },
];

function AppHeader() {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between p-4 shadow-sm border-b border-gray-100 px-10 md:px-20 lg:px-40 bg-white sticky top-0 z-50">
      <Link href="/dashboard">
        <Image
          src="/logo.png"
          alt="MediVoice"
          width={140}
          height={140}
          style={{ width: "auto", height: "auto" }}
          priority
        />
      </Link>

      <div className="hidden md:flex gap-10 items-center">
        {menuOptions.map((option) => (
          <Link
            key={option.id}
            href={option.path}
            className={`text-sm transition-colors hover:text-primary ${
              pathname === option.path
                ? "text-primary font-bold"
                : "text-gray-600 font-medium"
            }`}
          >
            {option.name}
          </Link>
        ))}
      </div>

      <UserButton />
    </div>
  );
}

export default AppHeader;
