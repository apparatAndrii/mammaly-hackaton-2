import type { DailyCheckInAnswers } from "@/lib/daily-checkin";
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
  supplementThreshold: number;
  supplementNote: string;
};

const CATEGORY_RULES: Record<HealthCategoryId, CategoryRule> = {
  teeth: {
    title: "Dental care",
    actions: {
      red: "Schedule a dental checkup this week",
      yellow: "Brush teeth tonight and check for gum redness",
      green: "Keep up weekly tooth brushing",
    },
    supplementThreshold: 65,
    supplementNote:
      "Consider Mammaly dental support as part of this week's dental care plan.",
  },
  movement: {
    title: "Daily movement",
    actions: {
      red: "Add a 15-minute evening walk today",
      yellow: "Add a 10-minute play session before dinner",
      green: "Maintain today's walk routine",
    },
    supplementThreshold: Infinity,
    supplementNote: "",
  },
  digestion: {
    title: "Digestion tracking",
    actions: {
      red: "Log meals for 3 days to track digestion patterns",
      yellow: "Note stool quality after tonight's meal",
      green: "Continue logging meals twice this week",
    },
    supplementThreshold: 75,
    supplementNote:
      "Mammaly digestive support may help while you track patterns this week.",
  },
  cognition: {
    title: "Mental stimulation",
    actions: {
      red: "Try a 10-minute scent puzzle before dinner tonight",
      yellow: "Add one short training game to today's routine",
      green: "Keep daily enrichment sessions going",
    },
    supplementThreshold: 70,
    supplementNote:
      "Mammaly cognitive support can complement tonight's enrichment plan.",
  },
  weight: {
    title: "Weight management",
    actions: {
      red: "Measure portions at the next two meals and log them",
      yellow: "Weigh at your next vet visit or with a home scale",
      green: "Continue current feeding portions",
    },
    supplementThreshold: Infinity,
    supplementNote: "",
  },
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

function pickFocusCategory(
  profile: HealthScoreResult,
  checkIn?: RecommendationInput,
): HealthCategory {
  let focusId = profile.weakestCategory.id;
  const answers = checkIn?.completedToday ? checkIn.answers : undefined;

  if (answers?.appetite === "Poor") {
    const digestion = getCategoryById(profile, "digestion");
    if (digestion.status !== "green") {
      focusId = "digestion";
    }
  } else if (answers?.activity === "Low") {
    focusId = "movement";
  } else if (answers?.energy === "Tired") {
    const cognition = getCategoryById(profile, "cognition");
    const movement = getCategoryById(profile, "movement");
    focusId =
      cognition.score <= movement.score ? "cognition" : "movement";
  } else if (answers?.teeth === "Uncomfortable") {
    focusId = "teeth";
  } else if (answers?.weight === "Heavy") {
    focusId = "weight";
  }

  return getCategoryById(profile, focusId);
}

function refineAction(
  category: HealthCategory,
  baseAction: string,
  checkIn?: RecommendationInput,
): string {
  const answers = checkIn?.completedToday ? checkIn.answers : undefined;
  if (!answers) return baseAction;

  if (category.id === "digestion" && answers.appetite === "Poor") {
    return "Log tonight's meal and stool quality to spot digestion patterns";
  }

  if (category.id === "cognition" && answers.energy === "Tired") {
    return "Try a 10-minute scent puzzle before dinner to boost alertness";
  }

  if (category.id === "movement" && answers.activity === "Low") {
    return "Add a gentle 15-minute evening walk today";
  }

  if (category.id === "teeth" && answers.teeth === "Uncomfortable") {
    return "Schedule a dental checkup this week";
  }

  if (category.id === "weight" && answers.weight === "Heavy") {
    return "Measure portions at the next two meals and log them";
  }

  return baseAction;
}

function shouldSuggestSupplement(
  category: HealthCategory,
  rule: CategoryRule,
  checkIn?: RecommendationInput,
): boolean {
  if (!rule.supplementNote) return false;

  const answers = checkIn?.completedToday ? checkIn.answers : undefined;

  if (category.id === "teeth") {
    if (category.score < rule.supplementThreshold) return true;
    if (answers?.teeth === "Uncomfortable" || answers?.teeth === "Okay") {
      return category.score < 75;
    }
  }

  if (category.id === "digestion") {
    if (category.score < rule.supplementThreshold) return true;
    if (answers?.appetite === "Poor" || answers?.appetite === "Okay") {
      return category.score < 85;
    }
  }

  if (category.id === "cognition") {
    if (category.score < rule.supplementThreshold) return true;
    if (answers?.energy === "Tired") return true;
  }

  return false;
}

function personalizeTitle(title: string, dogProfile?: DogProfile): string {
  if (!dogProfile?.name) return title;
  return `${dogProfile.name}: ${title}`;
}

export function getNextRecommendation(
  healthProfile: HealthScoreResult,
  dailyCheckInState?: RecommendationInput,
  dogProfile?: DogProfile,
): Recommendation {
  const focusCategory = pickFocusCategory(healthProfile, dailyCheckInState);
  const rule = CATEGORY_RULES[focusCategory.id];
  const baseAction = rule.actions[focusCategory.status];
  const action = refineAction(focusCategory, baseAction, dailyCheckInState);

  const recommendation: Recommendation = {
    title: personalizeTitle(rule.title, dogProfile),
    action,
    status: focusCategory.status,
  };

  if (shouldSuggestSupplement(focusCategory, rule, dailyCheckInState)) {
    recommendation.supplementNote = rule.supplementNote;
  }

  return recommendation;
}
