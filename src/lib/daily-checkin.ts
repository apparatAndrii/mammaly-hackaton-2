import {
  calculateHealthScore,
  getHealthStatus,
  type HealthCategoryId,
  type HealthScoreResult,
  type HealthStatus,
} from "@/lib/health-scoring";
import type { DogEmotionId } from "@/lib/dog-emotions";
import { healthProfile as baselineHealthProfile, STREAK_SEED } from "@/lib/mock-data";

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
    question: "Wie war der Appetit heute?",
    options: [
      { label: "Gut", quality: "good" },
      { label: "Okay", quality: "neutral" },
      { label: "Schlecht", quality: "poor" },
    ],
  },
  {
    id: "activity",
    categoryId: "movement",
    question: "Wie aktiv war dein Hund heute?",
    options: [
      { label: "Sehr aktiv", quality: "good" },
      { label: "Normal", quality: "neutral" },
      { label: "Wenig", quality: "poor" },
    ],
  },
  {
    id: "energy",
    categoryId: "cognition",
    question: "Energie und Stimmung?",
    options: [
      { label: "Munter", quality: "good" },
      { label: "Normal", quality: "neutral" },
      { label: "Müde", quality: "poor" },
    ],
  },
  {
    id: "weight",
    categoryId: "weight",
    question: "Gewichtsgefühl heute?",
    options: [
      { label: "Gesund", quality: "good" },
      { label: "Unsicher", quality: "neutral" },
      { label: "Zu viel", quality: "poor" },
    ],
  },
  {
    id: "teeth",
    categoryId: "teeth",
    question: "Atem und Zähne?",
    options: [
      { label: "Frisch", quality: "good" },
      { label: "Okay", quality: "neutral" },
      { label: "Unangenehm", quality: "poor" },
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
  streakDays?: number;
};


function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getYesterdayKey(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function getBaselineHealthResult(): HealthScoreResult {
  return baselineHealthProfile;
}

export function getAnswerQuality(
  questionId: string,
  answerLabel: string | undefined,
): AnswerQuality {
  if (!answerLabel) return "neutral";
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

    const quality = getAnswerQuality(relatedQuestion.id, answerLabel);
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

export function getStreakDays(state: DailyCheckInPersistedState | null): number {
  return state?.streakDays ?? STREAK_SEED;
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

export function clearDailyCheckInStorage(): void {
  localStorage.removeItem(DAILY_CHECKIN_STORAGE_KEY);
}

export function createCheckInStateFromAnswers(
  answers: DailyCheckInAnswers,
  baseResult?: HealthScoreResult,
): DailyCheckInPersistedState {
  const startingResult = baseResult ?? getBaselineHealthResult();
  const healthResult = applyCheckInAnswers(startingResult, answers);
  const previous = getStoredDailyCheckInState();

  let streakDays = getStreakDays(previous);
  if (!previous || previous.lastCheckInDate === getYesterdayKey()) {
    streakDays += 1;
  } else if (previous.lastCheckInDate !== getTodayKey()) {
    streakDays = 1;
  }

  return {
    lastCheckInDate: getTodayKey(),
    completedToday: true,
    todayAnswers: answers,
    healthResult,
    streakDays,
  };
}

export function getInitialHealthResult(): HealthScoreResult {
  const stored = getStoredDailyCheckInState();
  return stored?.healthResult ?? getBaselineHealthResult();
}
