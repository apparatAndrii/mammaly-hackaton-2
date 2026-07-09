import { dog as mockDog } from "@/lib/mock-data";

export const DOG_PROFILE_STORAGE_KEY = "mammaly-dog-profile";
export const ONBOARDING_COMPLETED_KEY = "mammaly-onboarding-completed";

export type DogSex = "male" | "female";

export type DogProfile = {
  name: string;
  breed: string;
  ageYears: number;
  sex: DogSex;
  neutered: boolean;
  weightKg: number;
  photos: string[];
};

export const TEST_DOG_PROFILE: DogProfile = {
  name: mockDog.name,
  breed: mockDog.breed,
  ageYears: mockDog.ageYears,
  sex: "male",
  neutered: true,
  weightKg: 9.5,
  photos: [],
};

export function getProfilePhotoUrl(profile: DogProfile): string | undefined {
  return profile.photos[0];
}

export function getStoredDogProfile(): DogProfile | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(DOG_PROFILE_STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as Partial<DogProfile>;
    if (
      parsed.name &&
      parsed.breed &&
      typeof parsed.ageYears === "number" &&
      (parsed.sex === "male" || parsed.sex === "female") &&
      typeof parsed.neutered === "boolean" &&
      typeof parsed.weightKg === "number"
    ) {
      return {
        name: parsed.name,
        breed: parsed.breed,
        ageYears: parsed.ageYears,
        sex: parsed.sex,
        neutered: parsed.neutered,
        weightKg: parsed.weightKg,
        photos: Array.isArray(parsed.photos) ? parsed.photos : [],
      };
    }
  } catch {
    return null;
  }

  return null;
}

export function isOnboardingCompleted(): boolean {
  if (typeof window === "undefined") return false;

  try {
    return localStorage.getItem(ONBOARDING_COMPLETED_KEY) === "true";
  } catch {
    return false;
  }
}

export function saveDogProfile(profile: DogProfile): void {
  localStorage.setItem(DOG_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  localStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
}

export function clearDogProfileStorage(): void {
  localStorage.removeItem(DOG_PROFILE_STORAGE_KEY);
  localStorage.removeItem(ONBOARDING_COMPLETED_KEY);
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
