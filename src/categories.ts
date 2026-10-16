import type { Category } from "@trivia-api/sdk";

/** Human-readable names for the API's categories */
export const CATEGORY_LABELS: Record<Category, string> = {
  general_knowledge: "General knowledge",
  arts_and_literature: "Arts & literature",
  film_and_tv: "Film & TV",
  food_and_drink: "Food & drink",
  geography: "Geography",
  history: "History",
  music: "Music",
  science: "Science",
  society_and_culture: "Society & culture",
  sport_and_leisure: "Sport & leisure",
};

export const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];
