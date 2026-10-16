import { useEffect, useRef } from "react";
import { CATEGORY_LABELS } from "../categories";
import type { Round } from "../types";

type QuestionCardProps = {
  round: Round;
  /** Which question this is, starting from 1 */
  number: number;
  total: number;
  score: number;
  onAnswer: (answer: string) => void;
  onNext: () => void;
};

type AnswerState = "idle" | "correct" | "incorrect";

export const QuestionCard = ({
  round,
  number,
  total,
  score,
  onAnswer,
  onNext,
}: QuestionCardProps) => {
  const { question, answers, chosen } = round;
  const hasAnswered = chosen !== null;
  const isLastQuestion = number === total;

  const headingRef = useRef<HTMLHeadingElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  // Keyboard and screen reader users would otherwise be left on a button that
  // no longer exists, so move focus to the new question...
  useEffect(() => headingRef.current?.focus(), []);
  // ...and to the "next" button once they've answered
  useEffect(() => {
    if (hasAnswered) nextButtonRef.current?.focus();
  }, [hasAnswered]);

  const answerState = (answer: string): AnswerState => {
    if (!hasAnswered) return "idle";
    if (answer === question.correctAnswer) return "correct";
    if (answer === chosen) return "incorrect";
    return "idle";
  };

  const answeredCount = number - 1 + (hasAnswered ? 1 : 0);

  return (
    <section className="card" aria-labelledby="question-text">
      <div className="quiz-meta">
        <span>
          Question {number} of {total}
        </span>
        <span>Score: {score}</span>
      </div>
      <div
        className="progress"
        role="progressbar"
        aria-label="Questions answered"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={answeredCount}
      >
        <div className="progress__bar" style={{ width: `${(answeredCount / total) * 100}%` }} />
      </div>

      <p className="question__category">
        {CATEGORY_LABELS[question.category]} · {question.difficulty}
      </p>
      <h2 id="question-text" ref={headingRef} tabIndex={-1} className="question__text">
        {question.question.text}
      </h2>

      <ul className="answers">
        {answers.map((answer) => {
          const state = answerState(answer);
          return (
            <li key={answer}>
              {/*
                aria-disabled rather than disabled: a disabled button can't be
                focused, which would throw keyboard users out of the list
              */}
              <button
                type="button"
                className={`answer answer--${state}`}
                aria-disabled={hasAnswered}
                onClick={() => !hasAnswered && onAnswer(answer)}
              >
                <span>{answer}</span>
                {/* Text as well as colour, so the result doesn't rely on seeing red and green */}
                {state === "correct" && <span className="answer__tag">Correct answer</span>}
                {state === "incorrect" && <span className="answer__tag">Your answer</span>}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Always rendered, so answering doesn't push the page around */}
      <div className="question__footer">
        <p className="feedback" role="status">
          {hasAnswered &&
            (chosen === question.correctAnswer
              ? "Correct!"
              : `Not quite. The answer was ${question.correctAnswer}.`)}
        </p>
        <button
          ref={nextButtonRef}
          type="button"
          // Invisible (but still taking up space) until the player answers
          className={`button button--primary ${hasAnswered ? "" : "is-invisible"}`}
          onClick={onNext}
        >
          {isLastQuestion ? "See results" : "Next question"}
        </button>
      </div>
    </section>
  );
};
