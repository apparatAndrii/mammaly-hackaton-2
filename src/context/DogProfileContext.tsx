"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearDogProfileStorage,
  getStoredDogProfile,
  isOnboardingCompleted,
  saveDogProfile,
  TEST_DOG_PROFILE,
  type DogProfile,
} from "@/lib/dog-profile";

type DogProfileContextValue = {
  profile: DogProfile | null;
  onboardingCompleted: boolean;
  isHydrated: boolean;
  completeOnboarding: (profile: DogProfile) => void;
  skipWithTestData: () => void;
  resetOnboarding: () => void;
};

const DogProfileContext = createContext<DogProfileContextValue | null>(null);

export function DogProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<DogProfile | null>(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setOnboardingCompleted(isOnboardingCompleted());
    setProfile(getStoredDogProfile());
    setIsHydrated(true);
  }, []);

  const completeOnboarding = useCallback((nextProfile: DogProfile) => {
    saveDogProfile(nextProfile);
    setProfile(nextProfile);
    setOnboardingCompleted(true);
  }, []);

  const skipWithTestData = useCallback(() => {
    completeOnboarding(TEST_DOG_PROFILE);
  }, [completeOnboarding]);

  const resetOnboarding = useCallback(() => {
    clearDogProfileStorage();
    setProfile(null);
    setOnboardingCompleted(false);
  }, []);

  const value = useMemo(
    () => ({
      profile,
      onboardingCompleted,
      isHydrated,
      completeOnboarding,
      skipWithTestData,
      resetOnboarding,
    }),
    [
      profile,
      onboardingCompleted,
      isHydrated,
      completeOnboarding,
      skipWithTestData,
      resetOnboarding,
    ],
  );

  return (
    <DogProfileContext.Provider value={value}>
      {children}
    </DogProfileContext.Provider>
  );
}

export function useDogProfile() {
  const context = useContext(DogProfileContext);
  if (!context) {
    throw new Error("useDogProfile must be used within DogProfileProvider");
  }
  return context;
}
