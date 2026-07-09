"use client";

import { ChevronRight } from "lucide-react";
import { healthStatusLabels, type HealthCategory } from "@/lib/health-scoring";
import { getHealthStatusStyles } from "@/lib/health-styles";

type HealthCategoryGridProps = {
  categories: HealthCategory[];
  weakestId?: string;
  onSeeAll?: () => void;
};

function HealthCard({
  category,
  isWeakest,
}: {
  category: HealthCategory;
  isWeakest: boolean;
}) {
  const styles = getHealthStatusStyles(category.status);

  return (
    <div
      className={`rounded-2xl border bg-paper px-3.5 py-3 ${
        isWeakest ? "border-amber-300 ring-1 ring-amber-200" : "border-cream-deep"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 shrink-0 rounded-full ${styles.dot}`} />
        <span className="truncate text-xs font-medium text-ink/80">
          {category.label}
        </span>
      </div>
      <div className="mt-2 flex items-baseline justify-between gap-2">
        <p className="text-xl font-semibold tabular-nums text-ink">
          {category.score}
        </p>
        <p className={`text-[10px] font-semibold ${styles.text}`}>
          {isWeakest ? "Fokus" : healthStatusLabels[category.status]}
        </p>
      </div>
    </div>
  );
}

export function HealthCategoryGrid({
  categories,
  weakestId,
  onSeeAll,
}: HealthCategoryGridProps) {
  return (
    <section className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-olive">
          5 Gesundheitsbereiche
        </p>
        {onSeeAll && (
          <button
            type="button"
            onClick={onSeeAll}
            className="flex items-center gap-0.5 text-xs font-medium text-forest"
          >
            Alle ansehen
            <ChevronRight className="h-3 w-3" strokeWidth={2.5} />
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {categories.map((category) => (
          <HealthCard
            key={category.id}
            category={category}
            isWeakest={category.id === weakestId}
          />
        ))}
      </div>
    </section>
  );
}
