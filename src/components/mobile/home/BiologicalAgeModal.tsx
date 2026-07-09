"use client";

import { useEffect } from "react";
import { getBiologicalAgeBreakdown } from "@/lib/dog-biological-age";
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
  const breakdown = getBiologicalAgeBreakdown(profile.ageYears);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-900/20 p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-modal-title"
        className="w-full max-w-xs rounded-2xl border border-zinc-200 bg-white p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <h2
          id="age-modal-title"
          className="text-base font-semibold text-zinc-900"
        >
          How it&apos;s calculated
        </h2>

        <p className="mt-2 text-sm text-zinc-500">
          {profile.name} · {profile.ageYears} calendar years
        </p>

        <ul className="mt-4 space-y-3">
          {breakdown.steps.map((step) => (
            <li
              key={step.label}
              className="flex items-start justify-between gap-4 text-sm"
            >
              <span className="text-zinc-500">{step.label}</span>
              <span className="text-right text-zinc-900">{step.value}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4 text-sm">
          <span className="font-medium text-zinc-900">Biological age</span>
          <span className="font-semibold text-zinc-900">
            {breakdown.total} years
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-zinc-100 py-2.5 text-sm font-medium text-zinc-900 transition active:scale-[0.98]"
        >
          Close
        </button>
      </div>
    </div>
  );
}
