"use client";

import { Check, ChevronRight } from "lucide-react";
import { useState } from "react";
import { DailyCheckInFlow } from "@/components/mobile/home/DailyCheckInFlow";
import { useDailyCheckIn } from "@/context/DailyCheckInContext";

export function DailyCheckInCard() {
  const {
    completedToday,
    completeCheckIn,
    skipWithNeutralAnswers,
    useTestAnswers,
  } = useDailyCheckIn();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="flex w-full items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 text-left transition active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full ${
              completedToday ? "bg-emerald-50" : "bg-zinc-100"
            }`}
          >
            {completedToday ? (
              <Check className="h-4 w-4 text-emerald-600" strokeWidth={2.5} />
            ) : (
              <span className="h-2 w-2 rounded-full bg-zinc-400" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-900">Daily check-in</p>
            <p className="text-xs text-zinc-500">
              {completedToday ? "Completed today" : "Not done yet"} · ~20 sec
            </p>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-zinc-400" strokeWidth={2.5} />
      </button>

      <DailyCheckInFlow
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onComplete={completeCheckIn}
        onSkipNeutral={skipWithNeutralAnswers}
        onUseTestAnswers={useTestAnswers}
      />
    </>
  );
}
