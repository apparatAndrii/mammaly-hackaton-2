"use client";

import { DevToolsPanel } from "@/components/dev/DevToolsPanel";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { useDogProfile } from "@/context/DogProfileContext";
import { HomeScreen } from "./screens/HomeScreen";
import { StatusBar } from "./StatusBar";

export function MobileApp() {
  const { onboardingCompleted, isHydrated } = useDogProfile();
  const showOnboarding = isHydrated && !onboardingCompleted;

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-6 bg-zinc-100 p-4 md:flex-row md:items-center md:gap-8 md:p-8">
      <div className="relative w-full max-w-[390px]">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white">
          <div className="absolute left-1/2 top-2 z-20 h-7 w-28 -translate-x-1/2 rounded-full bg-zinc-900" />

          <div className="relative flex h-[780px] flex-col overflow-hidden bg-white">
            <StatusBar />

            <main className="flex flex-1 flex-col overflow-y-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {!isHydrated ? (
                <div className="flex flex-1 items-center justify-center">
                  <div className="h-6 w-6 animate-pulse rounded-full bg-zinc-200" />
                </div>
              ) : showOnboarding ? (
                <OnboardingFlow />
              ) : (
                <HomeScreen />
              )}
            </main>
          </div>

          <div className="absolute bottom-2 left-1/2 h-1 w-28 -translate-x-1/2 rounded-full bg-zinc-300" />
        </div>
      </div>

      <DevToolsPanel />
    </div>
  );
}
