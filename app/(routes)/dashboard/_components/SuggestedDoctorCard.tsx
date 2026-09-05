import React from "react";
import Image from "next/image";
import { DoctorAgent } from "./DoctorAgentCard";

export type Doctor = DoctorAgent;

type Props = {
  doctorAgent: DoctorAgent;
  selectedDoctor?: DoctorAgent | null;
  setSelectedDoctor: (doctor: DoctorAgent) => void;
};

export default function SuggestedDoctorCard({
  doctorAgent,
  selectedDoctor,
  setSelectedDoctor,
}: Props) {
  const isSelected = selectedDoctor?.id === doctorAgent?.id;

  return (
    <div
      onClick={() => setSelectedDoctor(doctorAgent)}
      className={`flex flex-col items-center border rounded-2xl shadow-xs p-4 hover:border-primary cursor-pointer transition-all ${
        isSelected
          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
          : "border-gray-200 bg-white hover:bg-gray-50"
      }`}
    >
      <Image
        src={doctorAgent.image || "/doctor1.png"}
        alt={doctorAgent.specialist || "Doctor"}
        width={70}
        height={70}
        className="w-[50px] h-[50px] rounded-full object-cover shadow-xs"
      />
      <h2 className="font-bold text-sm text-center text-gray-900 mt-2">
        {doctorAgent.name || doctorAgent.specialist}
      </h2>
      <p className="text-xs text-center text-gray-500 mt-0.5 line-clamp-1">
        {doctorAgent.specialist}
      </p>
    </div>
  );
}
