/**
 * Board Context Value Types
 * 
 * Separate file for context types to satisfy fast refresh requirements
 */

import type { Dispatch } from 'react';
import type {
  BoardState,
  BoardAction,
  Card,
  Column,
  Tag,
  CreateCardInput,
  UpdateCardInput,
  CreateColumnInput,
  UpdateColumnInput,
  UpdateTagInput,
  TagColor,
  BoardFilters,
  BoardSettings,
} from '../types/index.js';

export interface BoardContextValue {
  state: BoardState;
  dispatch: Dispatch<BoardAction>;
  
  // Card actions
  createCard: (input: CreateCardInput) => void;
  updateCard: (id: string, updates: UpdateCardInput) => void;
  deleteCard: (id: string) => void;
  moveCard: (cardId: string, sourceColumnId: string, targetColumnId: string, targetIndex: number) => void;
  
  // Column actions
  createColumn: (input: CreateColumnInput) => void;
  updateColumn: (id: string, updates: UpdateColumnInput) => void;
  deleteColumn: (id: string) => void;
  reorderColumns: (columnIds: string[]) => void;
  
  // Tag actions
  createTag: (name: string, color: TagColor) => void;
  updateTag: (id: string, updates: UpdateTagInput) => void;
  deleteTag: (id: string) => void;
  
  // Filter actions
  setFilters: (filters: Partial<BoardFilters>) => void;
  clearFilters: () => void;
  
  // Settings actions
  setSettings: (settings: Partial<BoardSettings>) => void;
  
  // Getters
  getCardsByColumn: (columnId: string) => Card[];
  getTagById: (id: string) => Tag | undefined;
  getColumnById: (id: string) => Column | undefined;
  getCardById: (id: string) => Card | undefined;
  getFilteredCards: () => Card[];
}
