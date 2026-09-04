import DoctorsAgentList from "./_components/DoctorsAgentList";
import HistoryList from "./_components/HistoryList";
import { Button } from "@/components/ui/button";

function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl">My Dashboard</h2>

        <Button className="text-white font-medium">
          + Consult With Doctor
        </Button>
      </div>

      <HistoryList />

      <DoctorsAgentList />
    </div>
  );
}

export default Dashboard;
