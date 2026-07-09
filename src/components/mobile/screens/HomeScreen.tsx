"use client";

import { BiologicalAgeCard } from "@/components/mobile/home/BiologicalAgeCard";
import { DailyCheckInCard } from "@/components/mobile/home/DailyCheckInCard";
import { DogCard } from "@/components/mobile/home/DogCard";
import { FocusCard } from "@/components/mobile/home/FocusCard";
import { GreetingHeader } from "@/components/mobile/home/GreetingHeader";
import { HealthCategoryGrid } from "@/components/mobile/home/HealthCategoryGrid";
import { ProgressTrend } from "@/components/mobile/home/ProgressTrend";
import type { TabId } from "@/components/mobile/TabBar";
import { useDailyCheckIn } from "@/context/DailyCheckInContext";
import { useDogProfile } from "@/context/DogProfileContext";
import { TEST_DOG_PROFILE } from "@/lib/dog-profile";
import { getNextRecommendation } from "@/lib/recommendations";

type HomeScreenProps = {
  onNavigate: (tab: TabId) => void;
};

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { profile } = useDogProfile();
  const { healthResult, todayAnswers, completedToday, streakDays, isHydrated } =
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
    <div className="flex min-h-full flex-1 flex-col gap-4 bg-cream px-5 pb-8 pt-4">
      <GreetingHeader dogName={activeProfile.name} streakDays={streakDays} />
      <DogCard profile={activeProfile} />
      <BiologicalAgeCard profile={activeProfile} />
      <DailyCheckInCard />
      <FocusCard recommendation={recommendation} />
      <HealthCategoryGrid
        categories={healthResult.categories}
        weakestId={healthResult.weakestCategory.id}
        onSeeAll={() => onNavigate("health")}
      />
      <ProgressTrend profile={activeProfile} />
    </div>
  );
}
