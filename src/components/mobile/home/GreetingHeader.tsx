"use client";

import { Flame } from "lucide-react";

type GreetingHeaderProps = {
  dogName: string;
  streakDays: number;
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 11) return "Guten Morgen";
  if (hour < 18) return "Guten Tag";
  return "Guten Abend";
}

export function GreetingHeader({ dogName, streakDays }: GreetingHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-olive">
          {getGreeting()}
        </p>
        <h1 className="mt-1 font-display text-[26px] font-semibold leading-tight text-ink">
          Wie geht&apos;s {dogName} heute?
        </h1>
      </div>

      <div
        className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-full bg-moss text-forest"
        title={`${streakDays} Tage Check-in-Serie`}
      >
        <Flame className="h-3.5 w-3.5" strokeWidth={2.2} />
        <span className="text-[11px] font-bold leading-none">{streakDays}</span>
      </div>
    </header>
  );
}
