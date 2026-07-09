"use client";

import { useState } from "react";
import {
  fileToDataUrl,
  TEST_DOG_PROFILE,
  type DogProfile,
  type DogSex,
} from "@/lib/dog-profile";
import { useDogProfile } from "@/context/DogProfileContext";

type FormState = {
  name: string;
  breed: string;
  ageYears: string;
  sex: DogSex;
  neutered: boolean;
  weightKg: string;
};

const initialForm: FormState = {
  name: "",
  breed: "",
  ageYears: "",
  sex: "male",
  neutered: true,
  weightKg: "",
};

type PhotoSlot = {
  preview: string;
  file: File;
} | null;

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-olive">
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <input
      type={type}
      inputMode={inputMode}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="mt-1.5 w-full rounded-2xl border border-cream-deep bg-paper px-3.5 py-2.5 text-sm text-ink placeholder:text-olive/40 outline-none transition focus:border-forest"
    />
  );
}

function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="mt-1.5 flex rounded-2xl border border-cream-deep bg-paper p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`flex-1 rounded-xl py-2 text-sm font-medium transition ${
            value === option.value ? "bg-forest text-white" : "text-olive"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function OnboardingFlow() {
  const { completeOnboarding, skipWithTestData } = useDogProfile();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [photos, setPhotos] = useState<PhotoSlot[]>([null, null, null]);
  const [submitting, setSubmitting] = useState(false);

  const updateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const fillTestData = () => {
    setForm({
      name: TEST_DOG_PROFILE.name,
      breed: TEST_DOG_PROFILE.breed,
      ageYears: String(TEST_DOG_PROFILE.ageYears),
      sex: TEST_DOG_PROFILE.sex,
      neutered: TEST_DOG_PROFILE.neutered,
      weightKg: String(TEST_DOG_PROFILE.weightKg),
    });
  };

  const isStep1Valid =
    form.name.trim().length > 0 &&
    form.breed.trim().length > 0 &&
    Number(form.ageYears) > 0 &&
    Number(form.weightKg) > 0;

  const handlePhotoChange = (index: number, file: File | undefined) => {
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setPhotos((current) => {
      const next = [...current];
      if (next[index]?.preview) {
        URL.revokeObjectURL(next[index]!.preview);
      }
      next[index] = { preview, file };
      return next;
    });
  };

  const buildProfile = async (): Promise<DogProfile> => {
    const photoDataUrls = await Promise.all(
      photos
        .filter((slot): slot is NonNullable<PhotoSlot> => slot !== null)
        .map((slot) => fileToDataUrl(slot.file)),
    );

    return {
      name: form.name.trim(),
      breed: form.breed.trim(),
      ageYears: Number(form.ageYears),
      sex: form.sex,
      neutered: form.neutered,
      weightKg: Number(form.weightKg),
      photos: photoDataUrls,
    };
  };

  const handleComplete = async () => {
    if (!isStep1Valid) return;

    setSubmitting(true);
    try {
      const profile = await buildProfile();
      completeOnboarding(profile);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-cream px-5 pb-8 pt-14">
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-olive">
          Schritt {step} von 2
        </p>
        <h1 className="mt-2 font-display text-[26px] font-semibold leading-tight text-ink">
          {step === 1 ? "Erzähl uns von deinem Hund" : "Fotos hinzufügen"}
        </h1>
        <p className="mt-1 text-sm text-olive">
          {step === 1
            ? "Die Basisdaten legen die Referenz-Alterungskurve fest."
            : "Bis zu 3 Fotos (Front, Seite, oben) — vorerst optional."}
        </p>
      </div>

      {step === 1 ? (
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
          <div>
            <FieldLabel>Name</FieldLabel>
            <TextInput
              value={form.name}
              onChange={(value) => updateForm("name", value)}
              placeholder="Finn"
            />
          </div>

          <div>
            <FieldLabel>Rasse</FieldLabel>
            <TextInput
              value={form.breed}
              onChange={(value) => updateForm("breed", value)}
              placeholder="Finnischer Spitz"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Alter (Jahre)</FieldLabel>
              <TextInput
                value={form.ageYears}
                onChange={(value) => updateForm("ageYears", value)}
                placeholder="7"
                type="number"
                inputMode="decimal"
              />
            </div>
            <div>
              <FieldLabel>Gewicht (kg)</FieldLabel>
              <TextInput
                value={form.weightKg}
                onChange={(value) => updateForm("weightKg", value)}
                placeholder="9,5"
                type="number"
                inputMode="decimal"
              />
            </div>
          </div>

          <div>
            <FieldLabel>Geschlecht</FieldLabel>
            <SegmentedControl
              value={form.sex}
              options={[
                { value: "male", label: "Rüde" },
                { value: "female", label: "Hündin" },
              ]}
              onChange={(value) => updateForm("sex", value)}
            />
          </div>

          <div>
            <FieldLabel>Kastriert / sterilisiert</FieldLabel>
            <SegmentedControl
              value={form.neutered ? "yes" : "no"}
              options={[
                { value: "yes", label: "Ja" },
                { value: "no", label: "Nein" },
              ]}
              onChange={(value) => updateForm("neutered", value === "yes")}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid grid-cols-3 gap-3">
            {photos.map((slot, index) => (
              <label
                key={index}
                className="relative flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-olive/30 bg-paper transition active:scale-[0.98]"
              >
                {slot ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={slot.preview}
                    alt={`Hundefoto ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-olive">
                    {["Front", "Seite", "Oben"][index]}
                  </span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  onChange={(event) =>
                    handlePhotoChange(index, event.target.files?.[0])
                  }
                />
              </label>
            ))}
          </div>
          <p className="text-xs text-olive">
            Tippe auf ein Feld zum Hochladen. Fotos bleiben lokal auf diesem
            Gerät.
          </p>
        </div>
      )}

      <div className="mt-6 space-y-2">
        {step === 1 ? (
          <button
            type="button"
            disabled={!isStep1Valid}
            onClick={() => setStep(2)}
            className="w-full rounded-2xl bg-forest py-3 text-sm font-medium text-white transition active:scale-[0.98] disabled:opacity-40"
          >
            Weiter
          </button>
        ) : (
          <button
            type="button"
            disabled={submitting}
            onClick={handleComplete}
            className="w-full rounded-2xl bg-forest py-3 text-sm font-medium text-white transition active:scale-[0.98] disabled:opacity-40"
          >
            {submitting ? "Wird gespeichert…" : "Baseline berechnen"}
          </button>
        )}

        {step === 2 && (
          <button
            type="button"
            onClick={() => setStep(1)}
            className="w-full rounded-2xl bg-cream-deep py-3 text-sm font-medium text-ink transition active:scale-[0.98]"
          >
            Zurück
          </button>
        )}

        {step === 1 && (
          <button
            type="button"
            onClick={fillTestData}
            className="w-full rounded-2xl bg-cream-deep py-3 text-sm font-medium text-ink transition active:scale-[0.98]"
          >
            Testdaten einfüllen
          </button>
        )}

        <button
          type="button"
          onClick={skipWithTestData}
          className="w-full py-2 text-sm text-olive transition active:opacity-60"
        >
          Zum Testen überspringen
        </button>
      </div>
    </div>
  );
}
