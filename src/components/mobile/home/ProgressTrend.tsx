"use client";

import { useDailyCheckIn } from "@/context/DailyCheckInContext";
import {
  formatDE,
  getBioAgeHistory,
  type BioAgePoint,
} from "@/lib/dog-biological-age";
import type { DogProfile } from "@/lib/dog-profile";

type ProgressTrendProps = {
  profile: DogProfile;
  expanded?: boolean;
};

function buildSparklinePath(
  values: number[],
  width: number,
  height: number,
): string {
  if (values.length === 0) return "";

  const min = Math.min(...values) - 0.1;
  const max = Math.max(...values) + 0.1;
  const range = max - min || 1;

  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  });

  return `M ${points.join(" L ")}`;
}

export function ProgressTrend({ profile, expanded = false }: ProgressTrendProps) {
  const { healthResult } = useDailyCheckIn();
  const history: BioAgePoint[] = getBioAgeHistory(
    profile,
    healthResult.overallScore,
  );

  const values = history.map((point) => point.biologicalYears);
  const first = values[0];
  const last = values[values.length - 1];
  const delta = Math.round((last - first) * 10) / 10;
  const improved = delta < 0;

  const height = expanded ? 72 : 48;
  const path = buildSparklinePath(values, 240, height);

  return (
    <section className="w-full rounded-3xl border border-cream-deep bg-paper px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-olive">
            Verlauf
          </p>
          <p className="mt-1 text-sm text-ink/70">
            Biologisches Alter · 3 Wochen
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            improved ? "bg-moss text-forest" : "bg-red-50 text-red-700"
          }`}
        >
          {improved ? "−" : "+"}
          {formatDE(Math.abs(delta))} J.
        </span>
      </div>

      <svg
        viewBox={`0 0 240 ${height}`}
        className="mt-3 w-full"
        style={{ height }}
        aria-hidden="true"
      >
        <path
          d={path}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-forest"
        />
      </svg>

      <div className="mt-2 flex justify-between text-[10px] text-olive">
        <span>{history[0].label}</span>
        <span>{history[history.length - 1].label}</span>
      </div>

      {expanded && (
        <p className="mt-3 border-t border-cream-deep pt-3 text-xs leading-5 text-olive">
          Jeder Check-in aktualisiert die Kategorie-Scores — und damit das
          Alterstempo. Kleine Routinen, sichtbarer Effekt.
        </p>
      )}
    </section>
  );
}
