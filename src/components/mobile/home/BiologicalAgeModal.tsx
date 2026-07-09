"use client";

import { useEffect } from "react";
import { useDailyCheckIn } from "@/context/DailyCheckInContext";
import { calculateAgingMetrics, formatDE } from "@/lib/dog-biological-age";
import type { DogProfile } from "@/lib/dog-profile";

type BiologicalAgeModalProps = {
  profile: DogProfile;
  open: boolean;
  onClose: () => void;
};

export function BiologicalAgeModal({
  profile,
  open,
  onClose,
}: BiologicalAgeModalProps) {
  const { healthResult } = useDailyCheckIn();
  const metrics = calculateAgingMetrics(profile, healthResult.overallScore);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const rows = [
    {
      label: `Referenzkurve (${formatDE(profile.weightKg)} kg)`,
      value: `${formatDE(metrics.baseFactor, 2)}×`,
    },
    {
      label: `Gesundheits-Score (${healthResult.overallScore}/100)`,
      value: `${metrics.scoreAdjustment <= 0 ? "−" : "+"}${formatDE(
        Math.abs(metrics.scoreAdjustment),
        2,
      )}×`,
    },
    {
      label: "Alterstempo",
      value: `${formatDE(metrics.agingSpeed, 2)}×`,
    },
  ];

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-ink/25 p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-modal-title"
        className="w-full max-w-xs rounded-3xl bg-paper p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id="age-modal-title"
          className="font-display text-lg font-semibold text-ink"
        >
          So rechnen wir
        </h2>

        <p className="mt-1 text-sm text-olive">
          Rasse-Referenzkurve × deine täglichen Check-ins in 5
          Gesundheitsbereichen.
        </p>

        <ul className="mt-4 space-y-3">
          {rows.map((row) => (
            <li
              key={row.label}
              className="flex items-start justify-between gap-4 text-sm"
            >
              <span className="text-olive">{row.label}</span>
              <span className="tabular-nums font-medium text-ink">
                {row.value}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between border-t border-cream-deep pt-4 text-sm">
          <span className="font-medium text-ink">
            {formatDE(metrics.chronologicalYears)} J. ×{" "}
            {formatDE(metrics.agingSpeed, 2)}
          </span>
          <span className="font-display text-base font-semibold text-forest">
            {formatDE(metrics.biologicalYears)} Jahre
          </span>
        </div>

        <p className="mt-3 text-[11px] leading-4 text-olive">
          Keine tierärztliche Diagnose — bei Auffälligkeiten bitte in die
          Praxis.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-xl bg-forest py-2.5 text-sm font-medium text-white transition active:scale-[0.98]"
        >
          Alles klar
        </button>
      </div>
    </div>
  );
}
