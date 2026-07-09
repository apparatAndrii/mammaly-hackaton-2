"use client";

import { Bell, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { DogAvatar } from "@/components/mobile/DogAvatar";
import { useDailyCheckIn } from "@/context/DailyCheckInContext";
import { useDogProfile } from "@/context/DogProfileContext";
import { getProfilePhotoUrl, TEST_DOG_PROFILE } from "@/lib/dog-profile";

const REMINDER_STORAGE_KEY = "mammaly-checkin-reminder";

export function ProfileScreen() {
  const { profile, resetOnboarding } = useDogProfile();
  const { emotion, resetCheckIn } = useDailyCheckIn();
  const activeProfile = profile ?? TEST_DOG_PROFILE;
  const photoUrl = getProfilePhotoUrl(activeProfile);

  // Screen wird erst nach der Hydration gemountet — direktes Lesen ist sicher.
  const [reminderOn, setReminderOn] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem(REMINDER_STORAGE_KEY) === "true",
  );

  const toggleReminder = () => {
    const next = !reminderOn;
    setReminderOn(next);
    localStorage.setItem(REMINDER_STORAGE_KEY, String(next));
  };

  const handleReset = () => {
    resetCheckIn();
    resetOnboarding();
  };

  const facts = [
    { label: "Alter", value: `${activeProfile.ageYears} Jahre` },
    {
      label: "Geschlecht",
      value: activeProfile.sex === "male" ? "Rüde" : "Hündin",
    },
    { label: "Kastriert", value: activeProfile.neutered ? "Ja" : "Nein" },
    {
      label: "Gewicht",
      value: `${activeProfile.weightKg.toLocaleString("de-DE")} kg`,
    },
  ];

  return (
    <div className="flex min-h-full flex-1 flex-col gap-4 bg-cream px-5 pb-8 pt-4">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-olive">
          Profil
        </p>
        <h1 className="mt-1 font-display text-[26px] font-semibold leading-tight text-ink">
          {activeProfile.name}
        </h1>
        <p className="text-sm text-olive">{activeProfile.breed}</p>
      </header>

      <section className="rounded-3xl bg-peach p-3">
        <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-2xl bg-peach-soft">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={`${activeProfile.name} Profilfoto`}
              fill
              sizes="360px"
              className="object-cover"
            />
          ) : (
            <DogAvatar
              imageClassName="h-32 w-32"
              name={activeProfile.name}
              emotionId={emotion}
            />
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-cream-deep bg-paper px-5 py-2">
        {facts.map((fact, index) => (
          <div
            key={fact.label}
            className={`flex items-center justify-between py-3 text-sm ${
              index > 0 ? "border-t border-cream-deep" : ""
            }`}
          >
            <span className="text-olive">{fact.label}</span>
            <span className="font-medium text-ink">{fact.value}</span>
          </div>
        ))}
      </section>

      <button
        type="button"
        onClick={toggleReminder}
        className="flex w-full items-center justify-between rounded-3xl border border-cream-deep bg-paper px-5 py-4 text-left transition active:scale-[0.99]"
      >
        <span className="flex items-center gap-3">
          <Bell className="h-4 w-4 text-olive" strokeWidth={2} />
          <span>
            <span className="block text-sm font-medium text-ink">
              Check-in-Erinnerung
            </span>
            <span className="block text-xs text-olive">Täglich um 18:00</span>
          </span>
        </span>
        <span
          className={`relative h-6 w-11 rounded-full transition ${
            reminderOn ? "bg-forest" : "bg-cream-deep"
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-paper shadow transition-all ${
              reminderOn ? "left-[22px]" : "left-0.5"
            }`}
          />
        </span>
      </button>

      <button
        type="button"
        onClick={handleReset}
        className="flex w-full items-center gap-3 rounded-3xl border border-cream-deep bg-paper px-5 py-4 text-left text-sm font-medium text-red-700 transition active:scale-[0.99]"
      >
        <RotateCcw className="h-4 w-4" strokeWidth={2} />
        Onboarding neu starten
      </button>

      <p className="mt-auto text-center text-[10px] text-olive/70">
        mammaly Health Coach · Prototyp · kein Medizinprodukt
      </p>
    </div>
  );
}
