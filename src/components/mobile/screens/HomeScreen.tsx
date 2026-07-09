"use client";

import { DogHero } from "@/components/mobile/DogHero";
import { AgeComparisonRow } from "@/components/mobile/home/AgeComparisonRow";
import { DailyCheckInCard } from "@/components/mobile/home/DailyCheckInCard";
import { HealthCategoryGrid } from "@/components/mobile/home/HealthCategoryGrid";
import { MainRecommendation } from "@/components/mobile/home/MainRecommendation";
import { ProgressTrend } from "@/components/mobile/home/ProgressTrend";
import { useDailyCheckIn } from "@/context/DailyCheckInContext";
import { useDogProfile } from "@/context/DogProfileContext";
import { TEST_DOG_PROFILE } from "@/lib/dog-profile";
import { getNextRecommendation } from "@/lib/recommendations";

export function HomeScreen() {
  const { profile } = useDogProfile();
  const { healthResult, todayAnswers, completedToday, isHydrated } =
    useDailyCheckIn();
  const activeProfile = profile ?? TEST_DOG_PROFILE;

  const recommendation = getNextRecommendation(
    healthResult,
    { answers: todayAnswers, completedToday },
    activeProfile,
  );

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <DogHero />

      <div className="flex flex-1 flex-col gap-4 px-5 pb-12 pt-2">
        <AgeComparisonRow profile={activeProfile} />
        <DailyCheckInCard />
        <HealthCategoryGrid categories={healthResult.categories} />
        <ProgressTrend />
        <MainRecommendation recommendation={recommendation} />
      </div>
    </div>
  );
}
