import { AIDoctorAgents } from "@/shared/list";
import DoctorAgentCard from "./DoctorAgentCard";

function DoctorsAgentList() {
  return (
    <div className="mt-10">
      <div>
        <h2 className="font-extrabold text-xl text-gray-900 tracking-tight">
          AI Specialist <span className="italic font-serif font-normal text-[#a4161a]">Doctors</span>
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Select a specialized AI doctor agent to start a real-time voice consultation.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-5">
        {AIDoctorAgents.map((doctor, index) => (
          <DoctorAgentCard key={doctor.id ?? index} doctorAgent={doctor} />
        ))}
      </div>
    </div>
  );
}

export default DoctorsAgentList;
