"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  buildNeutralAnswers,
  buildTestAnswers,
  clearDailyCheckInStorage,
  createCheckInStateFromAnswers,
  getBaselineHealthResult,
  getEmotionForOverallScore,
  getInitialHealthResult,
  getStoredDailyCheckInState,
  getStreakDays,
  isCheckInCompletedToday,
  saveDailyCheckInState,
  type DailyCheckInAnswers,
  type DailyCheckInPersistedState,
} from "@/lib/daily-checkin";
import type { DogEmotionId } from "@/lib/dog-emotions";
import type { HealthScoreResult } from "@/lib/health-scoring";

type DailyCheckInContextValue = {
  healthResult: HealthScoreResult;
  emotion: DogEmotionId;
  completedToday: boolean;
  isHydrated: boolean;
  streakDays: number;
  todayAnswers: DailyCheckInAnswers;
  completeCheckIn: (answers: DailyCheckInAnswers) => void;
  skipWithNeutralAnswers: () => void;
  useTestAnswers: () => void;
  resetCheckIn: () => void;
};

const DailyCheckInContext = createContext<DailyCheckInContextValue | null>(null);

export function DailyCheckInProvider({ children }: { children: ReactNode }) {
  const [healthResult, setHealthResult] = useState<HealthScoreResult>(
    getInitialHealthResult(),
  );
  const [completedToday, setCompletedToday] = useState(false);
  const [todayAnswers, setTodayAnswers] = useState<DailyCheckInAnswers>({});
  const [streakDays, setStreakDays] = useState(getStreakDays(null));
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = getStoredDailyCheckInState();
    if (stored) {
      setHealthResult(stored.healthResult);
      setTodayAnswers(stored.todayAnswers);
      setCompletedToday(isCheckInCompletedToday(stored));
      setStreakDays(getStreakDays(stored));
    }
    setIsHydrated(true);
  }, []);

  const applyState = useCallback((state: DailyCheckInPersistedState) => {
    saveDailyCheckInState(state);
    setHealthResult(state.healthResult);
    setTodayAnswers(state.todayAnswers);
    setCompletedToday(state.completedToday);
    setStreakDays(getStreakDays(state));
  }, []);

  const completeCheckIn = useCallback(
    (answers: DailyCheckInAnswers) => {
      const state = createCheckInStateFromAnswers(answers, healthResult);
      applyState(state);
    },
    [applyState, healthResult],
  );

  const skipWithNeutralAnswers = useCallback(() => {
    completeCheckIn(buildNeutralAnswers());
  }, [completeCheckIn]);

  const useTestAnswers = useCallback(() => {
    completeCheckIn(buildTestAnswers());
  }, [completeCheckIn]);

  const resetCheckIn = useCallback(() => {
    clearDailyCheckInStorage();
    setHealthResult(getBaselineHealthResult());
    setTodayAnswers({});
    setCompletedToday(false);
    setStreakDays(getStreakDays(null));
  }, []);

  const emotion = useMemo(
    () => getEmotionForOverallScore(healthResult.overallScore),
    [healthResult.overallScore],
  );

  const value = useMemo(
    () => ({
      healthResult,
      emotion,
      completedToday,
      isHydrated,
      streakDays,
      todayAnswers,
      completeCheckIn,
      skipWithNeutralAnswers,
      useTestAnswers,
      resetCheckIn,
    }),
    [
      healthResult,
      emotion,
      completedToday,
      isHydrated,
      streakDays,
      todayAnswers,
      completeCheckIn,
      skipWithNeutralAnswers,
      useTestAnswers,
      resetCheckIn,
    ],
  );

  return (
    <DailyCheckInContext.Provider value={value}>
      {children}
    </DailyCheckInContext.Provider>
  );
}

export function useDailyCheckIn() {
  const context = useContext(DailyCheckInContext);
  if (!context) {
    throw new Error("useDailyCheckIn must be used within DailyCheckInProvider");
  }
  return context;
}
