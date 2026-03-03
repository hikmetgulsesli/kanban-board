/**
 * Board Provider Component
 * 
 * Separate file for provider component to satisfy fast refresh requirements
 */

import { useReducer, useCallback, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import type {
  BoardState,
  BoardAction,
  BoardData,
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
import { loadBoardData, saveBoardData } from '../services/storage.js';
import { BoardContext } from './BoardContext.js';

// ============================================
// ID Generator
// ============================================

function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// Default Data
// ============================================

const now = new Date().toISOString();

const defaultTags: Record<string, Tag> = {
  'tag-1': {
    id: 'tag-1',
    name: 'Design System',
    color: 'blue',
    createdAt: now,
    updatedAt: now,
  },
  'tag-2': {
    id: 'tag-2',
    name: 'Bug Fix',
    color: 'orange',
    createdAt: now,
    updatedAt: now,
  },
  'tag-3': {
    id: 'tag-3',
    name: 'Frontend',
    color: 'emerald',
    createdAt: now,
    updatedAt: now,
  },
  'tag-4': {
    id: 'tag-4',
    name: 'Backend',
    color: 'purple',
    createdAt: now,
    updatedAt: now,
  },
  'tag-5': {
    id: 'tag-5',
    name: 'Research',
    color: 'cyan',
    createdAt: now,
    updatedAt: now,
  },
};

const defaultColumns: Record<string, Column> = {
  'col-1': {
    id: 'col-1',
    title: 'To Do',
    cardIds: ['card-1', 'card-2', 'card-3'],
    createdAt: now,
    updatedAt: now,
  },
  'col-2': {
    id: 'col-2',
    title: 'In Progress',
    cardIds: ['card-4', 'card-5'],
    createdAt: now,
    updatedAt: now,
  },
  'col-3': {
    id: 'col-3',
    title: 'Done',
    cardIds: ['card-6', 'card-7'],
    createdAt: now,
    updatedAt: now,
  },
};

const defaultCards: Record<string, Card> = {
  'card-1': {
    id: 'card-1',
    title: 'Update color palette tokens',
    description: 'Review current design tokens and propose changes for dark mode contrast ratios.',
    columnId: 'col-1',
    tagIds: ['tag-1'],
    priority: 'medium',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    assignee: 'JS',
    createdAt: now,
    updatedAt: now,
  },
  'card-2': {
    id: 'card-2',
    title: 'Login timeout issue',
    description: 'Users are being logged out unexpectedly after 5 minutes of inactivity.',
    columnId: 'col-1',
    tagIds: ['tag-2'],
    priority: 'high',
    dueDate: null,
    assignee: 'MK',
    createdAt: now,
    updatedAt: now,
  },
  'card-3': {
    id: 'card-3',
    title: 'Competitor Analysis Q3',
    description: 'Analyze feature sets of top 3 competitors for the upcoming quarterly review.',
    columnId: 'col-1',
    tagIds: ['tag-5'],
    priority: 'low',
    dueDate: null,
    assignee: null,
    createdAt: now,
    updatedAt: now,
  },
  'card-4': {
    id: 'card-4',
    title: 'Implement Dark Mode Toggle',
    description: 'Create the switch component and hook it up to the theme context provider.',
    columnId: 'col-2',
    tagIds: ['tag-3'],
    priority: 'medium',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    assignee: 'AS',
    createdAt: now,
    updatedAt: now,
  },
  'card-5': {
    id: 'card-5',
    title: 'Q3 Newsletter Draft',
    description: 'Write copy for the upcoming product release email blast.',
    columnId: 'col-2',
    tagIds: [],
    priority: 'low',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    assignee: 'LJ',
    createdAt: now,
    updatedAt: now,
  },
  'card-6': {
    id: 'card-6',
    title: 'API Endpoint Optimization',
    description: 'Refactor the user data endpoint to reduce latency by 20%.',
    columnId: 'col-3',
    tagIds: ['tag-4'],
    priority: 'high',
    dueDate: null,
    assignee: 'JS',
    createdAt: now,
    updatedAt: now,
  },
  'card-7': {
    id: 'card-7',
    title: 'Homepage Hero Assets',
    description: 'Create hero images and graphics for the new homepage design.',
    columnId: 'col-3',
    tagIds: ['tag-1'],
    priority: 'medium',
    dueDate: null,
    assignee: null,
    createdAt: now,
    updatedAt: now,
  },
};

const defaultBoard = {
  id: 'board-1',
  title: 'Sprint Board - Q3 Goals',
  description: 'Main board for Q3 sprint planning and tracking',
  columnIds: ['col-1', 'col-2', 'col-3'],
  tagIds: Object.keys(defaultTags),
  createdAt: now,
  updatedAt: now,
};

const defaultFilters: BoardFilters = {
  searchQuery: '',
  selectedTagIds: [],
  priorityFilter: 'all',
  dueDateFilter: 'all',
  assigneeFilter: 'all',
};

const defaultSettings: BoardSettings = {
  compactView: false,
  showAnimations: true,
};

const initialState: BoardState = {
  board: defaultBoard,
  columns: defaultColumns,
  cards: defaultCards,
  tags: defaultTags,
  filters: defaultFilters,
  settings: defaultSettings,
  isLoading: true,
  error: null,
};

// ============================================
// Reducer
// ============================================

function boardReducer(state: BoardState, action: BoardAction): BoardState {
  const timestamp = new Date().toISOString();

  switch (action.type) {
    case 'SET_STATE':
      return { ...state, ...action.payload };

    case 'CREATE_CARD': {
      const newCard = { ...action.payload, updatedAt: timestamp };
      const column = state.columns[newCard.columnId];
      return {
        ...state,
        cards: { ...state.cards, [newCard.id]: newCard },
        columns: {
          ...state.columns,
          [newCard.columnId]: {
            ...column,
            cardIds: [...column.cardIds, newCard.id],
            updatedAt: timestamp,
          },
        },
      };
    }

    case 'UPDATE_CARD': {
      const { id, updates } = action.payload;
      const card = state.cards[id];
      if (!card) return state;
      return {
        ...state,
        cards: {
          ...state.cards,
          [id]: { ...card, ...updates, updatedAt: timestamp },
        },
      };
    }

    case 'DELETE_CARD': {
      const cardId = action.payload;
      const card = state.cards[cardId];
      if (!card) return state;
      
      const remainingCards = { ...state.cards };
      delete remainingCards[cardId];
      
      const column = state.columns[card.columnId];
      
      return {
        ...state,
        cards: remainingCards,
        columns: {
          ...state.columns,
          [card.columnId]: {
            ...column,
            cardIds: column.cardIds.filter((id) => id !== cardId),
            updatedAt: timestamp,
          },
        },
      };
    }

    case 'MOVE_CARD': {
      const { cardId, sourceColumnId, targetColumnId, targetIndex } = action.payload;
      const sourceColumn = state.columns[sourceColumnId];
      const targetColumn = state.columns[targetColumnId];
      
      if (!sourceColumn || !targetColumn) return state;
      
      const sourceCardIds = [...sourceColumn.cardIds];
      const targetCardIds = sourceColumnId === targetColumnId 
        ? sourceCardIds 
        : [...targetColumn.cardIds];
      
      // Remove from source
      const sourceIndex = sourceCardIds.indexOf(cardId);
      if (sourceIndex === -1) return state;
      sourceCardIds.splice(sourceIndex, 1);
      
      // Calculate actual insert index for same-column moves
      const adjustedTargetIndex = sourceColumnId === targetColumnId && sourceIndex < targetIndex
        ? targetIndex - 1 
        : targetIndex;
      
      // Insert at target
      targetCardIds.splice(adjustedTargetIndex, 0, cardId);
      
      return {
        ...state,
        cards: {
          ...state.cards,
          [cardId]: {
            ...state.cards[cardId],
            columnId: targetColumnId,
            updatedAt: timestamp,
          },
        },
        columns: {
          ...state.columns,
          [sourceColumnId]: {
            ...sourceColumn,
            cardIds: sourceColumnId === targetColumnId ? targetCardIds : sourceCardIds,
            updatedAt: timestamp,
          },
          ...(sourceColumnId !== targetColumnId && {
            [targetColumnId]: {
              ...targetColumn,
              cardIds: targetCardIds,
              updatedAt: timestamp,
            },
          }),
        },
      };
    }

    case 'CREATE_COLUMN': {
      const newColumn = { ...action.payload, updatedAt: timestamp };
      return {
        ...state,
        columns: { ...state.columns, [newColumn.id]: newColumn },
        board: {
          ...state.board,
          columnIds: [...state.board.columnIds, newColumn.id],
          updatedAt: timestamp,
        },
      };
    }

    case 'UPDATE_COLUMN': {
      const { id, updates } = action.payload;
      const column = state.columns[id];
      if (!column) return state;
      return {
        ...state,
        columns: {
          ...state.columns,
          [id]: { ...column, ...updates, updatedAt: timestamp },
        },
      };
    }

    case 'DELETE_COLUMN': {
      const columnId = action.payload;
      const column = state.columns[columnId];
      if (!column) return state;
      
      const remainingColumns = { ...state.columns };
      delete remainingColumns[columnId];
      
      // Delete all cards in the column
      const cardsToDelete = column.cardIds;
      const remainingCards = Object.fromEntries(
        Object.entries(state.cards).filter(([id]) => !cardsToDelete.includes(id))
      );
      
      return {
        ...state,
        columns: remainingColumns,
        cards: remainingCards,
        board: {
          ...state.board,
          columnIds: state.board.columnIds.filter((id) => id !== columnId),
          updatedAt: timestamp,
        },
      };
    }

    case 'REORDER_COLUMNS': {
      return {
        ...state,
        board: {
          ...state.board,
          columnIds: action.payload,
          updatedAt: timestamp,
        },
      };
    }

    case 'CREATE_TAG': {
      const newTag = { ...action.payload, updatedAt: timestamp };
      return {
        ...state,
        tags: { ...state.tags, [newTag.id]: newTag },
        board: {
          ...state.board,
          tagIds: [...state.board.tagIds, newTag.id],
          updatedAt: timestamp,
        },
      };
    }

    case 'UPDATE_TAG': {
      const { id, updates } = action.payload;
      const tag = state.tags[id];
      if (!tag) return state;
      return {
        ...state,
        tags: {
          ...state.tags,
          [id]: { ...tag, ...updates, updatedAt: timestamp },
        },
      };
    }

    case 'DELETE_TAG': {
      const tagId = action.payload;
      const remainingTags = { ...state.tags };
      delete remainingTags[tagId];
      
      // Remove tag from all cards
      const updatedCards = Object.fromEntries(
        Object.entries(state.cards).map(([id, card]) => [
          id,
          { ...card, tagIds: card.tagIds.filter((tid) => tid !== tagId) },
        ])
      );
      
      return {
        ...state,
        tags: remainingTags,
        cards: updatedCards,
        board: {
          ...state.board,
          tagIds: state.board.tagIds.filter((id) => id !== tagId),
          updatedAt: timestamp,
        },
      };
    }

    case 'SET_FILTERS':
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };

    case 'SET_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    default:
      return state;
  }
}

// ============================================
// Provider
// ============================================

interface BoardProviderProps {
  children: ReactNode;
  initialData?: BoardData;
}

export function BoardProvider({ children, initialData }: BoardProviderProps) {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    if (initialData) {
      dispatch({
        type: 'SET_STATE',
        payload: {
          ...initialData,
          filters: defaultFilters,
          settings: defaultSettings,
          isLoading: false,
        },
      });
    } else {
      const savedData = loadBoardData();
      if (savedData) {
        dispatch({
          type: 'SET_STATE',
          payload: {
            ...savedData,
            filters: defaultFilters,
            settings: defaultSettings,
            isLoading: false,
          },
        });
      } else {
        dispatch({ type: 'SET_STATE', payload: { isLoading: false } });
      }
    }
  }, [initialData]);

  // Save to localStorage on changes
  useEffect(() => {
    if (!state.isLoading) {
      const dataToSave: BoardData = {
        board: state.board,
        columns: state.columns,
        cards: state.cards,
        tags: state.tags,
      };
      saveBoardData(dataToSave);
    }
  }, [state.board, state.columns, state.cards, state.tags, state.isLoading]);

  // Card actions
  const createCard = useCallback((input: CreateCardInput) => {
    const now = new Date().toISOString();
    const newCard: Card = {
      id: generateId(),
      title: input.title,
      description: input.description || '',
      columnId: input.columnId,
      tagIds: input.tagIds || [],
      priority: input.priority || 'medium',
      dueDate: input.dueDate || null,
      assignee: input.assignee || null,
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: 'CREATE_CARD', payload: newCard });
  }, []);

  const updateCard = useCallback((id: string, updates: UpdateCardInput) => {
    dispatch({ type: 'UPDATE_CARD', payload: { id, updates } });
  }, []);

  const deleteCard = useCallback((id: string) => {
    dispatch({ type: 'DELETE_CARD', payload: id });
  }, []);

  const moveCard = useCallback((cardId: string, sourceColumnId: string, targetColumnId: string, targetIndex: number) => {
    dispatch({
      type: 'MOVE_CARD',
      payload: { cardId, sourceColumnId, targetColumnId, targetIndex },
    });
  }, []);

  // Column actions
  const createColumn = useCallback((input: CreateColumnInput) => {
    const now = new Date().toISOString();
    const newColumn: Column = {
      id: generateId(),
      title: input.title,
      cardIds: [],
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: 'CREATE_COLUMN', payload: newColumn });
  }, []);

  const updateColumn = useCallback((id: string, updates: UpdateColumnInput) => {
    dispatch({ type: 'UPDATE_COLUMN', payload: { id, updates } });
  }, []);

  const deleteColumn = useCallback((id: string) => {
    dispatch({ type: 'DELETE_COLUMN', payload: id });
  }, []);

  const reorderColumns = useCallback((columnIds: string[]) => {
    dispatch({ type: 'REORDER_COLUMNS', payload: columnIds });
  }, []);

  // Tag actions
  const createTag = useCallback((name: string, color: TagColor) => {
    const now = new Date().toISOString();
    const newTag: Tag = {
      id: generateId(),
      name,
      color,
      createdAt: now,
      updatedAt: now,
    };
    dispatch({ type: 'CREATE_TAG', payload: newTag });
  }, []);

  const updateTag = useCallback((id: string, updates: UpdateTagInput) => {
    dispatch({ type: 'UPDATE_TAG', payload: { id, updates } });
  }, []);

  const deleteTag = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TAG', payload: id });
  }, []);

  // Filter actions
  const setFilters = useCallback((filters: Partial<BoardFilters>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const clearFilters = useCallback(() => {
    dispatch({ type: 'SET_FILTERS', payload: defaultFilters });
  }, []);

  // Settings actions
  const setSettings = useCallback((settings: Partial<BoardSettings>) => {
    dispatch({ type: 'SET_SETTINGS', payload: settings });
  }, []);

  // Getters
  const getCardsByColumn = useCallback(
    (columnId: string) => {
      const column = state.columns[columnId];
      if (!column) return [];
      return column.cardIds.map((id) => state.cards[id]).filter(Boolean);
    },
    [state.columns, state.cards]
  );

  const getTagById = useCallback(
    (id: string) => state.tags[id],
    [state.tags]
  );

  const getColumnById = useCallback(
    (id: string) => state.columns[id],
    [state.columns]
  );

  const getCardById = useCallback(
    (id: string) => state.cards[id],
    [state.cards]
  );

  const getFilteredCards = useCallback(() => {
    let cards = Object.values(state.cards);
    
    if (state.filters.searchQuery) {
      const query = state.filters.searchQuery.toLowerCase();
      cards = cards.filter(
        (card) =>
          card.title.toLowerCase().includes(query) ||
          card.description.toLowerCase().includes(query)
      );
    }
    
    if (state.filters.selectedTagIds.length > 0) {
      cards = cards.filter((card) =>
        state.filters.selectedTagIds.some((tagId) => card.tagIds.includes(tagId))
      );
    }
    
    if (state.filters.priorityFilter !== 'all') {
      cards = cards.filter(
        (card) => card.priority === state.filters.priorityFilter
      );
    }
    
    return cards;
  }, [state.cards, state.filters]);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      createCard,
      updateCard,
      deleteCard,
      moveCard,
      createColumn,
      updateColumn,
      deleteColumn,
      reorderColumns,
      createTag,
      updateTag,
      deleteTag,
      setFilters,
      clearFilters,
      setSettings,
      getCardsByColumn,
      getTagById,
      getColumnById,
      getCardById,
      getFilteredCards,
    }),
    [
      state,
      createCard,
      updateCard,
      deleteCard,
      moveCard,
      createColumn,
      updateColumn,
      deleteColumn,
      reorderColumns,
      createTag,
      updateTag,
      deleteTag,
      setFilters,
      clearFilters,
      setSettings,
      getCardsByColumn,
      getTagById,
      getColumnById,
      getCardById,
      getFilteredCards,
    ]
  );

  return (
    <BoardContext.Provider value={value}>
      {children}
    </BoardContext.Provider>
  );
}
