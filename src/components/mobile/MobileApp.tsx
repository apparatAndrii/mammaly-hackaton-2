"use client";

import { useState } from "react";
import { DevToolsPanel } from "@/components/dev/DevToolsPanel";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { useDogProfile } from "@/context/DogProfileContext";
import { CoachScreen } from "./screens/CoachScreen";
import { HealthScreen } from "./screens/HealthScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { JourneyScreen } from "./screens/JourneyScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { StatusBar } from "./StatusBar";
import { TabBar, type TabId } from "./TabBar";

export function MobileApp() {
  const { onboardingCompleted, isHydrated } = useDogProfile();
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const showOnboarding = isHydrated && !onboardingCompleted;

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-6 bg-cream p-4 md:flex-row md:items-center md:gap-8 md:p-8">
      <div className="flex w-full max-w-[390px] flex-col items-center gap-3">
        <header className="text-center">
          <p className="font-display text-2xl font-semibold lowercase tracking-tight text-ink">
            mammaly
          </p>
          <p className="text-xs text-olive">Health Coach · Prototyp</p>
        </header>

        <div className="relative w-full overflow-hidden rounded-[2.5rem] border-[6px] border-ink/90 bg-paper shadow-xl shadow-ink/10">
          <div className="absolute left-1/2 top-2 z-20 h-7 w-28 -translate-x-1/2 rounded-full bg-ink" />

          <div className="relative flex h-[780px] flex-col overflow-hidden bg-paper">
            <StatusBar />

            <main className="flex flex-1 flex-col overflow-y-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {!isHydrated ? (
                <div className="flex flex-1 items-center justify-center">
                  <div className="h-6 w-6 animate-pulse rounded-full bg-cream-deep" />
                </div>
              ) : showOnboarding ? (
                <OnboardingFlow />
              ) : activeTab === "home" ? (
                <HomeScreen onNavigate={setActiveTab} />
              ) : activeTab === "health" ? (
                <HealthScreen />
              ) : activeTab === "coach" ? (
                <CoachScreen />
              ) : activeTab === "journey" ? (
                <JourneyScreen />
              ) : (
                <ProfileScreen />
              )}
            </main>

            {isHydrated && !showOnboarding && (
              <TabBar active={activeTab} onChange={setActiveTab} />
            )}
          </div>

          <div className="absolute bottom-1.5 left-1/2 z-20 h-1 w-28 -translate-x-1/2 rounded-full bg-ink/20" />
        </div>
      </div>

      <DevToolsPanel />
    </div>
  );
}
