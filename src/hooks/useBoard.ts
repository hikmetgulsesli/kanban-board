import { useState, useEffect, useCallback } from 'react';
import type { BoardState, Column, Card, Tag } from '../types';
import { getInitialState, saveState, generateId } from '../utils/storage';

export function useBoard() {
  const [state, setState] = useState<BoardState>(getInitialState);
  const [isLoaded, setIsLoaded] = useState(false);

  // Use effect for initial load
  useEffect(() => {
    // Mark as loaded after initial render
    const timer = setTimeout(() => setIsLoaded(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveState(state);
    }
  }, [state, isLoaded]);

  // Column operations
  const addColumn = useCallback((title: string) => {
    const newColumn: Column = {
      id: generateId(),
      title,
      order: state.columns.length,
    };
    setState(prev => ({
      ...prev,
      columns: [...prev.columns, newColumn],
    }));
    return newColumn.id;
  }, [state.columns.length]);

  const updateColumn = useCallback((id: string, title: string) => {
    setState(prev => ({
      ...prev,
      columns: prev.columns.map(col =>
        col.id === id ? { ...col, title } : col
      ),
    }));
  }, []);

  const deleteColumn = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      columns: prev.columns.filter(col => col.id !== id),
      cards: prev.cards.filter(card => card.columnId !== id),
    }));
  }, []);

  const reorderColumns = useCallback((newOrder: Column[]) => {
    setState(prev => ({
      ...prev,
      columns: newOrder.map((col, index) => ({ ...col, order: index })),
    }));
  }, []);

  // Card operations
  const addCard = useCallback((columnId: string, cardData: Partial<Card>) => {
    const newCard: Card = {
      id: generateId(),
      title: cardData.title || 'New Card',
      description: cardData.description || '',
      columnId,
      tags: cardData.tags || [],
      dueDate: cardData.dueDate,
      assignees: cardData.assignees || [],
      priority: cardData.priority || 'medium',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      cards: [...prev.cards, newCard],
    }));
    return newCard.id;
  }, []);

  const updateCard = useCallback((id: string, updates: Partial<Card>) => {
    setState(prev => ({
      ...prev,
      cards: prev.cards.map(card =>
        card.id === id
          ? { ...card, ...updates, updatedAt: new Date().toISOString() }
          : card
      ),
    }));
  }, []);

  const deleteCard = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      cards: prev.cards.filter(card => card.id !== id),
    }));
  }, []);

  const moveCard = useCallback((cardId: string, targetColumnId: string) => {
    setState(prev => ({
      ...prev,
      cards: prev.cards.map(card =>
        card.id === cardId
          ? { ...card, columnId: targetColumnId, updatedAt: new Date().toISOString() }
          : card
      ),
    }));
  }, []);

  const toggleCardComplete = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      cards: prev.cards.map(card =>
        card.id === id
          ? { ...card, completed: !card.completed, updatedAt: new Date().toISOString() }
          : card
      ),
    }));
  }, []);

  // Tag operations
  const addTag = useCallback((name: string, color: Tag['color']) => {
    const newTag: Tag = {
      id: generateId(),
      name,
      color,
    };
    setState(prev => ({
      ...prev,
      tags: [...prev.tags, newTag],
    }));
    return newTag.id;
  }, []);

  const deleteTag = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag.id !== id),
      cards: prev.cards.map(card => ({
        ...card,
        tags: card.tags.filter(tag => tag.id !== id),
      })),
    }));
  }, []);

  return {
    state,
    isLoaded,
    addColumn,
    updateColumn,
    deleteColumn,
    reorderColumns,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    toggleCardComplete,
    addTag,
    deleteTag,
  };
}
