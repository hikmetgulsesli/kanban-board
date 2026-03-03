import { useState, useCallback, useEffect } from 'react';
import type { Card, Column, KanbanState } from '../types/index.js';

const STORAGE_KEY = 'kanban-board-data';

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const getInitialState = (): KanbanState => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // Fall through to default
      }
    }
  }
  
  // Default initial state
  const todoColumn: Column = {
    id: generateId(),
    title: 'To Do',
    order: 0,
    cardIds: [],
  };
  
  const inProgressColumn: Column = {
    id: generateId(),
    title: 'In Progress',
    order: 1,
    cardIds: [],
  };
  
  const doneColumn: Column = {
    id: generateId(),
    title: 'Done',
    order: 2,
    cardIds: [],
  };
  
  return {
    columns: [todoColumn, inProgressColumn, doneColumn],
    cards: {},
  };
};

export function useKanbanStore() {
  const [state, setState] = useState<KanbanState>(getInitialState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setState(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse kanban data:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  // Card CRUD Operations
  const createCard = useCallback((columnId: string, cardData: Omit<Card, 'id' | 'columnId' | 'createdAt' | 'updatedAt'>): Card => {
    const now = new Date().toISOString();
    const newCard: Card = {
      id: generateId(),
      columnId,
      ...cardData,
      createdAt: now,
      updatedAt: now,
    };

    setState((prev) => {
      const column = prev.columns.find((c) => c.id === columnId);
      if (!column) return prev;

      return {
        ...prev,
        cards: { ...prev.cards, [newCard.id]: newCard },
        columns: prev.columns.map((c) =>
          c.id === columnId ? { ...c, cardIds: [...c.cardIds, newCard.id] } : c
        ),
      };
    });

    return newCard;
  }, []);

  const updateCard = useCallback((cardId: string, updates: Partial<Omit<Card, 'id' | 'createdAt' | 'updatedAt'>>): Card | null => {
    setState((prev) => {
      const card = prev.cards[cardId];
      if (!card) return prev;

      const updatedCard: Card = {
        ...card,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      return {
        ...prev,
        cards: { ...prev.cards, [cardId]: updatedCard },
      };
    });

    return state.cards[cardId] ? { ...state.cards[cardId], ...updates, updatedAt: new Date().toISOString() } : null;
  }, [state.cards]);

  const deleteCard = useCallback((cardId: string): boolean => {
    let deleted = false;

    setState((prev) => {
      const card = prev.cards[cardId];
      if (!card) return prev;

      deleted = true;
      const { [cardId]: _removed, ...remainingCards } = prev.cards;
      void _removed;

      return {
        ...prev,
        cards: remainingCards,
        columns: prev.columns.map((c) =>
          c.id === card.columnId ? { ...c, cardIds: c.cardIds.filter((id) => id !== cardId) } : c
        ),
      };
    });

    return deleted;
  }, []);

  const getCard = useCallback((cardId: string): Card | undefined => {
    return state.cards[cardId];
  }, [state.cards]);

  const getCardsByColumn = useCallback((columnId: string): Card[] => {
    const column = state.columns.find((c) => c.id === columnId);
    if (!column) return [];
    return column.cardIds.map((id) => state.cards[id]).filter(Boolean);
  }, [state.columns, state.cards]);

  // Column Operations
  const createColumn = useCallback((title: string): Column => {
    const newColumn: Column = {
      id: generateId(),
      title,
      order: state.columns.length,
      cardIds: [],
    };

    setState((prev) => ({
      ...prev,
      columns: [...prev.columns, newColumn],
    }));

    return newColumn;
  }, [state.columns.length]);

  const updateColumn = useCallback((columnId: string, updates: Partial<Column>): Column | null => {
    const column = state.columns.find((c) => c.id === columnId);
    if (!column) return null;

    const updatedColumn = { ...column, ...updates };

    setState((prev) => ({
      ...prev,
      columns: prev.columns.map((c) => (c.id === columnId ? updatedColumn : c)),
    }));

    return updatedColumn;
  }, [state.columns]);

  const deleteColumn = useCallback((columnId: string): boolean => {
    const column = state.columns.find((c) => c.id === columnId);
    if (!column) return false;

    setState((prev) => {
      const newCards = { ...prev.cards };
      column.cardIds.forEach((id) => {
        delete newCards[id];
      });

      return {
        ...prev,
        cards: newCards,
        columns: prev.columns.filter((c) => c.id !== columnId),
      };
    });

    return true;
  }, [state.columns]);

  const moveCard = useCallback((cardId: string, targetColumnId: string, targetIndex?: number): boolean => {
    const card = state.cards[cardId];
    if (!card) return false;

    const sourceColumnId = card.columnId;
    if (sourceColumnId === targetColumnId && targetIndex === undefined) return false;

    setState((prev) => {
      const sourceColumn = prev.columns.find((c) => c.id === sourceColumnId);
      const targetColumn = prev.columns.find((c) => c.id === targetColumnId);
      
      if (!sourceColumn || !targetColumn) return prev;

      const newSourceCardIds = sourceColumn.cardIds.filter((id) => id !== cardId);
      const newTargetCardIds = [...targetColumn.cardIds];
      const insertIndex = targetIndex ?? newTargetCardIds.length;
      newTargetCardIds.splice(insertIndex, 0, cardId);

      return {
        ...prev,
        cards: {
          ...prev.cards,
          [cardId]: { ...card, columnId: targetColumnId, updatedAt: new Date().toISOString() },
        },
        columns: prev.columns.map((c) => {
          if (c.id === sourceColumnId) return { ...c, cardIds: newSourceCardIds };
          if (c.id === targetColumnId) return { ...c, cardIds: newTargetCardIds };
          return c;
        }),
      };
    });

    return true;
  }, [state.cards, state.columns]);

  const reorderColumns = useCallback((columnIds: string[]): boolean => {
    if (columnIds.length !== state.columns.length) return false;
    
    setState((prev) => ({
      ...prev,
      columns: columnIds
        .map((id) => prev.columns.find((c) => c.id === id))
        .filter((c): c is Column => c !== undefined)
        .map((c, index) => ({ ...c, order: index })),
    }));

    return true;
  }, [state.columns.length]);

  return {
    state,
    isLoaded,
    createCard,
    updateCard,
    deleteCard,
    getCard,
    getCardsByColumn,
    createColumn,
    updateColumn,
    deleteColumn,
    moveCard,
    reorderColumns,
  };
}
