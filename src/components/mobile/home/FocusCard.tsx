"use client";

import { ArrowRight } from "lucide-react";
import type { Recommendation } from "@/lib/recommendations";

type FocusCardProps = {
  recommendation: Recommendation;
};

/** Genau eine priorisierte Handlungsempfehlung für den Fokusbereich. */
export function FocusCard({ recommendation }: FocusCardProps) {
  return (
    <section className="w-full rounded-3xl bg-cream-deep/60 px-5 py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-olive">
          Nächster Schritt
        </p>
        <span className="rounded-full bg-paper px-2.5 py-1 text-[10px] font-semibold text-olive">
          {recommendation.categoryLabel}
        </span>
      </div>

      <p className="mt-2 font-display text-[17px] font-semibold leading-snug text-ink">
        {recommendation.action}
      </p>

      <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-forest">
        <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
        {recommendation.title}
      </p>

      {recommendation.supplementNote ? (
        <p className="mt-3 border-t border-olive/15 pt-3 text-xs leading-5 text-olive">
          {recommendation.supplementNote}
        </p>
      ) : null}

      <p className="mt-3 text-[10px] leading-4 text-olive/80">
        Keine tierärztliche Diagnose — bei Auffälligkeiten bitte in die Praxis.
      </p>
    </section>
  );
}
