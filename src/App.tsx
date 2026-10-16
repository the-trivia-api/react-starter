import { useState } from "react";
import { describeError, fetchQuestions, type QuizSettings } from "./api";
import { shuffle } from "./shuffle";
import { isCorrect, type Round } from "./types";
import { SetupForm } from "./components/SetupForm";
import { QuestionCard } from "./components/QuestionCard";
import { Results } from "./components/Results";
import { StatusCard } from "./components/StatusCard";

/**
 * Everything the quiz can be doing. Each status only has the data it needs,
 * so e.g. there's no way to be "playing" without any questions.
 */
type GameState =
  | { status: "setup" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "playing"; rounds: Round[]; current: number }
  | { status: "finished"; rounds: Round[] };

const DEFAULT_SETTINGS: QuizSettings = { category: "any", difficulty: "any", amount: 10 };

export const App = () => {
  const [settings, setSettings] = useState<QuizSettings>(DEFAULT_SETTINGS);
  const [game, setGame] = useState<GameState>({ status: "setup" });

  // Fetching from the event handler, rather than an effect, means one click is
  // always one request (effects run twice in development with StrictMode)
  const startQuiz = async (newSettings: QuizSettings) => {
    setSettings(newSettings);
    setGame({ status: "loading" });

    try {
      const questions = await fetchQuestions(newSettings);
      if (questions.length === 0) {
        setGame({
          status: "error",
          message: "No questions matched those settings. Try a different category or difficulty.",
        });
        return;
      }

      setGame({
        status: "playing",
        current: 0,
        rounds: questions.map((question) => ({
          question,
          answers: shuffle([question.correctAnswer, ...question.incorrectAnswers]),
          chosen: null,
        })),
      });
    } catch (error) {
      setGame({ status: "error", message: describeError(error) });
    }
  };

  const answer = (choice: string) =>
    setGame((game) =>
      game.status === "playing"
        ? {
            ...game,
            rounds: game.rounds.map((round, index) =>
              index === game.current ? { ...round, chosen: choice } : round
            ),
          }
        : game
    );

  const goToNextQuestion = () =>
    setGame((game) => {
      if (game.status !== "playing") return game;
      return game.current + 1 < game.rounds.length
        ? { ...game, current: game.current + 1 }
        : { status: "finished", rounds: game.rounds };
    });

  const changeSettings = () => setGame({ status: "setup" });

  return (
    <div className="page">
      <header className="header">
        <h1 className="header__title">Trivia Quiz</h1>
        <p className="header__subtitle">
          Built with React and{" "}
          <a href="https://the-trivia-api.com" className="link">
            The Trivia API
          </a>
        </p>
      </header>

      <main>
        {game.status === "setup" && <SetupForm defaultSettings={settings} onStart={startQuiz} />}

        {game.status === "loading" && <StatusCard title="Loading questions…" isLoading />}

        {game.status === "error" && (
          <StatusCard
            title="Something went wrong"
            message={game.message}
            onRetry={() => startQuiz(settings)}
            onChangeSettings={changeSettings}
          />
        )}

        {game.status === "playing" && (
          <QuestionCard
            // A new key per question resets the card's focus handling
            key={game.rounds[game.current].question.id}
            round={game.rounds[game.current]}
            number={game.current + 1}
            total={game.rounds.length}
            score={game.rounds.filter(isCorrect).length}
            onAnswer={answer}
            onNext={goToNextQuestion}
          />
        )}

        {game.status === "finished" && (
          <Results
            rounds={game.rounds}
            onPlayAgain={() => startQuiz(settings)}
            onChangeSettings={changeSettings}
          />
        )}
      </main>

      <footer className="footer">
        <a href="https://github.com/the-trivia-api/react-starter" className="link">
          View the code on GitHub
        </a>
        <span aria-hidden>·</span>
        <a href="https://the-trivia-api.com/docs/" className="link">
          API docs
        </a>
      </footer>
    </div>
  );
};
