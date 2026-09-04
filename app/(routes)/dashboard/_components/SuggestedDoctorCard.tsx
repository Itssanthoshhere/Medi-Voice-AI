import Image from "next/image";
import { DoctorAgent } from "./DoctorAgentCard";

type SuggestedDoctorCardProps = {
  doctorAgent: DoctorAgent;
  selectedDoctor?: DoctorAgent;
  setSelectedDoctor?: (doctor: DoctorAgent) => void;
};

function SuggestedDoctorCard({
  doctorAgent,
  selectedDoctor,
  setSelectedDoctor,
}: SuggestedDoctorCardProps) {
  const isSelected = selectedDoctor?.id === doctorAgent?.id;

  return (
    <div
      onClick={() => setSelectedDoctor?.(doctorAgent)}
      className={`cursor-pointer p-3 rounded-xl border transition-all flex items-center gap-3 ${
        isSelected
          ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      <Image
        src={doctorAgent.image}
        alt={doctorAgent.specialist}
        width={50}
        height={50}
        className="w-12 h-12 rounded-full object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-gray-900 truncate">
          {doctorAgent.specialist}
        </h3>
        <p className="line-clamp-1 text-xs text-gray-500">
          {doctorAgent.description}
        </p>
      </div>
    </div>
  );
}

export default SuggestedDoctorCard;
