"use client";

import Image from "next/image";
import Link from "next/link";

export default function AppFooter() {
  return (
    <footer className="border-t border-gray-200/80 bg-white/60 backdrop-blur-sm mt-auto py-6">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-center gap-3.5 text-center">
        <Link
          href="/"
          aria-label="MediVoice AI home"
          className="inline-flex items-center hover:opacity-90 transition-opacity"
          onClick={(e) => {
            if (
              typeof window !== "undefined" &&
              window.location.pathname === "/"
            ) {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <Image
            src="/logo.png"
            alt="MediVoice AI"
            width={130}
            height={36}
            className="h-7 w-auto object-contain"
          />
        </Link>
        <span className="text-slate-400 text-sm font-normal tracking-wide">
          &copy; {new Date().getFullYear()} MediVoice AI
        </span>
      </div>
    </footer>
  );
}
