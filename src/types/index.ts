/**
 * Kanban Board Types
 * 
 * Core type definitions for the kanban board application
 */

// ============================================
// Enums & Constants
// ============================================

export const STORAGE_KEYS = {
  BOARD_DATA: 'kanban-board-data',
  BOARD_FILTERS: 'kanban-board-filters',
  BOARD_SETTINGS: 'kanban-board-settings',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

export type TagColor = 'blue' | 'orange' | 'purple' | 'emerald' | 'red' | 'cyan';

export type Priority = 'low' | 'medium' | 'high';

// ============================================
// Core Entity Types
// ============================================

export interface Tag {
  id: string;
  name: string;
  color: TagColor;
  createdAt: string;
  updatedAt: string;
}

export interface Card {
  id: string;
  title: string;
  description: string;
  columnId: string;
  tagIds: string[];
  priority: Priority;
  dueDate: string | null;
  assignee: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  cardIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  id: string;
  title: string;
  description: string;
  columnIds: string[];
  tagIds: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Data Container Types
// ============================================

export interface BoardData {
  board: Board;
  columns: Record<string, Column>;
  cards: Record<string, Card>;
  tags: Record<string, Tag>;
}

export interface BoardFilters {
  searchQuery: string;
  selectedTagIds: string[];
  priorityFilter: Priority | 'all';
  dueDateFilter: 'all' | 'today' | 'week' | 'overdue';
  assigneeFilter: string | 'all';
}

export interface BoardSettings {
  compactView: boolean;
  showAnimations: boolean;
}

// ============================================
// Input Types
// ============================================

export interface CreateCardInput {
  title: string;
  description?: string;
  columnId: string;
  tagIds?: string[];
  priority?: Priority;
  dueDate?: string | null;
  assignee?: string | null;
}

export interface UpdateCardInput {
  title?: string;
  description?: string;
  tagIds?: string[];
  priority?: Priority;
  dueDate?: string | null;
  assignee?: string | null;
}

export interface CreateColumnInput {
  title: string;
}

export interface UpdateColumnInput {
  title?: string;
}

export interface CreateTagInput {
  name: string;
  color: TagColor;
}

export interface UpdateTagInput {
  name?: string;
  color?: TagColor;
}

// ============================================
// Drag & Drop Types
// ============================================

export interface DragItem {
  id: string;
  type: 'card' | 'column';
}

export interface CardDragData {
  type: 'card';
  cardId: string;
  columnId: string;
  index: number;
}

export interface ColumnDragData {
  type: 'column';
  columnId: string;
  index: number;
}

export type DragData = CardDragData | ColumnDragData;

// ============================================
// State Types
// ============================================

export interface BoardState {
  board: Board;
  columns: Record<string, Column>;
  cards: Record<string, Card>;
  tags: Record<string, Tag>;
  filters: BoardFilters;
  settings: BoardSettings;
  isLoading: boolean;
  error: string | null;
}

export type BoardAction =
  | { type: 'SET_STATE'; payload: Partial<BoardState> }
  | { type: 'CREATE_CARD'; payload: Card }
  | { type: 'UPDATE_CARD'; payload: { id: string; updates: Partial<Card> } }
  | { type: 'DELETE_CARD'; payload: string }
  | { type: 'MOVE_CARD'; payload: { cardId: string; sourceColumnId: string; targetColumnId: string; targetIndex: number } }
  | { type: 'CREATE_COLUMN'; payload: Column }
  | { type: 'UPDATE_COLUMN'; payload: { id: string; updates: Partial<Column> } }
  | { type: 'DELETE_COLUMN'; payload: string }
  | { type: 'REORDER_COLUMNS'; payload: string[] }
  | { type: 'CREATE_TAG'; payload: Tag }
  | { type: 'UPDATE_TAG'; payload: { id: string; updates: Partial<Tag> } }
  | { type: 'DELETE_TAG'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<BoardFilters> }
  | { type: 'SET_SETTINGS'; payload: Partial<BoardSettings> }
  | { type: 'SET_ERROR'; payload: string | null };

// ============================================
// Utility Types
// ============================================

export type IdGenerator = () => string;

export interface FilteredCardResult {
  card: Card;
  column: Column;
  tags: Tag[];
}
