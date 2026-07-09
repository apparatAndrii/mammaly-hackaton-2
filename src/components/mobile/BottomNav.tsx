"use client";

import { Activity, Home, PawPrint, User } from "lucide-react";
import type { TabId } from "@/lib/types";

type NavItem = {
  id: TabId;
  label: string;
  icon: typeof Home;
};

const items: NavItem[] = [
  { id: "home", label: "Главная", icon: Home },
  { id: "pets", label: "Питомцы", icon: PawPrint },
  { id: "activity", label: "Активность", icon: Activity },
  { id: "profile", label: "Профиль", icon: User },
];

type BottomNavProps = {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
};

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="shrink-0 border-t border-white/10 bg-[#1a1a2e]/95 px-2 pb-6 pt-2 backdrop-blur-xl">
      <div className="flex items-center justify-around">
        {items.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => onTabChange(id)}
              className={`flex min-w-[64px] flex-col items-center gap-1 rounded-xl px-3 py-2 transition-all active:scale-95 ${
                isActive ? "text-violet-400" : "text-zinc-400"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${isActive ? "scale-110" : ""}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
