export interface Card {
  id: string;
  title: string;
  description: string;
  tags: string[];
  color: string;
  dueDate: string | null;
  columnId: string;
  assignee?: string;
  priority?: 'low' | 'medium' | 'high';
  createdAt: number;
  updatedAt: number;
}

export interface Column {
  id: string;
  title: string;
  cardIds: string[];
  createdAt: number;
}

export interface BoardState {
  cards: Record<string, Card>;
  columns: Record<string, Column>;
  columnOrder: string[];
}

export type CardColor = 
  | '#137fec'  // Primary blue
  | '#10b981'  // Emerald
  | '#f59e0b'  // Amber
  | '#f43f5e'  // Rose
  | '#8b5cf6'  // Violet
  | '#ec9213'; // Orange

export const CARD_COLORS: { value: CardColor; label: string }[] = [
  { value: '#137fec', label: 'Blue' },
  { value: '#10b981', label: 'Green' },
  { value: '#f59e0b', label: 'Amber' },
  { value: '#f43f5e', label: 'Rose' },
  { value: '#8b5cf6', label: 'Violet' },
  { value: '#ec9213', label: 'Orange' },
];

export const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  'Design System': { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  'Bug Fix': { bg: 'bg-orange-500/10', text: 'text-orange-400' },
  'Research': { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  'Frontend': { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  'Backend': { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  'Design': { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  'Content': { bg: 'bg-blue-500/10', text: 'text-blue-400' },
};
