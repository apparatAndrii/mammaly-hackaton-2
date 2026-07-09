"use client";

import { Compass, Heart, Home, MessageCircle, User } from "lucide-react";

export type TabId = "home" | "health" | "coach" | "journey" | "profile";

const TABS: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "health", label: "Health", icon: Heart },
  { id: "coach", label: "Coach", icon: MessageCircle },
  { id: "journey", label: "Journey", icon: Compass },
  { id: "profile", label: "Profil", icon: User },
];

type TabBarProps = {
  active: TabId;
  onChange: (tab: TabId) => void;
};

export function TabBar({ active, onChange }: TabBarProps) {
  return (
    <nav className="shrink-0 border-t border-cream-deep bg-paper px-2 pb-4 pt-1.5">
      <div className="flex items-start justify-between">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === active;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              aria-current={isActive ? "page" : undefined}
              className="flex w-14 flex-col items-center gap-0.5 py-1"
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                  isActive ? "ring-[1.5px] ring-forest" : ""
                }`}
              >
                <Icon
                  className={`h-[18px] w-[18px] ${
                    isActive ? "text-forest" : "text-olive"
                  }`}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
              </span>
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-forest" : "text-olive"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
