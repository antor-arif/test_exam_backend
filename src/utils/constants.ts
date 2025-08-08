export const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;
export type Level = typeof LEVELS[number];

export const QUESTIONS_PER_STEP = 44;
export const COMPETENCIES_COUNT = 22;
