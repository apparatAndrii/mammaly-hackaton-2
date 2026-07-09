"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DogHero } from "@/components/mobile/DogHero";
import { AgeComparisonRow } from "@/components/mobile/home/AgeComparisonRow";
import { DailyCheckInCard } from "@/components/mobile/home/DailyCheckInCard";
import { HealthCategoryGrid } from "@/components/mobile/home/HealthCategoryGrid";
import { MainRecommendation } from "@/components/mobile/home/MainRecommendation";
import { ProgressTrend } from "@/components/mobile/home/ProgressTrend";
import { useDogProfile } from "@/context/DogProfileContext";
import {
  CHECK_IN_UPDATED_EVENT,
  getStoredDailyCheckIn,
  getTodayKey,
} from "@/lib/daily-checkin";
import { TEST_DOG_PROFILE } from "@/lib/dog-profile";
import {
  ensureHealthProfileInitialized,
  HEALTH_STATE_UPDATED_EVENT,
} from "@/lib/health-state";
import type { HealthScoreResult } from "@/lib/health-scoring";
import { getNextRecommendation } from "@/lib/recommendations";

export function HomeScreen() {
  const { profile } = useDogProfile();
  const activeProfile = profile ?? TEST_DOG_PROFILE;
  const [healthProfile, setHealthProfile] = useState<HealthScoreResult | null>(
    null,
  );
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshHomeData = useCallback(() => {
    setHealthProfile(ensureHealthProfileInitialized());
    setRefreshKey((current) => current + 1);
  }, []);

  useEffect(() => {
    refreshHomeData();
  }, [refreshHomeData]);

  useEffect(() => {
    const onUpdate = () => refreshHomeData();

    window.addEventListener(CHECK_IN_UPDATED_EVENT, onUpdate);
    window.addEventListener(HEALTH_STATE_UPDATED_EVENT, onUpdate);
    return () => {
      window.removeEventListener(CHECK_IN_UPDATED_EVENT, onUpdate);
      window.removeEventListener(HEALTH_STATE_UPDATED_EVENT, onUpdate);
    };
  }, [refreshHomeData]);

  const checkInState = useMemo(() => {
    void refreshKey;
    const stored = getStoredDailyCheckIn();
    if (stored?.date === getTodayKey()) return stored;
    return undefined;
  }, [refreshKey]);

  const recommendation = useMemo(() => {
    if (!healthProfile) return null;
    return getNextRecommendation(healthProfile, checkInState, activeProfile);
  }, [healthProfile, checkInState, activeProfile]);

  if (!healthProfile || !recommendation) {
    return null;
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <DogHero />

      <div className="flex flex-1 flex-col gap-4 px-5 pb-12 pt-2">
        <AgeComparisonRow profile={activeProfile} />
        <DailyCheckInCard />
        <HealthCategoryGrid categories={healthProfile.categories} />
        <ProgressTrend />
        <MainRecommendation
          recommendation={recommendation}
          status={healthProfile.weakestCategory.status}
        />
      </div>
    </div>
  );
}
