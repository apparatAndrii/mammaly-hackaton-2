"use client";

import { weeklyHealthTrend, weeklyScoreDelta } from "@/lib/mock-data";
import { getHealthStatusStyles } from "@/lib/health-styles";
import { getHealthStatus } from "@/lib/health-scoring";

function buildSparklinePath(
  scores: number[],
  width: number,
  height: number,
): string {
  if (scores.length === 0) return "";

  const min = Math.min(...scores) - 2;
  const max = Math.max(...scores) + 2;
  const range = max - min || 1;

  const points = scores.map((score, index) => {
    const x = (index / (scores.length - 1)) * width;
    const y = height - ((score - min) / range) * height;
    return `${x},${y}`;
  });

  return `M ${points.join(" L ")}`;
}

export function ProgressTrend() {
  const scores = weeklyHealthTrend.map((point) => point.score);
  const latestScore = scores[scores.length - 1] ?? 0;
  const status = getHealthStatus(latestScore);
  const styles = getHealthStatusStyles(status);
  const path = buildSparklinePath(scores, 240, 48);

  return (
    <section className="w-full rounded-2xl border border-zinc-100 bg-white px-4 py-3.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-400">
            Progress
          </p>
          <p className="mt-1 text-sm text-zinc-600">Health score · 7 days</p>
        </div>
        <p className={`text-sm font-semibold ${styles.text}`}>
          +{weeklyScoreDelta} pts this week
        </p>
      </div>

      <svg
        viewBox="0 0 240 48"
        className="mt-3 h-12 w-full"
        aria-hidden="true"
      >
        <path
          d={path}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={styles.text}
        />
      </svg>

      <div className="mt-2 flex justify-between text-[10px] text-zinc-400">
        {weeklyHealthTrend.map((point) => (
          <span key={point.day}>{point.day}</span>
        ))}
      </div>
    </section>
  );
}
