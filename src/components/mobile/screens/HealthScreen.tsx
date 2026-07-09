"use client";

import { ArrowRight } from "lucide-react";
import { useDailyCheckIn } from "@/context/DailyCheckInContext";
import { useDogProfile } from "@/context/DogProfileContext";
import { TEST_DOG_PROFILE } from "@/lib/dog-profile";
import { healthStatusLabels, type HealthCategory } from "@/lib/health-scoring";
import { getHealthStatusStyles } from "@/lib/health-styles";
import { getNextRecommendation } from "@/lib/recommendations";

function CategoryRow({
  category,
  isWeakest,
  nextStep,
}: {
  category: HealthCategory;
  isWeakest: boolean;
  nextStep?: string;
}) {
  const styles = getHealthStatusStyles(category.status);

  return (
    <div
      className={`rounded-3xl border bg-paper px-5 py-4 ${
        isWeakest ? "border-amber-300 ring-1 ring-amber-200" : "border-cream-deep"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${styles.dot}`} />
          <p className="text-sm font-semibold text-ink">{category.label}</p>
        </div>
        <p className={`text-[11px] font-semibold ${styles.text}`}>
          {healthStatusLabels[category.status]}
        </p>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="h-1.5 flex-1 rounded-full bg-cream-deep">
          <div
            className={`h-full rounded-full ${styles.bar}`}
            style={{ width: `${category.score}%` }}
          />
        </div>
        <p className="w-8 text-right text-sm font-semibold tabular-nums text-ink">
          {category.score}
        </p>
      </div>

      <p className="mt-2 text-xs leading-5 text-olive">{category.insight}</p>

      {isWeakest && nextStep && (
        <p className="mt-3 flex items-start gap-1.5 rounded-2xl bg-cream px-3.5 py-2.5 text-xs font-medium leading-5 text-forest">
          <ArrowRight className="mt-0.5 h-3 w-3 shrink-0" strokeWidth={2.5} />
          {nextStep}
        </p>
      )}
    </div>
  );
}

export function HealthScreen() {
  const { profile } = useDogProfile();
  const { healthResult, todayAnswers, completedToday } = useDailyCheckIn();
  const activeProfile = profile ?? TEST_DOG_PROFILE;

  const recommendation = getNextRecommendation(
    healthResult,
    { answers: todayAnswers, completedToday },
    activeProfile,
  );

  // Fokusbereich zuerst anzeigen
  const sorted = [...healthResult.categories].sort((a, b) =>
    a.id === healthResult.weakestCategory.id
      ? -1
      : b.id === healthResult.weakestCategory.id
        ? 1
        : 0,
  );

  return (
    <div className="flex min-h-full flex-1 flex-col gap-4 bg-cream px-5 pb-8 pt-4">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-olive">
          Gesamt-Score {healthResult.overallScore}/100
        </p>
        <h1 className="mt-1 font-display text-[26px] font-semibold leading-tight text-ink">
          {activeProfile.name}s Gesundheit
        </h1>
      </header>

      <div className="flex flex-col gap-3">
        {sorted.map((category) => (
          <CategoryRow
            key={category.id}
            category={category}
            isWeakest={category.id === healthResult.weakestCategory.id}
            nextStep={
              recommendation.categoryId === category.id
                ? recommendation.action
                : undefined
            }
          />
        ))}
      </div>

      <p className="text-[10px] leading-4 text-olive/80">
        Scores basieren auf deinen Check-ins. Keine tierärztliche Diagnose —
        bei Auffälligkeiten bitte in die Praxis.
      </p>
    </div>
  );
}
