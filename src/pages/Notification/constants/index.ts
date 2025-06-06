export const TABS = ['all', 'social', 'earn', 'trade', 'transaction'] as const;
export type TabType = (typeof TABS)[number];
