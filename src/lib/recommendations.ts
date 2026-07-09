import { getAnswerQuality, type DailyCheckInAnswers } from "@/lib/daily-checkin";
import type { DogProfile } from "@/lib/dog-profile";
import type {
  HealthCategory,
  HealthCategoryId,
  HealthScoreResult,
  HealthStatus,
} from "@/lib/health-scoring";

export type RecommendationInput = {
  answers?: DailyCheckInAnswers;
  completedToday?: boolean;
};

export type Recommendation = {
  categoryId: HealthCategoryId;
  categoryLabel: string;
  title: string;
  action: string;
  supplementNote?: string;
  status: HealthStatus;
};

type CategoryRule = {
  title: string;
  actions: {
    red: string;
    yellow: string;
    green: string;
  };
  /** Verfeinerte Aktion, wenn der heutige Check-in hier "poor" meldet */
  poorCheckInAction?: string;
  supplementThreshold: number;
  supplementNote: string;
};

const CATEGORY_RULES: Record<HealthCategoryId, CategoryRule> = {
  teeth: {
    title: "Zahnpflege",
    actions: {
      red: "Diese Woche einen Zahn-Check beim Tierarzt vereinbaren",
      yellow: "Heute Abend Zähne putzen und Zahnfleisch prüfen",
      green: "Wöchentliches Zähneputzen beibehalten",
    },
    poorCheckInAction: "Diese Woche einen Zahn-Check beim Tierarzt vereinbaren",
    supplementThreshold: 65,
    supplementNote:
      "Passend dazu: mammaly Zahnpflege-Snack als Teil des Wochenplans — kein Muss für den Score.",
  },
  movement: {
    title: "Tägliche Bewegung",
    actions: {
      red: "Heute eine ruhige 15-Minuten-Abendrunde einplanen",
      yellow: "Vor dem Abendessen 10 Minuten Spielzeit einbauen",
      green: "Die heutige Spazier-Routine beibehalten",
    },
    poorCheckInAction: "Heute eine ruhige 15-Minuten-Abendrunde einplanen",
    supplementThreshold: Infinity,
    supplementNote: "",
  },
  digestion: {
    title: "Verdauung im Blick",
    actions: {
      red: "Mahlzeiten 3 Tage lang protokollieren, um Muster zu erkennen",
      yellow: "Nach dem Abendessen die Kotqualität notieren",
      green: "Mahlzeiten diese Woche zweimal protokollieren",
    },
    poorCheckInAction:
      "Heutige Mahlzeit und Kotqualität notieren, um Muster zu erkennen",
    supplementThreshold: 75,
    supplementNote:
      "Passend dazu: mammaly Darm-Support kann die Beobachtungswoche begleiten.",
  },
  cognition: {
    title: "Kopf-Training",
    actions: {
      red: "Heute vor dem Abendessen ein 10-Minuten-Schnüffelspiel testen",
      yellow: "Ein kurzes Trainingsspiel in die Tagesroutine einbauen",
      green: "Tägliche Beschäftigungseinheiten beibehalten",
    },
    poorCheckInAction:
      "Ein 10-Minuten-Schnüffelspiel vor dem Abendessen für mehr Aufmerksamkeit",
    supplementThreshold: 70,
    supplementNote:
      "Passend dazu: mammaly Vital-Support kann das Kopf-Training ergänzen.",
  },
  weight: {
    title: "Gewicht im Griff",
    actions: {
      red: "Portionen der nächsten zwei Mahlzeiten abmessen und notieren",
      yellow: "Beim nächsten Tierarztbesuch oder zu Hause wiegen",
      green: "Aktuelle Futterportionen beibehalten",
    },
    poorCheckInAction:
      "Portionen der nächsten zwei Mahlzeiten abmessen und notieren",
    supplementThreshold: Infinity,
    supplementNote: "",
  },
};

const QUESTION_TO_CATEGORY: Record<string, HealthCategoryId> = {
  appetite: "digestion",
  activity: "movement",
  energy: "cognition",
  weight: "weight",
  teeth: "teeth",
};

function getCategoryById(
  profile: HealthScoreResult,
  id: HealthCategoryId,
): HealthCategory {
  const category = profile.categories.find((item) => item.id === id);
  if (!category) {
    throw new Error(`Missing health category: ${id}`);
  }
  return category;
}

function getTodaysPoorCategories(
  checkIn?: RecommendationInput,
): HealthCategoryId[] {
  if (!checkIn?.completedToday || !checkIn.answers) return [];

  return Object.entries(QUESTION_TO_CATEGORY)
    .filter(
      ([questionId]) =>
        getAnswerQuality(questionId, checkIn.answers?.[questionId]) === "poor",
    )
    .map(([, categoryId]) => categoryId);
}

function pickFocusCategory(
  profile: HealthScoreResult,
  checkIn?: RecommendationInput,
): HealthCategory {
  const poorCategories = getTodaysPoorCategories(checkIn);

  // Heutige Auffälligkeit gewinnt; bei mehreren die mit dem niedrigsten Score.
  if (poorCategories.length > 0) {
    const candidates = poorCategories.map((id) => getCategoryById(profile, id));
    return candidates.reduce((weakest, current) =>
      current.score < weakest.score ? current : weakest,
    );
  }

  return profile.weakestCategory;
}

function shouldSuggestSupplement(
  category: HealthCategory,
  rule: CategoryRule,
  checkIn?: RecommendationInput,
): boolean {
  if (!rule.supplementNote) return false;
  if (category.score < rule.supplementThreshold) return true;

  const poorToday = getTodaysPoorCategories(checkIn).includes(category.id);
  return poorToday && category.score < rule.supplementThreshold + 10;
}

export function getNextRecommendation(
  healthProfile: HealthScoreResult,
  dailyCheckInState?: RecommendationInput,
  dogProfile?: DogProfile,
): Recommendation {
  const focusCategory = pickFocusCategory(healthProfile, dailyCheckInState);
  const rule = CATEGORY_RULES[focusCategory.id];
  const poorToday = getTodaysPoorCategories(dailyCheckInState).includes(
    focusCategory.id,
  );
  const action =
    poorToday && rule.poorCheckInAction
      ? rule.poorCheckInAction
      : rule.actions[focusCategory.status];

  const recommendation: Recommendation = {
    categoryId: focusCategory.id,
    categoryLabel: focusCategory.label,
    title: dogProfile?.name ? `${dogProfile.name}: ${rule.title}` : rule.title,
    action,
    status: focusCategory.status,
  };

  if (shouldSuggestSupplement(focusCategory, rule, dailyCheckInState)) {
    recommendation.supplementNote = rule.supplementNote;
  }

  return recommendation;
}
