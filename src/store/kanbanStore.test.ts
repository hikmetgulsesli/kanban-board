import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useKanbanStore } from './kanbanStore.js';
import type { Card } from '../types/index.js';

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useKanbanStore', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
  });

  describe('Card CRUD Operations', () => {
    it('should create a new card', () => {
      const { result } = renderHook(() => useKanbanStore());
      
      const columnId = result.current.state.columns[0].id;
      
      let newCard: Card | undefined;
      act(() => {
        newCard = result.current.createCard(columnId, {
          title: 'Test Card',
          description: 'Test Description',
          tags: ['Test'],
          color: 'blue',
          dueDate: null,
        });
      });

      expect(newCard).toBeDefined();
      expect(newCard?.title).toBe('Test Card');
      expect(newCard?.description).toBe('Test Description');
      expect(newCard?.tags).toEqual(['Test']);
      expect(newCard?.color).toBe('blue');
      expect(newCard?.columnId).toBe(columnId);
      expect(result.current.state.cards[newCard!.id]).toBeDefined();
    });

    it('should update an existing card', () => {
      const { result } = renderHook(() => useKanbanStore());
      
      const columnId = result.current.state.columns[0].id;
      
      let card: Card | undefined;
      act(() => {
        card = result.current.createCard(columnId, {
          title: 'Original Title',
          description: 'Original Description',
          tags: ['Tag1'],
          color: 'blue',
          dueDate: null,
        });
      });

      act(() => {
        result.current.updateCard(card!.id, {
          title: 'Updated Title',
          description: 'Updated Description',
          tags: ['Tag1', 'Tag2'],
          color: 'red',
        });
      });

      const updatedCard = result.current.state.cards[card!.id];
      expect(updatedCard.title).toBe('Updated Title');
      expect(updatedCard.description).toBe('Updated Description');
      expect(updatedCard.tags).toEqual(['Tag1', 'Tag2']);
      expect(updatedCard.color).toBe('red');
    });

    it('should delete a card', () => {
      const { result } = renderHook(() => useKanbanStore());
      
      const columnId = result.current.state.columns[0].id;
      
      let card: Card | undefined;
      act(() => {
        card = result.current.createCard(columnId, {
          title: 'Card to Delete',
          description: '',
          tags: [],
          color: 'blue',
          dueDate: null,
        });
      });

      const cardId = card!.id;
      
      act(() => {
        result.current.deleteCard(cardId);
      });

      expect(result.current.state.cards[cardId]).toBeUndefined();
      const column = result.current.state.columns.find(c => c.id === columnId);
      expect(column?.cardIds).not.toContain(cardId);
    });

    it('should get cards by column', () => {
      const { result } = renderHook(() => useKanbanStore());
      
      const columnId = result.current.state.columns[0].id;
      
      act(() => {
        result.current.createCard(columnId, {
          title: 'Card 1',
          description: '',
          tags: [],
          color: 'blue',
          dueDate: null,
        });
        result.current.createCard(columnId, {
          title: 'Card 2',
          description: '',
          tags: [],
          color: 'red',
          dueDate: null,
        });
      });

      const cards = result.current.getCardsByColumn(columnId);
      expect(cards).toHaveLength(2);
      expect(cards[0].title).toBe('Card 1');
      expect(cards[1].title).toBe('Card 2');
    });

    it('should display cards in correct columns', () => {
      const { result } = renderHook(() => useKanbanStore());
      
      const todoColumn = result.current.state.columns[0];
      const inProgressColumn = result.current.state.columns[1];
      
      act(() => {
        result.current.createCard(todoColumn.id, {
          title: 'Todo Card',
          description: '',
          tags: [],
          color: 'blue',
          dueDate: null,
        });
        result.current.createCard(inProgressColumn.id, {
          title: 'In Progress Card',
          description: '',
          tags: [],
          color: 'red',
          dueDate: null,
        });
      });

      const todoCards = result.current.getCardsByColumn(todoColumn.id);
      const inProgressCards = result.current.getCardsByColumn(inProgressColumn.id);

      expect(todoCards).toHaveLength(1);
      expect(todoCards[0].title).toBe('Todo Card');
      expect(inProgressCards).toHaveLength(1);
      expect(inProgressCards[0].title).toBe('In Progress Card');
    });
  });

  describe('Card Fields', () => {
    it('should store all card fields correctly', () => {
      const { result } = renderHook(() => useKanbanStore());
      
      const columnId = result.current.state.columns[0].id;
      const dueDate = new Date('2026-03-15').toISOString();
      
      let card: Card | undefined;
      act(() => {
        card = result.current.createCard(columnId, {
          title: 'Complete Card',
          description: 'This is a detailed description',
          tags: ['Frontend', 'Bug Fix'],
          color: 'purple',
          dueDate,
        });
      });

      const storedCard = result.current.state.cards[card!.id];
      expect(storedCard.title).toBe('Complete Card');
      expect(storedCard.description).toBe('This is a detailed description');
      expect(storedCard.tags).toEqual(['Frontend', 'Bug Fix']);
      expect(storedCard.color).toBe('purple');
      expect(storedCard.dueDate).toBe(dueDate);
      expect(storedCard.createdAt).toBeDefined();
      expect(storedCard.updatedAt).toBeDefined();
    });

    it('should update timestamps on edit', async () => {
      const { result } = renderHook(() => useKanbanStore());
      
      const columnId = result.current.state.columns[0].id;
      
      let card: Card | undefined;
      act(() => {
        card = result.current.createCard(columnId, {
          title: 'Original',
          description: '',
          tags: [],
          color: 'blue',
          dueDate: null,
        });
      });

      const originalUpdatedAt = card!.updatedAt;
      
      await new Promise(resolve => setTimeout(resolve, 10));
      
      act(() => {
        result.current.updateCard(card!.id, { title: 'Updated' });
      });

      await waitFor(() => {
        const updatedCard = result.current.state.cards[card!.id];
        expect(updatedCard.updatedAt).not.toBe(originalUpdatedAt);
      });
    });
  });
});
