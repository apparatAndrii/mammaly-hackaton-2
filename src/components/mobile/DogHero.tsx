"use client";

import Image from "next/image";
import { DogAvatar } from "@/components/mobile/DogAvatar";
import { useDailyCheckIn } from "@/context/DailyCheckInContext";
import { useDogProfile } from "@/context/DogProfileContext";
import { getProfilePhotoUrl, TEST_DOG_PROFILE } from "@/lib/dog-profile";

export function DogHero() {
  const { profile } = useDogProfile();
  const { emotion } = useDailyCheckIn();
  const activeProfile = profile ?? TEST_DOG_PROFILE;

  return (
    <section className="relative h-[300px] w-full shrink-0 overflow-hidden">
      <Image
        src="/park-background.png"
        alt=""
        fill
        priority
        sizes="390px"
        className="object-cover object-[center_35%]"
      />

      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/90 to-transparent" />

      <div className="absolute inset-x-0 top-[52px] flex flex-col items-center">
        <DogAvatar
          imageClassName="h-52 w-52"
          className="relative z-10"
          photoUrl={getProfilePhotoUrl(activeProfile)}
          name={activeProfile.name}
          emotionId={getProfilePhotoUrl(activeProfile) ? undefined : emotion}
        />
      </div>
    </section>
  );
}
