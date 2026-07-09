import { calculateHealthScore } from "@/lib/health-scoring";

export const dog = {
  name: "Finn",
  breed: "Finnischer Spitz",
  ageYears: 7,
};

/** Seed für die Check-in-Serie, damit der Prototyp lebendig wirkt. */
export const STREAK_SEED = 11;

/** Gesamt-Score-Verlauf der letzten 3 Wochen; der letzte Punkt wird live ersetzt. */
export const healthTrend = [
  { label: "vor 3 Wochen", score: 71 },
  { label: "", score: 72 },
  { label: "", score: 72 },
  { label: "vor 2 Wochen", score: 73 },
  { label: "", score: 74 },
  { label: "vor 1 Woche", score: 74 },
  { label: "Heute", score: 75 },
];

export const healthProfile = calculateHealthScore([
  {
    id: "weight",
    label: "Gewicht & Körper",
    score: 84,
    insight: "Der Körperzustand liegt im gesunden Bereich.",
  },
  {
    id: "movement",
    label: "Bewegung & Muskulatur",
    score: 76,
    insight: "Die tägliche Aktivität liegt leicht unter der Empfehlung.",
  },
  {
    id: "digestion",
    label: "Verdauung & Darm",
    score: 91,
    insight: "Verdauung und Appetit sind stabil.",
  },
  {
    id: "cognition",
    label: "Kognition & Vitalität",
    score: 69,
    insight: "In den letzten zwei Wochen gab es Energie-Tiefs.",
  },
  {
    id: "teeth",
    label: "Zähne & Maul",
    score: 54,
    insight: "Anzeichen von Zahnstein — eine Zahnkontrolle ist fällig.",
  },
]);
