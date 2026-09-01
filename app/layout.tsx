import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider";

export const viewport: Viewport = {
  themeColor: "#A4161A",
};

export const metadata: Metadata = {
  title:
    "Voice AI for Medical Practices | Automated Patient Calls | MediVoice AI",
  description:
    "MediVoice AI automates medical-practice calls, patient intake, scheduling, and escalation. 24/7 AI-powered reception with structured patient intake and automatic follow-up.",
  keywords: [
    "voice AI for medical practices",
    "automated patient calls",
    "ai primary care receptionist",
    "ai patient intake",
    "medical answering service",
    "patient intake automation",
    "clinic call handling",
    "medivoice",
    "24/7 patient intake",
    "after hours medical practice answering service",
  ],
  openGraph: {
    title:
      "Voice AI for Medical Practices | Automated Patient Calls | MediVoice AI",
    description:
      "MediVoice AI automates medical-practice calls, patient intake, scheduling, and escalation.",
    url: "https://medivoice.org/",
    siteName: "MediVoice AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Voice AI for Medical Practices | MediVoice AI",
    description:
      "MediVoice AI automates medical-practice calls, patient intake, scheduling, and escalation.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
        </head>
        <body>
          <Provider>{children}</Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
