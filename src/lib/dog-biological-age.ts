import type { DogProfile } from "@/lib/dog-profile";
import { healthTrend } from "@/lib/mock-data";

/**
 * Alterungs-Engine: rasse-/größenspezifische Referenzkurve (über das Gewicht
 * angenähert) als Basis, die 5 Kategorie-Scores verschieben das Tempo.
 * Wird nach jedem Check-in neu berechnet — kein einmaliger Age-Calculator.
 */

export type AgingMetrics = {
  chronologicalYears: number;
  biologicalYears: number;
  /** 1,0× = erwartungsgemäß, <1,0× = langsamer, >1,0× = schneller */
  agingSpeed: number;
  baseFactor: number;
  scoreAdjustment: number;
  /** Prozent langsamer (positiv) bzw. schneller (negativ) als erwartet */
  percentDelta: number;
  isSlower: boolean;
};

const NEUTRAL_SCORE = 70;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function round(value: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

/** Kleine Rassen altern langsamer, große schneller (Referenzkurve). */
export function getBreedBaseFactor(weightKg: number): number {
  if (weightKg < 10) return 0.97;
  if (weightKg <= 25) return 1.0;
  return 1.05;
}

export function calculateAgingSpeed(
  weightKg: number,
  overallScore: number,
): number {
  const base = getBreedBaseFactor(weightKg);
  const adjustment = -(overallScore - NEUTRAL_SCORE) * 0.01;
  return round(clamp(base + adjustment, 0.5, 1.5), 2);
}

export function calculateAgingMetrics(
  profile: DogProfile,
  overallScore: number,
): AgingMetrics {
  const baseFactor = getBreedBaseFactor(profile.weightKg);
  const agingSpeed = calculateAgingSpeed(profile.weightKg, overallScore);

  return {
    chronologicalYears: profile.ageYears,
    biologicalYears: round(profile.ageYears * agingSpeed, 1),
    agingSpeed,
    baseFactor,
    scoreAdjustment: round(agingSpeed - baseFactor, 2),
    percentDelta: Math.round((1 - agingSpeed) * 100),
    isSlower: agingSpeed < 1,
  };
}

export type BioAgePoint = {
  label: string;
  biologicalYears: number;
  agingSpeed: number;
};

/** Verlauf des biologischen Alters über die letzten Wochen (letzter Punkt live). */
export function getBioAgeHistory(
  profile: DogProfile,
  currentOverallScore: number,
): BioAgePoint[] {
  const scores = healthTrend.map((point, index) =>
    index === healthTrend.length - 1 ? currentOverallScore : point.score,
  );

  return scores.map((score, index) => {
    const speed = calculateAgingSpeed(profile.weightKg, score);
    return {
      label: healthTrend[index].label,
      biologicalYears: round(profile.ageYears * speed, 1),
      agingSpeed: speed,
    };
  });
}

/** Vergleichstext zur Entwicklung seit Beginn des Verlaufs. */
export function getSpeedComparison(
  profile: DogProfile,
  currentOverallScore: number,
): { deltaSpeed: number; text: string } {
  const history = getBioAgeHistory(profile, currentOverallScore);
  const first = history[0].agingSpeed;
  const last = history[history.length - 1].agingSpeed;
  const deltaSpeed = round(last - first, 2);

  const text =
    deltaSpeed < 0
      ? "besser als vor 3 Wochen"
      : deltaSpeed > 0
        ? "schlechter als vor 3 Wochen"
        : "stabil seit 3 Wochen";

  return { deltaSpeed, text };
}

/** Deutsche Zahlformatierung, z. B. 6,2 */
export function formatDE(value: number, digits = 1): string {
  return value.toLocaleString("de-DE", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}
