# React Trivia Quiz

A quiz app built with React and [The Trivia API](https://the-trivia-api.com). Pick a category, difficulty and number of questions, answer them, then see how you did.

**[Try the live demo](https://react-starter.the-trivia-api.com)**

Do whatever you like with it: fork it, copy bits out of it, or use it as the starting point for your own quiz.

## Running it

You'll need Node 20.19 or later.

```sh
npm install
npm run dev
```

Then open http://localhost:5173. No API key needed.

Other scripts:

- `npm test` runs the tests
- `npm run build` builds the app into `dist/`
- `npm run lint` lints with oxlint

## How it works

The questions come from The Trivia API through [`@trivia-api/sdk`](https://www.npmjs.com/package/@trivia-api/sdk), which gives you typed functions for every endpoint.

- [`src/api.ts`](src/api.ts) fetches the questions, and turns errors into something a player can read (e.g. when you hit the rate limit)
- [`src/App.tsx`](src/App.tsx) holds the state of the game: setting up, loading, playing, finished or errored
- [`src/shuffle.ts`](src/shuffle.ts) mixes the correct answer in with the incorrect ones, without bias
- [`src/components/`](src/components) has one component per screen

Styling is plain CSS in [`src/index.css`](src/index.css). The colours are custom properties at the top, so changing those restyles the whole app.

The tests in [`src/App.test.tsx`](src/App.test.tsx) mock the SDK, so they never call the real API. That's probably the pattern to copy if you add your own.

## Going further

Some ideas if you want to build on it:

- Filtering by tag (e.g. `tags: "dinosaurs"`) for themed quizzes
- Text input questions, where players type the answer (`types: "text_input"`) and [`validateQuestionAnswer`](https://the-trivia-api.com/docs/) checks it, accepting small differences like plurals
- Sessions, so players never see the same question twice

The last two need an [API key](https://the-trivia-api.com/pricing/).

The [API docs](https://the-trivia-api.com/docs/) cover everything else.

## Using it commercially

The Trivia API is free for non-commercial projects. For anything commercial you'll need a [subscription](https://the-trivia-api.com/pricing/).
