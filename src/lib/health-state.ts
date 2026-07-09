import type { DailyCheckInState } from "@/lib/daily-checkin";
import {
  calculateHealthScore,
  type HealthCategory,
  type HealthCategoryId,
  type HealthScoreResult,
} from "@/lib/health-scoring";
import { healthProfile as defaultHealthProfile } from "@/lib/mock-data";

export const HEALTH_STATE_STORAGE_KEY = "mammaly-health-state";

export const HEALTH_STATE_UPDATED_EVENT = "mammaly-health-updated";

function dispatchHealthUpdated(): void {
  window.dispatchEvent(new CustomEvent(HEALTH_STATE_UPDATED_EVENT));
}

export function getStoredHealthProfile(): HealthScoreResult | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(HEALTH_STATE_STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as {
      categories: Omit<HealthCategory, "status">[];
    };

    if (!Array.isArray(parsed.categories) || parsed.categories.length === 0) {
      return null;
    }

    return calculateHealthScore(parsed.categories);
  } catch {
    return null;
  }
}

export function saveHealthProfile(profile: HealthScoreResult): void {
  const categories = profile.categories.map(({ status: _status, ...rest }) => rest);
  localStorage.setItem(
    HEALTH_STATE_STORAGE_KEY,
    JSON.stringify({ categories }),
  );
  dispatchHealthUpdated();
}

export function getDefaultHealthProfile(): HealthScoreResult {
  return defaultHealthProfile;
}

function adjustScore(score: number, delta: number): number {
  return Math.max(0, Math.min(100, Math.round(score + delta)));
}

function applyCheckInDelta(
  categories: Omit<HealthCategory, "status">[],
  checkIn: DailyCheckInState,
): Omit<HealthCategory, "status">[] {
  const { appetite, energy, concerns } = checkIn.answers;
  const deltas: Partial<Record<HealthCategoryId, number>> = {};

  if (appetite === "Poor") {
    deltas.digestion = (deltas.digestion ?? 0) - 8;
  } else if (appetite === "Okay") {
    deltas.digestion = (deltas.digestion ?? 0) - 3;
  }

  if (energy === "Low") {
    deltas.cognition = (deltas.cognition ?? 0) - 6;
    deltas.movement = (deltas.movement ?? 0) - 4;
  } else if (energy === "High") {
    deltas.movement = (deltas.movement ?? 0) + 2;
    deltas.cognition = (deltas.cognition ?? 0) + 2;
  }

  if (concerns === "Notable") {
    const weakest = categories.reduce((min, category) =>
      category.score < min.score ? category : min,
    );
    deltas[weakest.id] = (deltas[weakest.id] ?? 0) - 5;
  } else if (concerns === "Mild") {
    const weakest = categories.reduce((min, category) =>
      category.score < min.score ? category : min,
    );
    deltas[weakest.id] = (deltas[weakest.id] ?? 0) - 2;
  }

  return categories.map((category) => ({
    ...category,
    score: adjustScore(category.score, deltas[category.id] ?? 0),
  }));
}

export function applyCheckInToHealthProfile(
  profile: HealthScoreResult,
  checkIn: DailyCheckInState,
): HealthScoreResult {
  const categoriesWithoutStatus = profile.categories.map(
    ({ status: _status, ...rest }) => rest,
  );
  const updated = applyCheckInDelta(categoriesWithoutStatus, checkIn);
  const result = calculateHealthScore(updated);
  saveHealthProfile(result);
  return result;
}

export function ensureHealthProfileInitialized(): HealthScoreResult {
  const stored = getStoredHealthProfile();
  if (stored) return stored;

  const initial = getDefaultHealthProfile();
  saveHealthProfile(initial);
  return initial;
}
