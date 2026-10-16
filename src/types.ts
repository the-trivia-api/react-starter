import type { TextChoiceQuestion } from "@trivia-api/sdk";

/** One question in a quiz, with its answers in the order they're shown */
export type Round = {
  question: TextChoiceQuestion;
  answers: string[];
  /** The answer the player picked, or null if they haven't answered yet */
  chosen: string | null;
};

export const isCorrect = (round: Round) => round.chosen === round.question.correctAnswer;
