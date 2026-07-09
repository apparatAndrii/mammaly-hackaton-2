export function calculateDogBiologicalAge(chronologicalYears: number): number {
  if (chronologicalYears <= 0) return 0;
  if (chronologicalYears === 1) return 15;
  if (chronologicalYears === 2) return 24;
  return 24 + (chronologicalYears - 2) * 5;
}

export type BiologicalAgeStep = {
  label: string;
  value: string;
};

export function getBiologicalAgeBreakdown(chronologicalYears: number): {
  steps: BiologicalAgeStep[];
  total: number;
} {
  if (chronologicalYears <= 0) {
    return { steps: [], total: 0 };
  }

  const steps: BiologicalAgeStep[] = [
    { label: "Year 1", value: "15 years" },
  ];

  if (chronologicalYears >= 2) {
    steps.push({ label: "Year 2", value: "24 years total" });
  }

  if (chronologicalYears > 2) {
    const extraYears = chronologicalYears - 2;
    steps.push({
      label: `Years 3–${chronologicalYears}`,
      value: `+${extraYears * 5} years (+5 per year)`,
    });
  }

  return {
    steps,
    total: calculateDogBiologicalAge(chronologicalYears),
  };
}
