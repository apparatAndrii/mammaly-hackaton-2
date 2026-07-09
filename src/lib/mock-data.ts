import { calculateHealthScore } from "@/lib/health-scoring";

export const dog = {
  name: "Rex",
  breed: "Corgi",
  ageYears: 5,
};

export const weeklyHealthTrend = [
  { day: "Mon", score: 72 },
  { day: "Tue", score: 74 },
  { day: "Wed", score: 73 },
  { day: "Thu", score: 75 },
  { day: "Fri", score: 74 },
  { day: "Sat", score: 76 },
  { day: "Sun", score: 75 },
];

export const weeklyScoreDelta = 3;

export const healthProfile = calculateHealthScore([
  {
    id: "weight",
    label: "Weight",
    score: 84,
    insight: "Body condition is within the healthy range.",
  },
  {
    id: "movement",
    label: "Movement",
    score: 76,
    insight: "Daily activity is slightly below the recommended level.",
  },
  {
    id: "digestion",
    label: "Digestion",
    score: 91,
    insight: "Stool quality and appetite patterns look stable.",
  },
  {
    id: "cognition",
    label: "Cognition & energy",
    score: 69,
    insight: "Energy dips were noted during the last two weeks.",
  },
  {
    id: "teeth",
    label: "Teeth",
    score: 54,
    insight: "Tartar buildup suggests a dental checkup is due.",
  },
]);
