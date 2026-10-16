import { useEffect, useRef } from "react";
import { isCorrect, type Round } from "../types";

type ResultsProps = {
  rounds: Round[];
  onPlayAgain: () => void;
  onChangeSettings: () => void;
};

const verdict = (score: number, total: number) => {
  const ratio = score / total;
  if (ratio === 1) return "A perfect score.";
  if (ratio >= 0.7) return "Great work.";
  if (ratio >= 0.4) return "Not bad at all.";
  return "Better luck next time.";
};

export const Results = ({ rounds, onPlayAgain, onChangeSettings }: ResultsProps) => {
  const score = rounds.filter(isCorrect).length;
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => headingRef.current?.focus(), []);

  return (
    <section className="card" aria-labelledby="results-title">
      <h2 id="results-title" ref={headingRef} tabIndex={-1} className="card__title">
        You scored {score} out of {rounds.length}
      </h2>
      <p className="card__text">{verdict(score, rounds.length)}</p>

      <div className="actions">
        <button type="button" className="button button--primary" onClick={onPlayAgain}>
          Play again
        </button>
        <button type="button" className="button" onClick={onChangeSettings}>
          Change settings
        </button>
      </div>

      <h3 className="review__title">Your answers</h3>
      <ol className="review">
        {rounds.map((round) => (
          <li key={round.question.id} className="review__item">
            <p className="review__question">{round.question.question.text}</p>
            {isCorrect(round) ? (
              <p className="review__answer review__answer--correct">
                ✓ {round.chosen} <span className="visually-hidden">(correct)</span>
              </p>
            ) : (
              <>
                <p className="review__answer review__answer--incorrect">
                  ✗ {round.chosen} <span className="visually-hidden">(incorrect)</span>
                </p>
                <p className="review__answer">Answer: {round.question.correctAnswer}</p>
              </>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
};
