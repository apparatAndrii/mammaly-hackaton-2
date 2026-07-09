"use client";

import { Check, ChevronRight, PawPrint } from "lucide-react";
import { useState } from "react";
import { DailyCheckInFlow } from "@/components/mobile/home/DailyCheckInFlow";
import { useDailyCheckIn } from "@/context/DailyCheckInContext";

export function DailyCheckInCard() {
  const { completedToday, completeCheckIn } = useDailyCheckIn();
  const [modalOpen, setModalOpen] = useState(false);

  const openCheckIn = () => {
    if (completedToday) return;
    setModalOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={openCheckIn}
        disabled={completedToday}
        className={`flex w-full items-center justify-between rounded-3xl px-4 py-4 text-left transition ${
          completedToday
            ? "cursor-default bg-moss"
            : "bg-forest active:scale-[0.99]"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              completedToday ? "bg-forest/10" : "bg-white/15"
            }`}
          >
            {completedToday ? (
              <Check className="h-4.5 w-4.5 text-forest" strokeWidth={2.5} />
            ) : (
              <PawPrint className="h-4.5 w-4.5 text-white" strokeWidth={2} />
            )}
          </div>
          <div>
            <p
              className={`text-sm font-semibold ${
                completedToday ? "text-forest" : "text-white"
              }`}
            >
              Daily Check-in
            </p>
            <p
              className={`text-xs ${
                completedToday ? "text-forest/70" : "text-white/70"
              }`}
            >
              {completedToday
                ? "Heute erledigt — bis morgen!"
                : "Wie war der Tag? · 30 Sekunden"}
            </p>
          </div>
        </div>
        {!completedToday && (
          <ChevronRight className="h-4 w-4 text-white/80" strokeWidth={2.5} />
        )}
      </button>

      {modalOpen && (
        <DailyCheckInFlow
          onClose={() => setModalOpen(false)}
          onComplete={completeCheckIn}
        />
      )}
    </>
  );
}
