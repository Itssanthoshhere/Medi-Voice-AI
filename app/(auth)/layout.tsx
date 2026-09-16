"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

/* ── Full-page loading screen (Slack-style) ─────────────────── */
function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      {/* Logo */}
      <div className="mb-8">
        <Image
          src="/logo.png"
          alt="MediVoice AI"
          width={200}
          height={55}
          style={{ width: "auto", height: "auto" }}
          priority
        />
      </div>

      {/* Bouncing dots */}
      <div className="flex items-center gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-primary"
            style={{
              animation: "slack-bounce 1.4s ease-in-out infinite",
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes slack-bounce {
          0%, 80%, 100% {
            transform: scale(0.4);
            opacity: 0.3;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const pathname = usePathname();
  const isSignUp = pathname?.includes("/sign-up");

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 750);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* Full-page loader overlay */}
      {!ready && <FullPageLoader />}

      {/* Slack-style single-column centered layout with cool background */}
      <div
        className="min-h-screen flex flex-col relative selection:bg-primary/10 selection:text-primary overflow-x-hidden bg-white"
        style={{
          opacity: ready ? 1 : 0,
          transform: ready ? "none" : "translateY(8px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        {/* ── Slack-style clean background with subtle ambient dot pattern ── */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-b from-red-50/30 via-transparent to-transparent blur-3xl opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-50" />
        </div>

        {/* ── Header bar with Slack-style right corner link ──────── */}
        <header className="flex items-center justify-between px-6 sm:px-12 py-6 border-b border-gray-100/80 bg-white/70 backdrop-blur-md sticky top-0 z-20">
          <div className="w-52 hidden sm:block" />{" "}
          {/* Spacer for optical balance */}
          <Link
            href="/"
            className="flex items-center transition-opacity hover:opacity-90"
          >
            <Image
              src="/logo.png"
              alt="MediVoice AI"
              width={170}
              height={46}
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </Link>
          {/* Slack-style top-right stacked text */}
          <div className="w-52 flex justify-end">
            {isSignUp ? (
              <div className="text-right hidden sm:block">
                <p className="text-[13px] text-gray-500 font-normal leading-tight">
                  Already using MediVoice?
                </p>
                <Link
                  href="/sign-in"
                  className="text-[14px] font-bold text-primary hover:underline inline-block mt-0.5"
                >
                  Sign in
                </Link>
              </div>
            ) : (
              <div className="text-right hidden sm:block">
                <p className="text-[13px] text-gray-500 font-normal leading-tight">
                  New to MediVoice?
                </p>
                <Link
                  href="/sign-up"
                  className="text-[14px] font-bold text-primary hover:underline inline-block mt-0.5"
                >
                  Create an account
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* ── Main content — centered card with glassmorphic depth ── */}
        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-10 sm:py-16 relative z-10">
          <div className="w-full max-w-[440px] flex flex-col items-center">
            {children}
          </div>
        </main>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <footer className="flex items-center justify-center gap-6 py-6 border-t border-gray-100/80 px-6 bg-white/70 backdrop-blur-md relative z-10">
          <Link
            href="/about"
            className="text-xs text-muted-foreground hover:text-charcoal transition-colors"
          >
            About
          </Link>
          <span className="text-xs text-gray-300">·</span>
          <Link
            href="/billing"
            className="text-xs text-muted-foreground hover:text-charcoal transition-colors"
          >
            Pricing
          </Link>
          <span className="text-xs text-gray-300">·</span>
          <Link
            href="/privacy"
            className="text-xs text-muted-foreground hover:text-charcoal transition-colors"
          >
            Privacy & Terms
          </Link>
          <span className="text-xs text-gray-300">·</span>
          <span className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MediVoice AI
          </span>
        </footer>
      </div>
    </>
  );
}
