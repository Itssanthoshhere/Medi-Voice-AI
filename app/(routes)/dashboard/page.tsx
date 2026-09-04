import AddNewSessionDialog from "./_components/AddNewSessionDialog";
import DoctorsAgentList from "./_components/DoctorsAgentList";
import HistoryList from "./_components/HistoryList";

function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl">My Dashboard</h2>

        <AddNewSessionDialog
          btnText="+ Consult With Doctor"
          className="text-white font-medium"
        />
      </div>

      <HistoryList />

      <DoctorsAgentList />
    </div>
  );
}

export default Dashboard;
