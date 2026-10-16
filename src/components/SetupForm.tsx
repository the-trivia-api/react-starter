import type { Category } from "@trivia-api/sdk";
import type { Difficulty, QuizSettings } from "../api";
import { CATEGORIES, CATEGORY_LABELS } from "../categories";

type SetupFormProps = {
  defaultSettings: QuizSettings;
  onStart: (settings: QuizSettings) => void;
};

const AMOUNTS = [5, 10, 15, 20];

export const SetupForm = ({ defaultSettings, onStart }: SetupFormProps) => {
  // A form action gets the submitted values as FormData, so the selects don't
  // need their own state
  const start = (formData: FormData) =>
    onStart({
      category: formData.get("category") as Category | "any",
      difficulty: formData.get("difficulty") as Difficulty | "any",
      amount: Number(formData.get("amount")),
    });

  return (
    <form action={start} className="card">
      <h2 className="card__title">Set up your quiz</h2>

      <div className="fields">
        <label className="field">
          <span className="field__label">Category</span>
          <select name="category" defaultValue={defaultSettings.category} className="select">
            <option value="any">Any category</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {CATEGORY_LABELS[category]}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__label">Difficulty</span>
          <select name="difficulty" defaultValue={defaultSettings.difficulty} className="select">
            <option value="any">Any difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>

        <label className="field">
          <span className="field__label">Questions</span>
          <select name="amount" defaultValue={defaultSettings.amount} className="select">
            {AMOUNTS.map((amount) => (
              <option key={amount} value={amount}>
                {amount}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button type="submit" className="button button--primary">
        Start quiz
      </button>
    </form>
  );
};
