import type { HealthCategoryId } from "@/lib/health-scoring";

/**
 * Markenneutrale Wissenskarten. Der Scheduler rotiert täglich durch alle
 * 5 Kategorien, sodass sich Kategorie und Inhalt an aufeinanderfolgenden
 * Tagen nie wiederholen.
 */

export type KnowledgeCard = {
  categoryId: HealthCategoryId;
  categoryLabel: string;
  title: string;
  text: string;
};

export const knowledgeCards: KnowledgeCard[] = [
  {
    categoryId: "teeth",
    categoryLabel: "Zähne & Maul",
    title: "Warum Zahnpflege Jahre schenkt",
    text: "8 von 10 Hunden über 3 Jahren haben Zahnprobleme. Chronische Maulentzündungen belasten Herz und Nieren — regelmäßiges Putzen wirkt direkt aufs gesunde Altern.",
  },
  {
    categoryId: "movement",
    categoryLabel: "Bewegung & Muskulatur",
    title: "Muskeln sind der Jungbrunnen",
    text: "Ab ca. 7 Jahren baut ein Hund ohne Training spürbar Muskulatur ab. Zwei kurze, aktive Einheiten pro Tag halten Gelenke stabil und das Gangbild jung.",
  },
  {
    categoryId: "digestion",
    categoryLabel: "Verdauung & Darm",
    title: "Der Darm altert mit",
    text: "Ein stabiles Mikrobiom stärkt Immunsystem und Nährstoffaufnahme. Konstante Fütterungszeiten und langsame Futterwechsel sind die halbe Miete.",
  },
  {
    categoryId: "cognition",
    categoryLabel: "Kognition & Vitalität",
    title: "Kopfarbeit hält jung",
    text: "10 Minuten Schnüffel- oder Suchspiele fordern das Gehirn ähnlich wie ein langer Spaziergang den Körper — und beugen Alters-Demenz nachweislich vor.",
  },
  {
    categoryId: "weight",
    categoryLabel: "Gewicht & Körper",
    title: "Schlank lebt länger",
    text: "Studien zeigen: Hunde mit Idealgewicht leben im Schnitt bis zu 2 Jahre länger. Schon 10 % Übergewicht beschleunigen das biologische Altern messbar.",
  },
];

function dayOfYear(date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  return Math.floor((date.getTime() - start.getTime()) / 86_400_000);
}

export function getTodaysKnowledgeCard(): KnowledgeCard {
  return knowledgeCards[dayOfYear() % knowledgeCards.length];
}
