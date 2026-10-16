import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiError, getRandomQuestions, type TextChoiceQuestion } from "@trivia-api/sdk";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";

// Replace the network call, but keep the real ApiError class
vi.mock("@trivia-api/sdk", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@trivia-api/sdk")>()),
  getRandomQuestions: vi.fn(),
}));

const mockGetRandomQuestions = vi.mocked(getRandomQuestions);

const makeQuestion = (id: string, text: string, correctAnswer: string): TextChoiceQuestion => ({
  id,
  type: "text_choice",
  category: "science",
  difficulty: "easy",
  question: { text },
  correctAnswer,
  incorrectAnswers: ["Wrong 1", "Wrong 2", "Wrong 3"],
  tags: ["science"],
  regions: [],
  isNiche: false,
});

beforeEach(() => {
  mockGetRandomQuestions.mockReset();
});

describe("App", () => {
  it("plays through a quiz and shows the score", async () => {
    const user = userEvent.setup();
    mockGetRandomQuestions.mockResolvedValue([
      makeQuestion("1", "What is H2O?", "Water"),
      makeQuestion("2", "What is NaCl?", "Salt"),
    ]);
    render(<App />);

    await user.selectOptions(screen.getByLabelText("Category"), "science");
    await user.selectOptions(screen.getByLabelText("Questions"), "5");
    await user.click(screen.getByRole("button", { name: "Start quiz" }));

    expect(mockGetRandomQuestions).toHaveBeenCalledWith({
      limit: 5,
      categories: "science",
      difficulties: undefined,
    });

    expect(await screen.findByRole("heading", { name: "What is H2O?" })).toHaveFocus();
    await user.click(screen.getByRole("button", { name: "Water" }));
    expect(screen.getByRole("status")).toHaveTextContent("Correct!");
    expect(screen.getByRole("button", { name: "Next question" })).toHaveFocus();

    await user.click(screen.getByRole("button", { name: "Next question" }));
    await user.click(screen.getByRole("button", { name: "Wrong 1" }));
    expect(screen.getByRole("status")).toHaveTextContent("Not quite. The answer was Salt.");

    await user.click(screen.getByRole("button", { name: "See results" }));
    expect(screen.getByRole("heading", { name: "You scored 1 out of 2" })).toHaveFocus();
  });

  it("ignores clicks on other answers once one is chosen", async () => {
    const user = userEvent.setup();
    mockGetRandomQuestions.mockResolvedValue([makeQuestion("1", "What is H2O?", "Water")]);
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Start quiz" }));
    await user.click(await screen.findByRole("button", { name: "Wrong 2" }));
    await user.click(screen.getByRole("button", { name: /Water/ }));

    expect(screen.getByRole("status")).toHaveTextContent("Not quite.");
    expect(screen.getByRole("button", { name: /Wrong 2/ })).toHaveTextContent("Your answer");
  });

  it("explains a rate limit and lets the player try again", async () => {
    const user = userEvent.setup();
    mockGetRandomQuestions
      .mockRejectedValueOnce(new ApiError(429, "", "Too Many Requests"))
      .mockResolvedValueOnce([makeQuestion("1", "What is H2O?", "Water")]);
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Start quiz" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Too many requests");

    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByRole("heading", { name: "What is H2O?" })).toBeInTheDocument();
  });
});
