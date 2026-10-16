/**
 * Returns a shuffled copy of the array (a Fisher-Yates shuffle).
 *
 * The API returns the correct answer separately from the incorrect ones, so
 * they need mixing together. Avoid `array.sort(() => Math.random() - 0.5)`:
 * it's biased, so the correct answer would land in some positions more often
 * than others.
 */
export const shuffle = <T,>(items: readonly T[]): T[] => {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
