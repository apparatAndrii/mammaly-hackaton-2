"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import { useDailyCheckIn } from "@/context/DailyCheckInContext";
import {
  calculateAgingMetrics,
  formatDE,
  getSpeedComparison,
} from "@/lib/dog-biological-age";
import type { DogProfile } from "@/lib/dog-profile";
import { BiologicalAgeModal } from "./BiologicalAgeModal";

type BiologicalAgeCardProps = {
  profile: DogProfile;
};

export function BiologicalAgeCard({ profile }: BiologicalAgeCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { healthResult } = useDailyCheckIn();
  const metrics = calculateAgingMetrics(profile, healthResult.overallScore);
  const comparison = getSpeedComparison(profile, healthResult.overallScore);

  // Slider-Position: 0,5× … 1,5× auf 0 … 100 %
  const knobPercent = Math.max(
    0,
    Math.min(100, (metrics.agingSpeed - 0.5) * 100),
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={modalOpen}
        className="w-full rounded-3xl border border-cream-deep bg-paper px-5 py-4 text-left transition active:scale-[0.99]"
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-olive">
            Biologisches Alter
          </p>
          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              metrics.isSlower
                ? "bg-moss text-forest"
                : "bg-red-50 text-red-700"
            }`}
          >
            {metrics.isSlower ? (
              <TrendingDown className="h-3 w-3" strokeWidth={2.4} />
            ) : (
              <TrendingUp className="h-3 w-3" strokeWidth={2.4} />
            )}
            {Math.abs(metrics.percentDelta)}%{" "}
            {metrics.isSlower ? "langsamer" : "schneller"}
          </span>
        </div>

        <p className="mt-2 flex items-baseline gap-2">
          <span className="font-display text-[44px] font-semibold leading-none text-ink">
            {formatDE(metrics.biologicalYears)}
          </span>
          <span className="text-sm text-olive">
            von {formatDE(metrics.chronologicalYears)} Jahren
          </span>
        </p>

        <div className="mt-4">
          <div className="flex justify-between text-[10px] font-medium tabular-nums text-olive">
            <span>0,5×</span>
            <span>1,0×</span>
            <span>1,5×</span>
          </div>
          <div className="relative mt-1 h-1.5 rounded-full bg-cream-deep">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-forest"
              style={{ width: `${knobPercent}%` }}
            />
            <span className="absolute left-1/2 top-1/2 h-2.5 w-px -translate-y-1/2 bg-olive/40" />
            <span
              className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-paper bg-forest shadow-sm"
              style={{ left: `${knobPercent}%` }}
            />
          </div>
        </div>

        <p className="mt-3 text-xs text-olive">
          Aging Speed{" "}
          <span className="font-semibold text-ink">
            {formatDE(metrics.agingSpeed, 2)}×
          </span>{" "}
          · {comparison.text}
        </p>
      </button>

      <BiologicalAgeModal
        profile={profile}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
