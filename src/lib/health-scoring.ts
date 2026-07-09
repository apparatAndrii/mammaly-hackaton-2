export type HealthCategoryId =
  | "weight"
  | "movement"
  | "digestion"
  | "cognition"
  | "teeth";

export type HealthStatus = "green" | "yellow" | "red";

export type HealthCategory = {
  id: HealthCategoryId;
  label: string;
  score: number;
  status: HealthStatus;
  insight: string;
};

export type HealthScoreResult = {
  categories: HealthCategory[];
  overallScore: number;
  overallStatus: HealthStatus;
  weakestCategory: HealthCategory;
};

export const healthStatusLabels: Record<HealthStatus, string> = {
  green: "Good",
  yellow: "Monitor",
  red: "Needs attention",
};

export function getHealthStatus(score: number): HealthStatus {
  if (score >= 80) return "green";
  if (score >= 60) return "yellow";
  return "red";
}

export function calculateHealthScore(
  categories: Omit<HealthCategory, "status">[],
): HealthScoreResult {
  const scoredCategories: HealthCategory[] = categories.map((category) => ({
    ...category,
    status: getHealthStatus(category.score),
  }));

  const overallScore = Math.round(
    scoredCategories.reduce((sum, category) => sum + category.score, 0) /
      scoredCategories.length,
  );

  const weakestCategory = scoredCategories.reduce((weakest, current) =>
    current.score < weakest.score ? current : weakest,
  );

  return {
    categories: scoredCategories,
    overallScore,
    overallStatus: getHealthStatus(overallScore),
    weakestCategory,
  };
}
