import {
  calculateHealthScore,
  getHealthStatus,
  type HealthCategoryId,
  type HealthScoreResult,
  type HealthStatus,
} from "@/lib/health-scoring";
import type { DogEmotionId } from "@/lib/dog-emotions";
import { healthProfile as baselineHealthProfile } from "@/lib/mock-data";

export const DAILY_CHECKIN_STORAGE_KEY = "mammaly-daily-checkin";

export type AnswerQuality = "good" | "neutral" | "poor";

export type CheckInQuestion = {
  id: string;
  categoryId: HealthCategoryId;
  question: string;
  options: { label: string; quality: AnswerQuality }[];
};

export const checkInQuestions: CheckInQuestion[] = [
  {
    id: "appetite",
    categoryId: "digestion",
    question: "How was appetite today?",
    options: [
      { label: "Good", quality: "good" },
      { label: "Okay", quality: "neutral" },
      { label: "Poor", quality: "poor" },
    ],
  },
  {
    id: "activity",
    categoryId: "movement",
    question: "Activity level today?",
    options: [
      { label: "Active", quality: "good" },
      { label: "Normal", quality: "neutral" },
      { label: "Low", quality: "poor" },
    ],
  },
  {
    id: "energy",
    categoryId: "cognition",
    question: "Energy and mood?",
    options: [
      { label: "Bright", quality: "good" },
      { label: "Normal", quality: "neutral" },
      { label: "Tired", quality: "poor" },
    ],
  },
  {
    id: "weight",
    categoryId: "weight",
    question: "Weight feeling today?",
    options: [
      { label: "Healthy", quality: "good" },
      { label: "Uncertain", quality: "neutral" },
      { label: "Heavy", quality: "poor" },
    ],
  },
  {
    id: "teeth",
    categoryId: "teeth",
    question: "Breath and teeth comfort?",
    options: [
      { label: "Fresh", quality: "good" },
      { label: "Okay", quality: "neutral" },
      { label: "Uncomfortable", quality: "poor" },
    ],
  },
];

const scoreDeltaByQuality: Record<AnswerQuality, number> = {
  good: 4,
  neutral: 0,
  poor: -6,
};

export type DailyCheckInAnswers = Record<string, string>;

export type DailyCheckInPersistedState = {
  lastCheckInDate: string;
  completedToday: boolean;
  todayAnswers: DailyCheckInAnswers;
  healthResult: HealthScoreResult;
};


function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function getBaselineHealthResult(): HealthScoreResult {
  return baselineHealthProfile;
}

function getQualityForAnswer(
  questionId: string,
  answerLabel: string,
): AnswerQuality {
  const question = checkInQuestions.find((item) => item.id === questionId);
  const option = question?.options.find((item) => item.label === answerLabel);
  return option?.quality ?? "neutral";
}

export function applyCheckInAnswers(
  baseResult: HealthScoreResult,
  answers: DailyCheckInAnswers,
): HealthScoreResult {
  const adjustedCategories = baseResult.categories.map((category) => {
    const relatedQuestion = checkInQuestions.find(
      (question) => question.categoryId === category.id,
    );
    if (!relatedQuestion) return category;

    const answerLabel = answers[relatedQuestion.id];
    if (!answerLabel) return category;

    const quality = getQualityForAnswer(relatedQuestion.id, answerLabel);
    const delta = scoreDeltaByQuality[quality];

    return {
      ...category,
      score: clampScore(category.score + delta),
    };
  });

  return calculateHealthScore(adjustedCategories);
}

export function buildNeutralAnswers(): DailyCheckInAnswers {
  return Object.fromEntries(
    checkInQuestions.map((question) => [
      question.id,
      question.options.find((option) => option.quality === "neutral")?.label ??
        question.options[1]?.label ??
        question.options[0].label,
    ]),
  );
}

export function buildTestAnswers(): DailyCheckInAnswers {
  return Object.fromEntries(
    checkInQuestions.map((question) => [
      question.id,
      question.options.find((option) => option.quality === "good")?.label ??
        question.options[0].label,
    ]),
  );
}

export function getEmotionForHealthStatus(status: HealthStatus): DogEmotionId {
  switch (status) {
    case "green":
      return "happy";
    case "yellow":
      return "curious";
    case "red":
      return "sleepy";
  }
}

export function getEmotionForOverallScore(overallScore: number): DogEmotionId {
  return getEmotionForHealthStatus(getHealthStatus(overallScore));
}

export function isCheckInCompletedToday(state: DailyCheckInPersistedState | null): boolean {
  if (!state) return false;
  return state.lastCheckInDate === getTodayKey() && state.completedToday;
}

export function getStoredDailyCheckInState(): DailyCheckInPersistedState | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(DAILY_CHECKIN_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as DailyCheckInPersistedState;
  } catch {
    return null;
  }
}

export function saveDailyCheckInState(state: DailyCheckInPersistedState): void {
  localStorage.setItem(DAILY_CHECKIN_STORAGE_KEY, JSON.stringify(state));
}

export function createCheckInStateFromAnswers(
  answers: DailyCheckInAnswers,
  baseResult?: HealthScoreResult,
): DailyCheckInPersistedState {
  const startingResult = baseResult ?? getBaselineHealthResult();
  const healthResult = applyCheckInAnswers(startingResult, answers);

  return {
    lastCheckInDate: getTodayKey(),
    completedToday: true,
    todayAnswers: answers,
    healthResult,
  };
}

export function getInitialHealthResult(): HealthScoreResult {
  const stored = getStoredDailyCheckInState();
  return stored?.healthResult ?? getBaselineHealthResult();
}
