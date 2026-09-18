"use client";

import { UserDetailContext } from "@/context/UserDetailContext";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import OnboardingModal from "@/components/OnboardingModal";

export type UserDetails = {
  id?: number;
  name: string;
  email: string;
  credits: number;
  plan: string;
  bloodGroup?: string;
  allergies?: string;
  emergencyContact?: string;
  preferredVoice?: string;
};

function Provider({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user, isLoaded } = useUser();
  const [userDetails, setUserDetails] = useState<any>();
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isLoaded && user) {
      CreateNewUser();
    }
  }, [user, isLoaded]);

  const CreateNewUser = async () => {
    try {
      const result = await axios.post("/api/users");
      setUserDetails(result.data);

      if (result.data?.isNewUser || (result.data && !result.data.emergencyContact)) {
        setIsOnboardingOpen(true);
      }
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
        {isLoaded && user && (
          <OnboardingModal
            isOpen={isOnboardingOpen}
            userEmail={user.primaryEmailAddress?.emailAddress || ""}
            initialName={user.fullName || user.firstName || ""}
            onComplete={(updatedData) => {
              setUserDetails(updatedData);
              setIsOnboardingOpen(false);
            }}
          />
        )}
      </UserDetailContext.Provider>
    </div>
  );
}

export default Provider;

