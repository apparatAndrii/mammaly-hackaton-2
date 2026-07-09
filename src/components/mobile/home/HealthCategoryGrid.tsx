"use client";

import type { HealthCategory } from "@/lib/health-scoring";
import { getHealthStatusStyles } from "@/lib/health-styles";

type HealthCategoryGridProps = {
  categories: HealthCategory[];
};

function HealthCard({ category }: { category: HealthCategory }) {
  const styles = getHealthStatusStyles(category.status);

  return (
    <div className="rounded-2xl border border-zinc-100 bg-white px-3 py-3">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 shrink-0 rounded-full ${styles.dot}`} />
        <span className="truncate text-xs text-zinc-600">{category.label}</span>
      </div>
      <p className="mt-2 text-xl font-semibold tabular-nums text-zinc-900">
        {category.score}
      </p>
    </div>
  );
}

export function HealthCategoryGrid({ categories }: HealthCategoryGridProps) {
  return (
    <section className="w-full">
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-zinc-400">
        Health categories
      </p>
      <div className="grid grid-cols-2 gap-2">
        {categories.map((category) => (
          <HealthCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}
