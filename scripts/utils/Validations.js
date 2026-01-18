export function isValidName(name) {
  return (
    typeof name === "string" &&
    name.trim().length > 0 &&
    name.length <= 15
  );
}

export function isValidScore(score) {
  return (
    typeof score === "number" &&
    !isNaN(score) &&
    score >= 0
  );
}

export function isValidScoreEntry(entry) {
  return (
    entry &&
    isValidName(entry.name) &&
    isValidScore(entry.score)
  );
}
