import { Question } from "@trivia-api/models"
import './App.css';

type AnswerQuestionProps = {
    question: Question
    index: number
    onGuessAnswer: (guess: string) => void
}

/**
 * Renders a question, with all possible answers rendered as buttons. On clicking one of the buttons
 * the onGuessAnswer callback will run with the value of the guess.
 */
export const AnswerQuestion = ({question, index, onGuessAnswer}: AnswerQuestionProps) => {

    // Sort the answers alphabetically so that the correct answer is shuffled in with the rest
    const allAnswers = [question.correctAnswer, ...question.incorrectAnswers].sort((a,b) => a < b ? -1 : 1)

    return <div className="answer-question">
        <p className="answer-question__question">{index + 1}: {question.question}</p>
        <ul className="answer-question__answers">
            {
                allAnswers.map(answer => <li  key={answer} ><button onClick={() => onGuessAnswer(answer)}>{answer}</button></li>)
            }
        </ul>
    </div>
}