"use client";

import Image from "next/image";
import { DogAvatar } from "@/components/mobile/DogAvatar";
import { useDailyCheckIn } from "@/context/DailyCheckInContext";
import { getCoachQuote } from "@/lib/coach";
import { getProfilePhotoUrl, type DogProfile } from "@/lib/dog-profile";

type DogCardProps = {
  profile: DogProfile;
};

export function DogCard({ profile }: DogCardProps) {
  const { emotion, healthResult, completedToday } = useDailyCheckIn();
  const photoUrl = getProfilePhotoUrl(profile);
  const quote = getCoachQuote(healthResult, completedToday);

  return (
    <section className="rounded-3xl bg-peach p-3">
      <div className="relative flex h-[230px] items-center justify-center overflow-hidden rounded-2xl bg-peach-soft">
        <span className="absolute right-3 top-3 z-10 rounded-full bg-paper/90 px-3 py-1 text-[11px] font-medium text-ink/80">
          {profile.name} · {profile.breed} · {profile.ageYears} J.
        </span>

        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={`${profile.name} Profilfoto`}
            fill
            sizes="360px"
            priority
            className="object-cover"
          />
        ) : (
          <DogAvatar
            imageClassName="h-44 w-44"
            name={profile.name}
            emotionId={emotion}
          />
        )}
      </div>

      <div className="mt-2 rounded-2xl bg-paper/75 px-4 py-3.5">
        <p className="font-display text-[15px] leading-snug text-ink">
          {quote}
        </p>
        <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-olive">
          {profile.name} · gerade eben
        </p>
      </div>
    </section>
  );
}
