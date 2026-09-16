"use client";

import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight, Loader2, Lock, Sparkles } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { UserDetailContext } from "@/context/UserDetailContext";
import UpgradeModal from "@/components/UpgradeModal";

export type DoctorAgent = {
  id: number | string;
  specialist: string;
  description?: string;
  image: string;
  agentPrompt?: string;
  voiceId?: string;
  subscriptionRequired?: boolean;
  name?: string;
};

export type doctorAgent = DoctorAgent;

type DoctorAgentCardProps = {
  doctorAgent: DoctorAgent;
};

function DoctorAgentCard({ doctorAgent }: DoctorAgentCardProps) {
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<"credits" | "specialist">("specialist");
  const [dialogOpen, setDialogOpen] = useState(false);

  const router = useRouter();
  const { userDetails, refreshUser } = useContext(UserDetailContext);

  const userPlan = (userDetails?.plan || "free").toLowerCase();
  const userCredits = userDetails?.credits ?? 10;
  const isLocked = doctorAgent.subscriptionRequired && userPlan === "free";

  const handleStartClick = () => {
    if (isLocked) {
      setUpgradeReason("specialist");
      setUpgradeModalOpen(true);
      return;
    }

    if (userPlan !== "clinic" && userCredits <= 0) {
      setUpgradeReason("credits");
      setUpgradeModalOpen(true);
      return;
    }

    setDialogOpen(true);
  };

  const onStartConsultation = async () => {
    try {
      setLoading(true);
      const result = await axios.post("/api/session-chat", {
        notes: note.trim() || `Consultation with ${doctorAgent.specialist}`,
        selectedDoctor: doctorAgent,
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
        setDialogOpen(false);
        setUpgradeReason("specialist");
        setUpgradeModalOpen(true);
      } else if (e?.response?.data?.error === "INSUFFICIENT_CREDITS") {
        setDialogOpen(false);
        setUpgradeReason("credits");
        setUpgradeModalOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="group relative flex flex-col justify-between h-full p-3.5 rounded-2xl border border-gray-100/80 bg-white shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 overflow-hidden">
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
            <span>{doctorAgent.specialist}</span>
          </h2>
          <p className="line-clamp-2 text-xs text-gray-500 mt-1 leading-relaxed">
            {doctorAgent.description}
          </p>
        </div>

        <Button
          onClick={handleStartClick}
          className={`w-full mt-4 flex items-center justify-center gap-2 font-semibold text-xs h-10 rounded-xl transition-all shadow-sm ${
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
              <span>Start Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>

      {/* Start Session Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <Image
                src={doctorAgent.image}
                alt={doctorAgent.specialist}
                width={56}
                height={56}
                className="w-14 h-14 rounded-full object-cover border border-gray-100"
              />
              <div>
                <DialogTitle className="text-lg">
                  Consult {doctorAgent.specialist}
                </DialogTitle>
                <DialogDescription className="text-xs mt-0.5">
                  {doctorAgent.description}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-2 mt-2">
            <label className="text-xs font-semibold text-gray-700">
              Add Symptoms or Medical Notes (Optional)
            </label>
            <Textarea
              placeholder={`Describe any symptoms or concerns for your ${doctorAgent.specialist} (optional)...`}
              className="min-h-[110px]"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <DialogFooter className="mt-4 flex gap-2">
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button
              disabled={loading}
              onClick={onStartConsultation}
              className="text-white flex items-center gap-1.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Starting...
                </>
              ) : (
                <>
                  Start Consultation <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
