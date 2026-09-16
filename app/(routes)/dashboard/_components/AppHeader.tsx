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
    path: "/billing",
  },
  {
    id: 4,
    name: "Profile",
    path: "/profile",
  },
  {
    id: 5,
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

      <div className="flex items-center gap-3">
        {/* Plan / Credits pill */}
        <Link
          href="/billing"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105 border ${
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
