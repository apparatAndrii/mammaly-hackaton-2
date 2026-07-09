"use client";

import { useState } from "react";
import { calculateDogBiologicalAge } from "@/lib/dog-biological-age";
import type { DogProfile } from "@/lib/dog-profile";
import { BiologicalAgeModal } from "./BiologicalAgeModal";

type AgeComparisonRowProps = {
  profile: DogProfile;
};

export function AgeComparisonRow({ profile }: AgeComparisonRowProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const biologicalAge = calculateDogBiologicalAge(profile.ageYears);

  return (
    <>
      <section className="w-full">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-zinc-900">
              {profile.name}
            </h2>
            <p className="text-sm text-zinc-500">{profile.breed}</p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-400">
              Calendar age
            </p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900">
              {profile.ageYears}
            </p>
            <p className="text-xs text-zinc-500">years</p>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="rounded-2xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-left transition active:scale-[0.99]"
            aria-haspopup="dialog"
            aria-expanded={modalOpen}
          >
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-400">
              Biological age
            </p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-zinc-900">
              {biologicalAge}
            </p>
            <p className="text-xs text-zinc-500">years · tap to explain</p>
          </button>
        </div>
      </section>

      <BiologicalAgeModal
        profile={profile}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
