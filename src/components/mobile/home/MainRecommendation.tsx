"use client";

import type { Recommendation } from "@/lib/recommendations";
import type { HealthStatus } from "@/lib/health-scoring";
import { getHealthStatusStyles } from "@/lib/health-styles";

type MainRecommendationProps = {
  recommendation: Recommendation;
  status: HealthStatus;
};

export function MainRecommendation({
  recommendation,
  status,
}: MainRecommendationProps) {
  const styles = getHealthStatusStyles(status);

  return (
    <section
      className={`w-full rounded-2xl px-4 py-4 ring-1 ring-inset ${styles.badge}`}
    >
      <p className="text-xs font-medium uppercase tracking-[0.14em] opacity-80">
        Today&apos;s focus
      </p>
      <p className="mt-1 text-sm font-semibold">{recommendation.title}</p>
      <p className="mt-2 text-sm font-medium leading-5">{recommendation.action}</p>

      {recommendation.supplementNote ? (
        <p className="mt-2 text-xs leading-5 text-zinc-500">
          {recommendation.supplementNote}
        </p>
      ) : null}
    </section>
  );
}
