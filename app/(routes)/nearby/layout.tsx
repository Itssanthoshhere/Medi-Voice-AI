import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nearby Hospitals & Pharmacies | MediVoice AI",
  description:
    "Locate nearby hospitals, 24/7 emergency clinics, medical shops, and order doorstep medicine delivery in real-time.",
};

export default function NearbyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
