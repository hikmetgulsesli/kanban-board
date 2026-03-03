import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Card, Column, BoardState, FilterState } from '../types';

const STORAGE_KEY = 'kanban-board-data';
const FILTER_STORAGE_KEY = 'kanban-board-filters';

const initialData: BoardState = {
  cards: {
    'card-1': {
      id: 'card-1',
      title: 'Update color palette tokens',
      description: 'Review current design tokens and propose changes for dark mode contrast ratios.',
      tags: ['Design System'],
      color: '#137fec',
      dueDate: '2026-09-12',
      columnId: 'col-1',
      assignee: 'JS',
      priority: 'medium',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    'card-2': {
      id: 'card-2',
      title: 'Login timeout issue',
      description: 'Users are being logged out unexpectedly after 5 minutes of inactivity.',
      tags: ['Bug Fix'],
      color: '#ec9213',
      dueDate: null,
      columnId: 'col-1',
      assignee: 'MK',
      priority: 'high',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    'card-3': {
      id: 'card-3',
      title: 'Competitor Analysis Q3',
      description: 'Analyze feature sets of top 3 competitors for the upcoming quarterly review.',
      tags: ['Research'],
      color: '#137fec',
      dueDate: null,
      columnId: 'col-1',
      assignee: undefined,
      priority: 'low',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    'card-4': {
      id: 'card-4',
      title: 'Implement Dark Mode Toggle',
      description: 'Create the switch component and hook it up to the theme context provider.',
      tags: ['Frontend'],
      color: '#10b981',
      dueDate: null,
      columnId: 'col-2',
      assignee: 'AS',
      priority: 'medium',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    'card-5': {
      id: 'card-5',
      title: 'Q3 Newsletter Draft',
      description: 'Write copy for the upcoming product release email blast.',
      tags: ['Content'],
      color: '#137fec',
      dueDate: null,
      columnId: 'col-2',
      assignee: 'LJ',
      priority: 'low',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    'card-6': {
      id: 'card-6',
      title: 'API Endpoint Optimization',
      description: 'Refactor the user data endpoint to reduce latency by 20%.',
      tags: ['Backend'],
      color: '#10b981',
      dueDate: null,
      columnId: 'col-3',
      assignee: 'JS',
      priority: 'high',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
    'card-7': {
      id: 'card-7',
      title: 'Homepage Hero Assets',
      description: 'Create hero images and graphics for the new homepage design.',
      tags: ['Design'],
      color: '#10b981',
      dueDate: null,
      columnId: 'col-3',
      assignee: undefined,
      priority: 'medium',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  },
  columns: {
    'col-1': {
      id: 'col-1',
      title: 'To Do',
      cardIds: ['card-1', 'card-2', 'card-3'],
      createdAt: Date.now(),
    },
    'col-2': {
      id: 'col-2',
      title: 'In Progress',
      cardIds: ['card-4', 'card-5'],
      createdAt: Date.now(),
    },
    'col-3': {
      id: 'col-3',
      title: 'Done',
      cardIds: ['card-6', 'card-7'],
      createdAt: Date.now(),
    },
  },
  columnOrder: ['col-1', 'col-2', 'col-3'],
};

const initialFilters: FilterState = {
  searchText: '',
  selectedTags: [],
  dueDateFilter: 'all',
};

function isOverdue(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const dueDate = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return dueDate < today;
}

function isToday(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const dueDate = new Date(dateStr);
  const today = new Date();
  return dueDate.toDateString() === today.toDateString();
}

function isThisWeek(dateStr: string | null): boolean {
  if (!dateStr) return false;
  const dueDate = new Date(dateStr);
  const today = new Date();
  const weekEnd = new Date(today);
  weekEnd.setDate(today.getDate() + 7);
  return dueDate >= today && dueDate <= weekEnd;
}

export function useBoard() {
  const [board, setBoard] = useState<BoardState>(initialData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Load board data
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setBoard(parsed);
      } catch (e) {
        console.error('Failed to parse board data:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Load filters
  useEffect(() => {
    const storedFilters = localStorage.getItem(FILTER_STORAGE_KEY);
    if (storedFilters) {
      try {
        setFilters(JSON.parse(storedFilters));
      } catch (e) {
        console.error('Failed to parse filters:', e);
      }
    }
  }, []);

  // Save board data
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
    }
  }, [board, isLoaded]);

  // Save filters
  useEffect(() => {
    localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const createCard = useCallback((columnId: string, cardData: Partial<Card>): Card => {
    const newCard: Card = {
      id: generateId(),
      title: cardData.title || 'New Card',
      description: cardData.description || '',
      tags: cardData.tags || [],
      color: cardData.color || '#137fec',
      dueDate: cardData.dueDate || null,
      columnId,
      assignee: cardData.assignee,
      priority: cardData.priority || 'medium',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setBoard((prev) => ({
      ...prev,
      cards: {
        ...prev.cards,
        [newCard.id]: newCard,
      },
      columns: {
        ...prev.columns,
        [columnId]: {
          ...prev.columns[columnId],
          cardIds: [...prev.columns[columnId].cardIds, newCard.id],
        },
      },
    }));

    return newCard;
  }, []);

  const updateCard = useCallback((cardId: string, updates: Partial<Card>): Card | null => {
    const card = board.cards[cardId];
    if (!card) return null;

    const updatedCard = {
      ...card,
      ...updates,
      updatedAt: Date.now(),
    };

    setBoard((prev) => ({
      ...prev,
      cards: {
        ...prev.cards,
        [cardId]: updatedCard,
      },
    }));

    return updatedCard;
  }, [board.cards]);

  const deleteCard = useCallback((cardId: string): boolean => {
    const card = board.cards[cardId];
    if (!card) return false;

    setBoard((prev) => {
      const remainingCards = { ...prev.cards };
      delete remainingCards[cardId];
      return {
        ...prev,
        cards: remainingCards,
        columns: {
          ...prev.columns,
          [card.columnId]: {
            ...prev.columns[card.columnId],
            cardIds: prev.columns[card.columnId].cardIds.filter((id) => id !== cardId),
          },
        },
      };
    });

    return true;
  }, [board.cards]);

  const moveCard = useCallback((cardId: string, targetColumnId: string, targetIndex?: number) => {
    const card = board.cards[cardId];
    if (!card) return;

    const sourceColumnId = card.columnId;

    setBoard((prev) => {
      const sourceColumn = prev.columns[sourceColumnId];
      const targetColumn = prev.columns[targetColumnId];

      const newSourceCardIds = sourceColumn.cardIds.filter((id) => id !== cardId);

      const newTargetCardIds = [...targetColumn.cardIds];
      const insertIndex = targetIndex !== undefined ? targetIndex : newTargetCardIds.length;
      newTargetCardIds.splice(insertIndex, 0, cardId);

      return {
        ...prev,
        cards: {
          ...prev.cards,
          [cardId]: {
            ...prev.cards[cardId],
            columnId: targetColumnId,
            updatedAt: Date.now(),
          },
        },
        columns: {
          ...prev.columns,
          [sourceColumnId]: {
            ...sourceColumn,
            cardIds: newSourceCardIds,
          },
          [targetColumnId]: {
            ...targetColumn,
            cardIds: newTargetCardIds,
          },
        },
      };
    });
  }, [board.cards]);

  const createColumn = useCallback((title: string): Column => {
    const newColumn: Column = {
      id: generateId(),
      title,
      cardIds: [],
      createdAt: Date.now(),
    };

    setBoard((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [newColumn.id]: newColumn,
      },
      columnOrder: [...prev.columnOrder, newColumn.id],
    }));

    return newColumn;
  }, []);

  const updateColumn = useCallback((columnId: string, title: string): Column | null => {
    const column = board.columns[columnId];
    if (!column) return null;

    const updatedColumn = { ...column, title };

    setBoard((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [columnId]: updatedColumn,
      },
    }));

    return updatedColumn;
  }, [board.columns]);

  const deleteColumn = useCallback((columnId: string): boolean => {
    const column = board.columns[columnId];
    if (!column || column.cardIds.length > 0) return false;

    setBoard((prev) => {
      const remainingColumns = { ...prev.columns };
      delete remainingColumns[columnId];
      return {
        ...prev,
        columns: remainingColumns,
        columnOrder: prev.columnOrder.filter((id) => id !== columnId),
      };
    });

    return true;
  }, [board.columns]);

  const reorderColumns = useCallback((newOrder: string[]) => {
    setBoard((prev) => ({
      ...prev,
      columnOrder: newOrder,
    }));
  }, []);

  const reorderCards = useCallback((columnId: string, newCardIds: string[]) => {
    setBoard((prev) => ({
      ...prev,
      columns: {
        ...prev.columns,
        [columnId]: {
          ...prev.columns[columnId],
          cardIds: newCardIds,
        },
      },
    }));
  }, []);

  // Filter functions
  const setSearchText = useCallback((text: string) => {
    setFilters((prev) => ({ ...prev, searchText: text }));
  }, []);

  const setSelectedTags = useCallback((tags: string[]) => {
    setFilters((prev) => ({ ...prev, selectedTags: tags }));
  }, []);

  const setDueDateFilter = useCallback((filter: FilterState['dueDateFilter']) => {
    setFilters((prev) => ({ ...prev, dueDateFilter: filter }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.searchText !== '' ||
      filters.selectedTags.length > 0 ||
      filters.dueDateFilter !== 'all'
    );
  }, [filters]);

  // Get all unique tags from cards
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    Object.values(board.cards).forEach((card) => {
      card.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [board.cards]);

  // Filter cards based on current filters
  const filteredCards = useMemo(() => {
    return Object.values(board.cards).filter((card) => {
      // Text search filter
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        const matchesTitle = card.title.toLowerCase().includes(searchLower);
        const matchesDescription = card.description.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesDescription) return false;
      }

      // Tag filter (AND logic - card must have ALL selected tags)
      if (filters.selectedTags.length > 0) {
        const hasAllTags = filters.selectedTags.every((tag) => card.tags.includes(tag));
        if (!hasAllTags) return false;
      }

      // Due date filter
      if (filters.dueDateFilter !== 'all') {
        switch (filters.dueDateFilter) {
          case 'overdue':
            if (!isOverdue(card.dueDate)) return false;
            break;
          case 'today':
            if (!isToday(card.dueDate)) return false;
            break;
          case 'thisWeek':
            if (!isThisWeek(card.dueDate)) return false;
            break;
        }
      }

      return true;
    });
  }, [board.cards, filters]);

  // Get filtered card IDs
  const filteredCardIds = useMemo(() => {
    return new Set(filteredCards.map((card) => card.id));
  }, [filteredCards]);

  return {
    board,
    isLoaded,
    filters,
    filteredCardIds,
    allTags,
    hasActiveFilters,
    createCard,
    updateCard,
    deleteCard,
    moveCard,
    createColumn,
    updateColumn,
    deleteColumn,
    reorderColumns,
    reorderCards,
    setSearchText,
    setSelectedTags,
    setDueDateFilter,
    clearFilters,
  };
}
