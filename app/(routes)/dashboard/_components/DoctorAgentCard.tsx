"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
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
  const router = useRouter();

  const onStartConsultation = async () => {
    try {
      setLoading(true);
      const result = await axios.post("/api/session-chat", {
        notes: note.trim() || `Consultation with ${doctorAgent.specialist}`,
        selectedDoctor: doctorAgent,
      });

      if (result.data?.sessionId) {
        router.push("/dashboard/medical-agent/" + result.data.sessionId);
      }
    } catch (e) {
      console.error("Error starting consultation:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group flex flex-col justify-between h-full p-3 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-200">
      <div>
        <Image
          src={doctorAgent.image}
          alt={doctorAgent.specialist}
          width={200}
          height={300}
          className="w-full h-[220px] object-cover rounded-xl group-hover:scale-[1.02] transition-transform duration-200"
        />

        <h2 className="font-bold text-base mt-2.5">{doctorAgent.specialist}</h2>
        <p className="line-clamp-2 text-xs text-gray-500 mt-1">
          {doctorAgent.description}
        </p>
      </div>

      <Dialog>
        <DialogTrigger
          render={
            <Button className="w-full mt-3 text-white flex items-center justify-center gap-1.5" />
          }
        >
          Start Consultation <ArrowRight className="w-4 h-4" />
        </DialogTrigger>

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
    </div>
  );
}

export default DoctorAgentCard;
