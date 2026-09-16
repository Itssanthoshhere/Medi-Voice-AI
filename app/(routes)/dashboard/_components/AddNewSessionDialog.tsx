"use client";

import { Button } from "@/components/ui/button";
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
import { ArrowRight, Loader2 } from "lucide-react";
import { useContext, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { DoctorAgent } from "./DoctorAgentCard";
import SuggestedDoctorCard from "./SuggestedDoctorCard";
import { AIDoctorAgents } from "@/shared/list";
import { UserDetailContext } from "@/context/UserDetailContext";
import UpgradeModal from "@/components/UpgradeModal";

type AddNewSessionDialogProps = {
  btnText?: string;
  className?: string;
};

function AddNewSessionDialog({
  btnText = "+ Start a Consultation",
  className = "text-white font-medium",
}: AddNewSessionDialogProps) {
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [suggestedDoctors, setSuggestedDoctors] = useState<DoctorAgent[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorAgent>();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState<"credits" | "specialist">("credits");

  const router = useRouter();
  const { userDetails, refreshUser } = useContext(UserDetailContext);

  const userPlan = (userDetails?.plan || "free").toLowerCase();
  const userCredits = userDetails?.credits ?? 10;

  const handleOpenCheck = () => {
    if (userPlan !== "clinic" && userCredits <= 0) {
      setUpgradeReason("credits");
      setUpgradeModalOpen(true);
      return;
    }
    setDialogOpen(true);
  };

  const OnClickNext = async () => {
    try {
      setLoading(true);
      const result = await axios.post("/api/suggest-doctors", {
        notes: note,
      });

      let doctorsList: DoctorAgent[] = [];

      if (Array.isArray(result.data)) {
        doctorsList = result.data;
      } else if (result.data && typeof result.data === "object") {
        doctorsList =
          result.data.doctors ||
          result.data.suggestedDoctors ||
          result.data.suggested_doctors ||
          [];
      }

      if (!doctorsList || doctorsList.length === 0) {
        doctorsList = AIDoctorAgents;
      }

      setSuggestedDoctors(doctorsList);
      if (doctorsList.length > 0) {
        setSelectedDoctor(doctorsList[0]);
      }
    } catch (e) {
      console.error("Error suggesting doctors:", e);
      setSuggestedDoctors(AIDoctorAgents);
      if (AIDoctorAgents.length > 0) {
        setSelectedDoctor(AIDoctorAgents[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  const onStartConsultation = async () => {
    if (selectedDoctor?.subscriptionRequired && userPlan === "free") {
      setDialogOpen(false);
      setUpgradeReason("specialist");
      setUpgradeModalOpen(true);
      return;
    }

    try {
      setLoading(true);
      const result = await axios.post("/api/session-chat", {
        notes: note,
        selectedDoctor: selectedDoctor,
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
      <Button onClick={handleOpenCheck} className={className}>
        {btnText}
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {suggestedDoctors.length === 0
                ? "Add Basic Details"
                : "Suggested Specialists"}
            </DialogTitle>
            <DialogDescription>
              {suggestedDoctors.length === 0
                ? "Provide your symptoms or medical details to begin the consultation."
                : "Select a recommended AI specialist for your consultation."}
            </DialogDescription>
          </DialogHeader>

          {suggestedDoctors.length === 0 ? (
            <div className="space-y-2 mt-2">
              <h2 className="text-sm font-semibold text-gray-700">
                Add Symptoms or Any Other Details
              </h2>
              <Textarea
                placeholder="Add detail here..."
                className="min-h-[120px]"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          ) : (
            <div className="space-y-3 mt-2 max-h-[350px] overflow-y-auto pr-1">
              <h2 className="text-sm font-semibold text-gray-700">
                Choose an AI Doctor:
              </h2>
              <div className="grid grid-cols-1 gap-2.5">
                {suggestedDoctors.map((doctor, index) => (
                  <SuggestedDoctorCard
                    key={doctor.id ?? index}
                    doctorAgent={doctor}
                    selectedDoctor={selectedDoctor}
                    setSelectedDoctor={setSelectedDoctor}
                  />
                ))}
              </div>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>

            {suggestedDoctors.length === 0 ? (
              <Button
                disabled={!note.trim() || loading}
                onClick={OnClickNext}
                className="text-white flex items-center gap-1.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Suggesting...
                  </>
                ) : (
                  <>
                    Next <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            ) : (
              <Button
                disabled={!selectedDoctor || loading}
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
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <UpgradeModal
        open={upgradeModalOpen}
        onOpenChange={setUpgradeModalOpen}
        reason={upgradeReason}
      />
    </>
  );
}

export default AddNewSessionDialog;
