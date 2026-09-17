"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useContext } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { Zap, Crown, Sparkles } from "lucide-react";

const menuOptions = [
  {
    id: 1,
    name: "Home",
    path: "/",
  },
  {
    id: 2,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    id: 3,
    name: "History",
    path: "/history",
  },
  {
    id: 4,
    name: "Report Vault",
    path: "/vault",
  },
  {
    id: 5,
    name: "Health Timeline",
    path: "/timeline",
  },
  {
    id: 6,
    name: "Appointments",
    path: "/appointments",
  },
  {
    id: 7,
    name: "Prescriptions",
    path: "/prescriptions",
  },
  {
    id: 8,
    name: "Family Profiles",
    path: "/family",
  },
  {
    id: 9,
    name: "Pricing",
    path: "/billing",
  },
  {
    id: 10,
    name: "Profile",
    path: "/profile",
  },
  {
    id: 11,
    name: "About",
    path: "/about",
  },
];

function AppHeader() {
  const pathname = usePathname();
  const { userDetails } = useContext(UserDetailContext);

  const plan = (userDetails?.plan || "free").toLowerCase();
  const credits = userDetails?.credits ?? 10;

  return (
    <div className="flex items-center justify-between p-4 shadow-sm border-b border-gray-100 px-10 md:px-20 lg:px-40 bg-white sticky top-0 z-50">
      <Link href="/">
        <Image
          src="/logo.png"
          alt="MediVoice AI"
          width={140}
          height={140}
          style={{ width: "auto", height: "auto" }}
          priority
        />
      </Link>

      <div className="hidden md:flex gap-2 items-center">
        {menuOptions.map((option) => {
          const isActive = pathname === option.path;
          return (
            <Link
              key={option.id}
              href={option.path}
              className={`px-3.5 py-1.5 rounded-full text-xs transition-all duration-200 ${
                isActive
                  ? "bg-[#a4161a] !text-white font-bold shadow-xs"
                  : "text-gray-600 hover:text-[#a4161a] hover:bg-gray-100/70 font-semibold"
              }`}
              style={isActive ? { color: "#ffffff" } : undefined}
            >
              {option.name}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        {/* Plan / Credits pill */}
        <Link
          href="/billing"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all hover:scale-105 border ${
            plan === "clinic"
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : plan === "pro"
              ? "bg-primary/10 text-primary border-primary/20"
              : "bg-gray-100 text-gray-700 border-gray-200"
          }`}
        >
          {plan === "clinic" ? (
            <>
              <Crown className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>Clinic Plan</span>
            </>
          ) : plan === "pro" ? (
            <>
              <Zap className="w-3.5 h-3.5 text-primary fill-primary/20" />
              <span>{credits} Credits (Pro)</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{credits} Free Credits</span>
            </>
          )}
        </Link>

        <UserButton />
      </div>
    </div>
  );
}

export default AppHeader;
