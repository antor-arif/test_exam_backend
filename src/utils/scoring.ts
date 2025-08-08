export interface ScoreResult {
  percentage: number;
  levelAwarded: string;
  proceed: boolean;
}

export function calculateScoreForStep(step: number, correct: number, total = 44): ScoreResult {
  const percentage = parseFloat(((correct / total) * 100).toFixed(2));

  if (step === 1) {
    if (percentage < 25) return { percentage, levelAwarded: "Fail", proceed: false };
    if (percentage >= 25 && percentage < 50) return { percentage, levelAwarded: "A1", proceed: false };
    if (percentage >= 50 && percentage < 75) return { percentage, levelAwarded: "A2", proceed: false };
    if (percentage >= 75) return { percentage, levelAwarded: "A2", proceed: true };
  }

  if (step === 2) {
    if (percentage < 25) return { percentage, levelAwarded: "A2", proceed: false };
    if (percentage >= 25 && percentage < 50) return { percentage, levelAwarded: "B1", proceed: false };
    if (percentage >= 50 && percentage < 75) return { percentage, levelAwarded: "B2", proceed: false };
    if (percentage >= 75) return { percentage, levelAwarded: "B2", proceed: true };
  }

  if (step === 3) {
    if (percentage < 25) return { percentage, levelAwarded: "B2", proceed: false };
    if (percentage >= 25 && percentage < 50) return { percentage, levelAwarded: "C1", proceed: false };
    if (percentage >= 50) return { percentage, levelAwarded: "C2", proceed: false };
  }

  return { percentage, levelAwarded: "Unknown", proceed: false };
}
