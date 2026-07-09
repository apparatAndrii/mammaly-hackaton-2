"use client";

import { useState } from "react";
import type { TabId } from "@/lib/types";
import { BottomNav } from "./BottomNav";
import { StatusBar } from "./StatusBar";
import { ActivityScreen } from "./screens/ActivityScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { PetsScreen } from "./screens/PetsScreen";
import { ProfileScreen } from "./screens/ProfileScreen";

const screens: Record<TabId, React.ComponentType> = {
  home: HomeScreen,
  pets: PetsScreen,
  activity: ActivityScreen,
  profile: ProfileScreen,
};

export function MobileApp() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const Screen = screens[activeTab];

  return (
    <div className="flex min-h-full items-center justify-center bg-[#0f0f1a] p-4 md:p-8">
      <div className="relative w-full max-w-[390px]">
        <div className="absolute -inset-3 rounded-[3rem] bg-gradient-to-b from-zinc-700/50 to-zinc-900/80 blur-sm" />
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#12121f] shadow-2xl shadow-black/60 ring-1 ring-white/10">
          <div className="absolute left-1/2 top-2 z-20 h-7 w-28 -translate-x-1/2 rounded-full bg-black" />

          <div className="relative flex h-[780px] flex-col bg-[#12121f]">
            <StatusBar />

            <main className="flex-1 overflow-y-auto overscroll-contain pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Screen />
            </main>

            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          <div className="absolute bottom-2 left-1/2 h-1 w-28 -translate-x-1/2 rounded-full bg-white/30" />
        </div>

        <p className="mt-6 hidden text-center text-sm text-zinc-500 md:block">
          Эмуляция мобильного приложения · 390×780
        </p>
      </div>
    </div>
  );
}
