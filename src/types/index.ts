export interface Card {
  id: string;
  title: string;
  description: string;
  columnId: string;
  tags: string[];
  color: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  order: number;
  cardIds: string[];
}

export interface KanbanState {
  columns: Column[];
  cards: Record<string, Card>;
}

export type CardColor = 'blue' | 'orange' | 'purple' | 'emerald' | 'red' | 'cyan';

export const CARD_COLORS: Record<CardColor, { bg: string; border: string; text: string }> = {
  blue: { bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-400' },
  orange: { bg: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-400' },
  purple: { bg: 'bg-purple-500', border: 'border-purple-500', text: 'text-purple-400' },
  emerald: { bg: 'bg-emerald-500', border: 'border-emerald-500', text: 'text-emerald-400' },
  red: { bg: 'bg-red-500', border: 'border-red-500', text: 'text-red-400' },
  cyan: { bg: 'bg-cyan-500', border: 'border-cyan-500', text: 'text-cyan-400' },
};

export const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  'Design System': { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  'Bug Fix': { bg: 'bg-orange-500/10', text: 'text-orange-400' },
  'Research': { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  'Frontend': { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  'Backend': { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  'Content': { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  'Design': { bg: 'bg-blue-500/10', text: 'text-blue-400' },
};

export const DEFAULT_TAGS = [
  'Design System',
  'Bug Fix',
  'Research',
  'Frontend',
  'Backend',
  'Content',
  'Design',
];
