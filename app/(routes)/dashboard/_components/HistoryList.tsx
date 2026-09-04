"use client";

import Image from "next/image";
import { useState } from "react";
import AddNewSessionDialog from "./AddNewSessionDialog";

function HistoryList() {
  const [historyList, setHistoryList] = useState<any[]>([]);

  return (
    <div className="mt-10">
      {historyList.length === 0 ? (
        <div className="flex items-center flex-col justify-center p-7 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
          <Image
            src="/medical-assistance.png"
            alt="No consultations"
            width={180}
            height={180}
            style={{ width: "auto", height: "auto" }}
          />

          <h2 className="font-bold text-xl mt-3">No Recent Consultations</h2>
          <p className="text-gray-500 text-sm mt-1 text-center">
            It looks like you haven&apos;t consulted with any doctors yet.
          </p>

          <AddNewSessionDialog
            btnText="+ Start a Consultation"
            className="mt-4 text-white font-medium"
          />
        </div>
      ) : (
        <div>List</div>
      )}
    </div>
  );
}

export default HistoryList;
