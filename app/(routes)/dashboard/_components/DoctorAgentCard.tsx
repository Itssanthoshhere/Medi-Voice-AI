import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export type DoctorAgent = {
  id: number;
  specialist: string;
  description: string;
  image: string;
  agentPrompt: string;
};

type DoctorAgentCardProps = {
  doctorAgent: DoctorAgent;
};

function DoctorAgentCard({ doctorAgent }: DoctorAgentCardProps) {
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

      <Button className="w-full mt-3 text-white flex items-center justify-center gap-1.5">
        Start Consultation <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
}

export default DoctorAgentCard;
