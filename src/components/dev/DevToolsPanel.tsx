"use client";

import { useDailyCheckIn } from "@/context/DailyCheckInContext";
import { useDogProfile } from "@/context/DogProfileContext";
import { clearDailyCheckInStorage } from "@/lib/daily-checkin";
import { clearDogProfileStorage } from "@/lib/dog-profile";

type DevButtonProps = {
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
};

function DevButton({ label, onClick, variant = "default" }: DevButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition active:scale-[0.98] ${
        variant === "danger"
          ? "bg-red-50 text-red-700 hover:bg-red-100"
          : "bg-white text-zinc-700 ring-1 ring-zinc-200 hover:bg-zinc-50"
      }`}
    >
      {label}
    </button>
  );
}

export function DevToolsPanel() {
  const {
    onboardingCompleted,
    isHydrated: profileHydrated,
    resetOnboarding,
    skipWithTestData,
  } = useDogProfile();
  const {
    completedToday,
    isHydrated: checkInHydrated,
    resetCheckIn,
    skipWithNeutralAnswers,
    useTestAnswers,
  } = useDailyCheckIn();

  const screen = !profileHydrated
    ? "Loading"
    : !onboardingCompleted
      ? "Onboarding"
      : "Home";

  const clearAll = () => {
    clearDogProfileStorage();
    clearDailyCheckInStorage();
    window.location.reload();
  };

  return (
    <aside className="w-52 shrink-0">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-zinc-400">
        Dev tools
      </p>

      <div className="mb-4 rounded-xl bg-zinc-200/60 px-3 py-2 text-xs text-zinc-600">
        <p>
          Screen: <span className="font-medium text-zinc-900">{screen}</span>
        </p>
        {checkInHydrated && onboardingCompleted && (
          <p className="mt-1">
            Check-in:{" "}
            <span className="font-medium text-zinc-900">
              {completedToday ? "Done" : "Pending"}
            </span>
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <DevButton label="Open onboarding" onClick={resetOnboarding} />
        <DevButton label="Home (test dog)" onClick={skipWithTestData} />
        <DevButton label="Reset daily check-in" onClick={resetCheckIn} />
        <DevButton
          label="Complete check-in (good)"
          onClick={useTestAnswers}
        />
        <DevButton
          label="Complete check-in (neutral)"
          onClick={skipWithNeutralAnswers}
        />
        <DevButton label="Clear all data" onClick={clearAll} variant="danger" />
      </div>
    </aside>
  );
}
