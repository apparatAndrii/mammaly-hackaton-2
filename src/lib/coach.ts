import type { HealthCategoryId, HealthScoreResult } from "@/lib/health-scoring";

/**
 * Coach-Sprechblase in Hunde-Stimme: reagiert auf die schwächste Kategorie
 * und den Check-in-Status, rotiert deterministisch über den Tag.
 */

const QUOTES_BY_CATEGORY: Record<HealthCategoryId, string[]> = {
  weight: [
    "„Ich fühl mich gut — aber Leckerli zählen wir heute mit, oder?“",
    "„Wiegen? Nur wenn danach trotzdem Abendessen kommt.“",
  ],
  movement: [
    "„Meine Beine wollen heute mehr. Kleine Extrarunde?“",
    "„Heute hab ich Lust auf Abenteuer. Nur… wir nehmen meinen Weg.“",
  ],
  digestion: [
    "„Mein Bauch mag Routine. Und dich. Aber vor allem Routine.“",
    "„Gleiche Zeit, gleiches Futter — mein Bauch sagt danke.“",
  ],
  cognition: [
    "„Mir ist langweilig im Kopf. Hast du ein Rätsel für mich?“",
    "„Schnüffelspiel? Ich wäre sofort dabei.“",
  ],
  teeth: [
    "„Mein Lächeln könnte etwas Pflege vertragen…“",
    "„Frischer Atem wäre schon nett. Für uns beide.“",
  ],
};

const CHECKIN_NUDGES = [
  "„Erzähl kurz, wie mein Tag war — dauert nur 30 Sekunden.“",
  "„Mein Check-in wartet. Danach gibt’s Kuscheln, versprochen.“",
];

function dayOfYear(date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86_400_000);
}

export function getCoachQuote(
  healthResult: HealthScoreResult,
  completedToday: boolean,
): string {
  if (!completedToday) {
    return CHECKIN_NUDGES[dayOfYear() % CHECKIN_NUDGES.length];
  }

  const quotes = QUOTES_BY_CATEGORY[healthResult.weakestCategory.id];
  return quotes[dayOfYear() % quotes.length];
}
