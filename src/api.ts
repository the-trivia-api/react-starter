import {
  ApiError,
  getRandomQuestions,
  type Category,
  type TextChoiceQuestion,
  type V2Question,
} from "@trivia-api/sdk";

export type Difficulty = "easy" | "medium" | "hard";

export type QuizSettings = {
  category: Category | "any";
  difficulty: Difficulty | "any";
  amount: number;
};

/**
 * The API can also return text input and image questions, but only when you
 * ask for them. This quiz only shows multiple choice (text_choice) questions,
 * so this narrows the type for TypeScript.
 */
const isMultipleChoice = (question: V2Question): question is TextChoiceQuestion =>
  question.type === "text_choice";

/**
 * Gets a set of random questions for the quiz. Leaving a filter out means
 * "any", so "any" is turned into undefined rather than sent to the API.
 */
export const fetchQuestions = async (settings: QuizSettings) => {
  const questions = await getRandomQuestions({
    limit: settings.amount,
    categories: settings.category === "any" ? undefined : settings.category,
    difficulties: settings.difficulty === "any" ? undefined : settings.difficulty,
  });

  return questions.filter(isMultipleChoice);
};

/** A message for the player, depending on why the request failed */
export const describeError = (error: unknown) => {
  if (error instanceof ApiError && error.status === 429) {
    // Without an API key, each IP can make 20 requests every 5 seconds
    return "Too many requests. Wait a few seconds and try again.";
  }
  return "Couldn't load questions. Check your connection and try again.";
};
