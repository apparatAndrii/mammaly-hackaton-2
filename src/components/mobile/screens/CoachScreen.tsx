"use client";

import { BookOpen } from "lucide-react";
import { DailyCheckInCard } from "@/components/mobile/home/DailyCheckInCard";
import { FocusCard } from "@/components/mobile/home/FocusCard";
import { useDailyCheckIn } from "@/context/DailyCheckInContext";
import { useDogProfile } from "@/context/DogProfileContext";
import { getTodaysKnowledgeCard } from "@/lib/daily-deck";
import { TEST_DOG_PROFILE } from "@/lib/dog-profile";
import { getNextRecommendation } from "@/lib/recommendations";

export function CoachScreen() {
  const { profile } = useDogProfile();
  const { healthResult, todayAnswers, completedToday } = useDailyCheckIn();
  const activeProfile = profile ?? TEST_DOG_PROFILE;

  const recommendation = getNextRecommendation(
    healthResult,
    { answers: todayAnswers, completedToday },
    activeProfile,
  );
  const knowledgeCard = getTodaysKnowledgeCard();

  return (
    <div className="flex min-h-full flex-1 flex-col gap-4 bg-cream px-5 pb-8 pt-4">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-olive">
          Dein Tages-Deck
        </p>
        <h1 className="mt-1 font-display text-[26px] font-semibold leading-tight text-ink">
          Heute für {activeProfile.name}
        </h1>
      </header>

      <DailyCheckInCard />

      <FocusCard recommendation={recommendation} />

      <section className="rounded-3xl border border-cream-deep bg-paper px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-olive">
            <BookOpen className="h-3.5 w-3.5" strokeWidth={2} />
            Wissenskarte
          </p>
          <span className="rounded-full bg-cream px-2.5 py-1 text-[10px] font-semibold text-olive">
            {knowledgeCard.categoryLabel}
          </span>
        </div>

        <h2 className="mt-2 font-display text-[17px] font-semibold leading-snug text-ink">
          {knowledgeCard.title}
        </h2>
        <p className="mt-1.5 text-sm leading-6 text-ink/70">
          {knowledgeCard.text}
        </p>
        <p className="mt-3 text-[10px] text-olive/80">
          Täglich eine neue Karte — morgen aus einem anderen Bereich.
        </p>
      </section>
    </div>
  );
}
