import { useState, useEffect, useCallback } from 'react';
import type { Board, Column, Card, Tag, FilterState, DueDateFilter } from '../types/index.js';

const STORAGE_KEY = 'kanban-board-data';
const FILTERS_STORAGE_KEY = 'kanban-filters';

// Default tags
const defaultTags: Tag[] = [
  { id: 'tag-1', name: 'Design System', color: 'blue' },
  { id: 'tag-2', name: 'Bug Fix', color: 'orange' },
  { id: 'tag-3', name: 'Research', color: 'purple' },
  { id: 'tag-4', name: 'Frontend', color: 'emerald' },
  { id: 'tag-5', name: 'Backend', color: 'red' },
  { id: 'tag-6', name: 'Content', color: 'yellow' },
];

// Default board data
const createDefaultBoard = (): Board => ({
  id: 'board-1',
  title: 'Sprint Board - Q3 Goals',
  columns: [
    {
      id: 'col-1',
      title: 'To Do',
      order: 0,
      cards: [
        {
          id: 'card-1',
          title: 'Update color palette tokens',
          description: 'Review current design tokens and propose changes for dark mode contrast ratios.',
          tags: [defaultTags[0]],
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          columnId: 'col-1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'card-2',
          title: 'Login timeout issue',
          description: 'Users are being logged out unexpectedly after 5 minutes of inactivity.',
          tags: [defaultTags[1]],
          dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          columnId: 'col-1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'card-3',
          title: 'Competitor Analysis Q3',
          description: 'Analyze feature sets of top 3 competitors for the upcoming quarterly review.',
          tags: [defaultTags[2]],
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          columnId: 'col-1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    },
    {
      id: 'col-2',
      title: 'In Progress',
      order: 1,
      cards: [
        {
          id: 'card-4',
          title: 'Implement Dark Mode Toggle',
          description: 'Create the switch component and hook it up to the theme context provider.',
          tags: [defaultTags[3]],
          dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          columnId: 'col-2',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'card-5',
          title: 'Q3 Newsletter Draft',
          description: 'Write copy for the upcoming product release email blast.',
          tags: [defaultTags[5]],
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          columnId: 'col-2',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    },
    {
      id: 'col-3',
      title: 'Done',
      order: 2,
      cards: [
        {
          id: 'card-6',
          title: 'API Endpoint Optimization',
          description: 'Refactor the user data endpoint to reduce latency by 20%.',
          tags: [defaultTags[4]],
          dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          columnId: 'col-3',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'card-7',
          title: 'Homepage Hero Assets',
          description: 'Create hero images and graphics for the new homepage design.',
          tags: [defaultTags[0]],
          dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          columnId: 'col-3',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    },
  ],
});

// Load board from localStorage
const loadBoard = (): Board => {
  if (typeof window === 'undefined') return createDefaultBoard();
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as Board;
    } catch {
      return createDefaultBoard();
    }
  }
  return createDefaultBoard();
};

// Save board to localStorage
const saveBoard = (board: Board): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
};

// Load filters from localStorage
const loadFilters = (): FilterState => {
  if (typeof window === 'undefined') {
    return { searchText: '', selectedTags: [], dueDateFilter: 'all' };
  }
  const stored = localStorage.getItem(FILTERS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as FilterState;
    } catch {
      return { searchText: '', selectedTags: [], dueDateFilter: 'all' };
    }
  }
  return { searchText: '', selectedTags: [], dueDateFilter: 'all' };
};

// Save filters to localStorage
const saveFilters = (filters: FilterState): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
};

// Generate unique ID
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Filter cards based on filter state
const filterCards = (cards: Card[], filters: FilterState): Card[] => {
  return cards.filter((card) => {
    // Text search filter
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      const matchesTitle = card.title.toLowerCase().includes(searchLower);
      const matchesDescription = card.description.toLowerCase().includes(searchLower);
      if (!matchesTitle && !matchesDescription) return false;
    }

    // Tag filter
    if (filters.selectedTags.length > 0) {
      const cardTagIds = card.tags.map((t) => t.id);
      const hasMatchingTag = filters.selectedTags.some((tagId) => cardTagIds.includes(tagId));
      if (!hasMatchingTag) return false;
    }

    // Due date filter
    if (filters.dueDateFilter !== 'all' && card.dueDate) {
      const now = new Date();
      const dueDate = new Date(card.dueDate);
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const cardDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

      switch (filters.dueDateFilter) {
        case 'overdue':
          if (cardDate >= today) return false;
          break;
        case 'today':
          if (cardDate.getTime() !== today.getTime()) return false;
          break;
        case 'this-week': {
          const weekEnd = new Date(today);
          weekEnd.setDate(today.getDate() + 7);
          if (cardDate < today || cardDate > weekEnd) return false;
          break;
        }
      }
    }

    return true;
  });
};

// Check if a card is overdue
const isOverdue = (card: Card): boolean => {
  if (!card.dueDate) return false;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDate = new Date(card.dueDate);
  const cardDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  return cardDate < today;
};

// Check if a card is due today
const isDueToday = (card: Card): boolean => {
  if (!card.dueDate) return false;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDate = new Date(card.dueDate);
  const cardDate = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
  return cardDate.getTime() === today.getTime();
};

// Custom hook for kanban board state
export function useKanbanStore() {
  const [board, setBoard] = useState<Board>(createDefaultBoard());
  const [filters, setFilters] = useState<FilterState>({
    searchText: '',
    selectedTags: [],
    dueDateFilter: 'all',
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setBoard(loadBoard());
    setFilters(loadFilters());
    setIsLoaded(true);
  }, []);

  // Save to localStorage when board changes
  useEffect(() => {
    if (isLoaded) {
      saveBoard(board);
    }
  }, [board, isLoaded]);

  // Save filters when they change
  useEffect(() => {
    if (isLoaded) {
      saveFilters(filters);
    }
  }, [filters, isLoaded]);

  // Get all unique tags from all cards
  const getAllTags = useCallback((): Tag[] => {
    const tagMap = new Map<string, Tag>();
    board.columns.forEach((column) => {
      column.cards.forEach((card) => {
        card.tags.forEach((tag) => {
          if (!tagMap.has(tag.id)) {
            tagMap.set(tag.id, tag);
          }
        });
      });
    });
    return Array.from(tagMap.values());
  }, [board]);

  // Get filtered columns
  const getFilteredColumns = useCallback((): Column[] => {
    return board.columns.map((column) => ({
      ...column,
      cards: filterCards(column.cards, filters),
    }));
  }, [board, filters]);

  // Get total card count (unfiltered)
  const getTotalCardCount = useCallback((): number => {
    return board.columns.reduce((total, column) => total + column.cards.length, 0);
  }, [board]);

  // Get filtered card count
  const getFilteredCardCount = useCallback((): number => {
    return getFilteredColumns().reduce((total, column) => total + column.cards.length, 0);
  }, [getFilteredColumns]);

  // Check if any filters are active
  const hasActiveFilters = useCallback((): boolean => {
    return (
      filters.searchText !== '' ||
      filters.selectedTags.length > 0 ||
      filters.dueDateFilter !== 'all'
    );
  }, [filters]);

  // Set search text
  const setSearchText = useCallback((text: string) => {
    setFilters((prev) => ({ ...prev, searchText: text }));
  }, []);

  // Toggle tag selection
  const toggleTag = useCallback((tagId: string) => {
    setFilters((prev) => {
      const selectedTags = prev.selectedTags.includes(tagId)
        ? prev.selectedTags.filter((id) => id !== tagId)
        : [...prev.selectedTags, tagId];
      return { ...prev, selectedTags };
    });
  }, []);

  // Set due date filter
  const setDueDateFilter = useCallback((filter: DueDateFilter) => {
    setFilters((prev) => ({ ...prev, dueDateFilter: filter }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      searchText: '',
      selectedTags: [],
      dueDateFilter: 'all',
    });
  }, []);

  // Add a new card
  const addCard = useCallback((columnId: string, cardData: Omit<Card, 'id' | 'columnId' | 'createdAt' | 'updatedAt'>) => {
    const newCard: Card = {
      ...cardData,
      id: generateId(),
      columnId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((column) =>
        column.id === columnId
          ? { ...column, cards: [...column.cards, newCard] }
          : column
      ),
    }));

    return newCard;
  }, []);

  // Update a card
  const updateCard = useCallback((cardId: string, updates: Partial<Card>) => {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((column) => ({
        ...column,
        cards: column.cards.map((card) =>
          card.id === cardId
            ? { ...card, ...updates, updatedAt: new Date().toISOString() }
            : card
        ),
      })),
    }));
  }, []);

  // Delete a card
  const deleteCard = useCallback((cardId: string) => {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((column) => ({
        ...column,
        cards: column.cards.filter((card) => card.id !== cardId),
      })),
    }));
  }, []);

  // Move card to different column
  const moveCard = useCallback((cardId: string, targetColumnId: string) => {
    setBoard((prev) => {
      let cardToMove: Card | null = null;

      // Find and remove card from source column
      const updatedColumns = prev.columns.map((column) => {
        const cardIndex = column.cards.findIndex((c) => c.id === cardId);
        if (cardIndex !== -1) {
          cardToMove = column.cards[cardIndex];
          return {
            ...column,
            cards: column.cards.filter((c) => c.id !== cardId),
          };
        }
        return column;
      });

      // Add card to target column
      if (cardToMove) {
        return {
          ...prev,
          columns: updatedColumns.map((column) =>
            column.id === targetColumnId
              ? {
                  ...column,
                  cards: [
                    ...column.cards,
                    { ...cardToMove!, columnId: targetColumnId, updatedAt: new Date().toISOString() },
                  ],
                }
              : column
          ),
        };
      }

      return prev;
    });
  }, []);

  // Add a new column
  const addColumn = useCallback((title: string) => {
    const newColumn: Column = {
      id: generateId(),
      title,
      order: board.columns.length,
      cards: [],
    };

    setBoard((prev) => ({
      ...prev,
      columns: [...prev.columns, newColumn],
    }));

    return newColumn;
  }, [board.columns.length]);

  // Update column
  const updateColumn = useCallback((columnId: string, updates: Partial<Column>) => {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((column) =>
        column.id === columnId ? { ...column, ...updates } : column
      ),
    }));
  }, []);

  // Delete column
  const deleteColumn = useCallback((columnId: string) => {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.filter((column) => column.id !== columnId),
    }));
  }, []);

  // Reorder columns
  const reorderColumns = useCallback((newOrder: Column[]) => {
    setBoard((prev) => ({
      ...prev,
      columns: newOrder.map((col, index) => ({ ...col, order: index })),
    }));
  }, []);

  return {
    board,
    filters,
    isLoaded,
    getAllTags,
    getFilteredColumns,
    getTotalCardCount,
    getFilteredCardCount,
    hasActiveFilters,
    setSearchText,
    toggleTag,
    setDueDateFilter,
    clearFilters,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    addColumn,
    updateColumn,
    deleteColumn,
    reorderColumns,
    isOverdue,
    isDueToday,
    defaultTags,
  };
}
