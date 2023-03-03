import React, { useEffect, useState } from "react";
import { Question } from "@trivia-api/models";
import "./App.css";
import { AnswerQuestion } from "./AnswerQuestion";

/**
 * Helper function to get questions from The Trivia API
 * @returns an array of questions
 */
const getQuestions = async () => {
  const response = await fetch(
    "https://the-trivia-api.com/api/questions?limit=10"
  );

  const questions = await response.json();

  return questions;
};

function App() {
  // Store the questions in state once we have fetched them
  const [questions, setQuestions] = useState<Question[]>([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  const currentQuestion = questions[currentQuestionIndex];
  const remainingNumberOfQuestions = questions.length - currentQuestionIndex;

  // We can derive the state of the quiz from existing state
  let quizState: "not ready" | "in progress" | "complete";
  if (questions.length === 0) {
    quizState = "not ready";
  } else if (remainingNumberOfQuestions > 0) {
    quizState = "in progress";
  } else {
    quizState = "complete";
  }

  /**
   * Get questions once the app has loaded. This needs to be inside the useEffect
   * hook, otherwise we will be fetching questions any time the component renders.
   */
  useEffect(() => {
    getQuestions().then((res) => setQuestions(res));
  }, []);

  /**
   * Pass this function to <AnswerQuestion/> as a callback, so that whenever
   * the user guesses an answer we can update the score and show the next question.
   * @param guess - The user's guess
   */
  const handleGuessAnswer = (guess: string) => {
    if (guess === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }

    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  /**
   * Reset the state so the user can play another quiz
   */
  const resetQuiz = () => {
    setQuestions([]);
    setScore(0);
    setCurrentQuestionIndex(0);

    getQuestions().then((res) => {
      setQuestions(res);
    });
  };

  return (
    <div className="App">
      <header className="App-header">Trivia API React Starter</header>
      <p className="intro-paragraph">
        This site shows how to use
        {' '}<a href="https://the-trivia-api.com">The Trivia API</a> to build a basic
        quiz web app using <a href="https://reactjs.org/">React</a>. The code is
        public and can be seen on{' '}
        <a href="https://github.com/the-trivia-api/react-starter">its Github repo</a
        >.
      </p>
      {currentQuestion && (
        <>
          <table className="score-table">
            <tbody>
              <tr>
                <th>Total Questions</th>
                <td>{questions.length}</td>
              </tr>
              <tr>
                <th>Current score</th>
                <td>{score}</td>
              </tr>
              <tr>
                <th>Questions remaining</th>
                <td>{remainingNumberOfQuestions}</td>
              </tr>
            </tbody>
          </table>
          <AnswerQuestion
            question={currentQuestion}
            index={currentQuestionIndex}
            onGuessAnswer={handleGuessAnswer}
          />
          {/* Show the question JSON for debugging */}
          <details>
            <summary>Question JSON</summary>
            <pre className="question-json">
              {JSON.stringify(currentQuestion, null, 2)}
            </pre>
          </details>
        </>
      )}
      {quizState === "not ready" && <p>Loading questions...</p>}
      {quizState === "complete" && (
        <>
          <p>
            Complete! You scored {score}/{questions.length}
          </p>
          <button onClick={resetQuiz}>Play again</button>
        </>
      )}
      <footer>
        <a href="https://the-trivia-api.com">The Trivia API</a>
        <a href="https://github.com/the-trivia-api/react-starter">Github Repo</a>
      </footer>
    </div>
  );
}

export default App;
