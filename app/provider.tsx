"use client";

import { UserDetailContext } from "@/context/UserDetailContext";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useContext, useEffect, useState } from "react";

export type UserDetails = {
  name: string;
  email: string;
  credits: number;
};

function Provider({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user } = useUser();
  const [userDetails, setUserDetails] = useState<any>();

  useEffect(() => {
    CreateNewUser();
  }, [user]);

  const CreateNewUser = async () => {
    const result = await axios.post("/api/users");
    console.log(result.data);
    setUserDetails(result.data);
  };
  return (
    <div>
      <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
        {children}
      </UserDetailContext.Provider>
    </div>
  );
}

export default Provider;
