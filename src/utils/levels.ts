/** Career levels used to tag blog posts by difficulty, in ascending order. */
export const LEVELS = ['junior', 'mid', 'senior', 'staff', 'principal'] as const;

export type Level = (typeof LEVELS)[number];

export const LEVEL_LABELS: Record<Level, string> = {
  junior: 'Junior',
  mid: 'Mid-level',
  senior: 'Senior',
  staff: 'Staff',
  principal: 'Principal',
};
