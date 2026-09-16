"use client";

import { UserDetailContext } from "@/context/UserDetailContext";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useContext, useEffect, useState } from "react";

export type UserDetails = {
  name: string;
  email: string;
  credits: number;
  plan: string;
};

function Provider({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user, isLoaded } = useUser();
  const [userDetails, setUserDetails] = useState<any>();

  useEffect(() => {
    if (isLoaded && user) {
      CreateNewUser();
    }
  }, [user, isLoaded]);

  const CreateNewUser = async () => {
    try {
      const result = await axios.post("/api/users");
      console.log(result.data);
      setUserDetails(result.data);
    } catch (err: any) {
      console.error("Failed to create/fetch user:", err?.response?.data || err?.message || err);
    }
  };

  const refreshUser = async () => {
    try {
      const result = await axios.get("/api/users");
      setUserDetails(result.data);
    } catch (err: any) {
      console.error("Failed to refresh user details:", err);
    }
  };

  return (
    <div>
      <UserDetailContext.Provider
        value={{ userDetails, setUserDetails, refreshUser }}
      >
        {children}
      </UserDetailContext.Provider>
    </div>
  );
}

export default Provider;

