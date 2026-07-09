"use client";

import { Flame, Gauge } from "lucide-react";
import { ProgressTrend } from "@/components/mobile/home/ProgressTrend";
import { useDailyCheckIn } from "@/context/DailyCheckInContext";
import { useDogProfile } from "@/context/DogProfileContext";
import {
  calculateAgingMetrics,
  formatDE,
  getSpeedComparison,
} from "@/lib/dog-biological-age";
import { TEST_DOG_PROFILE } from "@/lib/dog-profile";

export function JourneyScreen() {
  const { profile } = useDogProfile();
  const { healthResult, streakDays, completedToday } = useDailyCheckIn();
  const activeProfile = profile ?? TEST_DOG_PROFILE;

  const metrics = calculateAgingMetrics(
    activeProfile,
    healthResult.overallScore,
  );
  const comparison = getSpeedComparison(
    activeProfile,
    healthResult.overallScore,
  );

  return (
    <div className="flex min-h-full flex-1 flex-col gap-4 bg-cream px-5 pb-8 pt-4">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-olive">
          Eure gemeinsame Reise
        </p>
        <h1 className="mt-1 font-display text-[26px] font-semibold leading-tight text-ink">
          {activeProfile.name}s Journey
        </h1>
      </header>

      <ProgressTrend profile={activeProfile} expanded />

      <div className="grid grid-cols-2 gap-3">
        <section className="rounded-3xl border border-cream-deep bg-paper px-4 py-4">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-olive">
            <Gauge className="h-3.5 w-3.5" strokeWidth={2} />
            Tempo
          </p>
          <p className="mt-2 font-display text-3xl font-semibold text-ink">
            {formatDE(metrics.agingSpeed, 2)}×
          </p>
          <p className="mt-1 text-[11px] leading-4 text-olive">
            {comparison.text}
          </p>
        </section>

        <section className="rounded-3xl border border-cream-deep bg-paper px-4 py-4">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-olive">
            <Flame className="h-3.5 w-3.5" strokeWidth={2} />
            Serie
          </p>
          <p className="mt-2 font-display text-3xl font-semibold text-ink">
            {streakDays}
            <span className="text-base text-olive"> Tage</span>
          </p>
          <p className="mt-1 text-[11px] leading-4 text-olive">
            {completedToday
              ? "Heute schon eingecheckt"
              : "Check-in hält die Serie am Leben"}
          </p>
        </section>
      </div>

      <section className="rounded-3xl bg-moss px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-forest/70">
          Meilenstein
        </p>
        <p className="mt-1.5 font-display text-[17px] font-semibold leading-snug text-forest">
          {metrics.isSlower
            ? `${activeProfile.name} altert aktuell ${Math.abs(
                metrics.percentDelta,
              )} % langsamer als erwartet.`
            : `${activeProfile.name} braucht gerade etwas Unterstützung — der Fokusbereich zeigt dir wie.`}
        </p>
        <p className="mt-1.5 text-xs leading-5 text-forest/80">
          Biologisch {formatDE(metrics.biologicalYears)} statt{" "}
          {formatDE(metrics.chronologicalYears)} Jahre — dranbleiben lohnt
          sich.
        </p>
      </section>
    </div>
  );
}
