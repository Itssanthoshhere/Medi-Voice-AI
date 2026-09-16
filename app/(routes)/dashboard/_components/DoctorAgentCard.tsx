"use client";

import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight, Lock, User } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { UserDetailContext } from "@/context/UserDetailContext";
import UpgradeModal from "@/components/UpgradeModal";
import DoctorProfileModal from "@/components/DoctorProfileModal";
import { DoctorAgent } from "@/shared/list";

export type { DoctorAgent };
export type doctorAgent = DoctorAgent;

type DoctorAgentCardProps = {
  doctorAgent: DoctorAgent;
};

function DoctorAgentCard({ doctorAgent }: DoctorAgentCardProps) {
  const [loading, setLoading] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<"credits" | "specialist">(
    "specialist",
  );
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const router = useRouter();
  const { userDetails, refreshUser } = useContext(UserDetailContext);

  const userPlan = (userDetails?.plan || "free").toLowerCase();
  const userCredits = userDetails?.credits ?? 10;
  const isLocked = doctorAgent.subscriptionRequired && userPlan === "free";

  const handleCardClick = () => {
    setProfileModalOpen(true);
  };

  const onStartConsultation = async (doctor: DoctorAgent, notes: string) => {
    if (isLocked) {
      setProfileModalOpen(false);
      setUpgradeReason("specialist");
      setUpgradeModalOpen(true);
      return;
    }

    if (userPlan !== "clinic" && userCredits <= 0) {
      setProfileModalOpen(false);
      setUpgradeReason("credits");
      setUpgradeModalOpen(true);
      return;
    }

    try {
      setLoading(true);
      const result = await axios.post("/api/session-chat", {
        notes: notes.trim() || `Consultation with ${doctor.specialist}`,
        selectedDoctor: doctor,
      });

      if (refreshUser) {
        await refreshUser();
      }

      if (result.data?.sessionId) {
        router.push("/dashboard/medical-agent/" + result.data.sessionId);
      }
    } catch (e: any) {
      console.error("Error starting consultation:", e);
      if (e?.response?.data?.error === "SUBSCRIPTION_REQUIRED") {
        setProfileModalOpen(false);
        setUpgradeReason("specialist");
        setUpgradeModalOpen(true);
      } else if (e?.response?.data?.error === "INSUFFICIENT_CREDITS") {
        setProfileModalOpen(false);
        setUpgradeReason("credits");
        setUpgradeModalOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group relative flex flex-col justify-between h-full p-3.5 rounded-2xl border border-gray-100/80 bg-white shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 overflow-hidden cursor-pointer"
      >
        {/* Theme PRO Badge */}
        {isLocked && (
          <div className="absolute top-5 right-5 z-10 flex items-center gap-1.5 bg-[#a4161a] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md border border-white/20">
            <Lock className="w-3 h-3 text-amber-300" />
            <span>PRO</span>
          </div>
        )}

        <div>
          <div className="relative overflow-hidden rounded-xl bg-slate-100">
            <Image
              src={doctorAgent.image}
              alt={doctorAgent.specialist}
              width={200}
              height={300}
              className={`w-full h-[220px] object-cover rounded-xl group-hover:scale-105 transition-transform duration-300 ${
                isLocked ? "filter grayscale-[15%]" : ""
              }`}
            />
          </div>

          <h2 className="font-bold text-base mt-3 text-gray-900 flex items-center justify-between">
            <span>{doctorAgent.doctorName || doctorAgent.specialist}</span>
            <span className="text-[10px] bg-rose-50 text-[#a4161a] px-2 py-0.5 rounded-full font-semibold border border-rose-100">
              {doctorAgent.specialist}
            </span>
          </h2>
          <p className="line-clamp-2 text-xs text-gray-500 mt-1.5 leading-relaxed">
            {doctorAgent.description}
          </p>
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className={`w-full flex items-center justify-center gap-2 font-semibold text-xs h-10 rounded-xl transition-all shadow-sm ${
              isLocked
                ? "bg-gradient-to-r from-[#a4161a] to-[#8b1116] hover:from-[#8b1116] hover:to-[#720e12] text-white shadow-md shadow-[#a4161a]/20"
                : "bg-primary hover:bg-primary/90 text-white shadow-primary/20"
            }`}
          >
            {isLocked ? (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span>Unlock Specialist</span>
              </>
            ) : (
              <>
                <span>View Profile & Consult</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Doctor Profile & Consult Modal */}
      <DoctorProfileModal
        doctor={doctorAgent}
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        onStartConsultation={onStartConsultation}
        isLocked={isLocked}
        loading={loading}
      />

      {/* Upgrade Limit Modal */}
      <UpgradeModal
        open={upgradeModalOpen}
        onOpenChange={setUpgradeModalOpen}
        reason={upgradeReason}
        specialistName={doctorAgent.specialist}
      />
    </>
  );
}

export default DoctorAgentCard;
