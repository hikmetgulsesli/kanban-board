import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBoard } from './useBoard';

describe('useBoard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('creates a new card', () => {
    const { result } = renderHook(() => useBoard());
    
    act(() => {
      result.current.createCard('col-1', {
        title: 'New Test Card',
        description: 'Test Description',
      });
    });

    const cards = Object.values(result.current.board.cards);
    expect(cards.some((card) => (card as { title: string }).title === 'New Test Card')).toBe(true);
  });

  it('updates an existing card', () => {
    const { result } = renderHook(() => useBoard());
    
    let createdCardId = '';
    act(() => {
      const card = result.current.createCard('col-1', {
        title: 'Original Title',
      });
      createdCardId = card.id;
    });

    act(() => {
      result.current.updateCard(createdCardId, { title: 'Updated Title' });
    });

    expect(result.current.board.cards[createdCardId].title).toBe('Updated Title');
  });

  it('deletes a card', () => {
    const { result } = renderHook(() => useBoard());
    
    let createdCardId = '';
    act(() => {
      const card = result.current.createCard('col-1', {
        title: 'Card to Delete',
      });
      createdCardId = card.id;
    });

    expect(result.current.board.cards[createdCardId]).toBeDefined();

    act(() => {
      result.current.deleteCard(createdCardId);
    });

    expect(result.current.board.cards[createdCardId]).toBeUndefined();
  });

  it('moves card between columns', () => {
    const { result } = renderHook(() => useBoard());
    
    let createdCardId = '';
    act(() => {
      const card = result.current.createCard('col-1', {
        title: 'Moveable Card',
      });
      createdCardId = card.id;
    });

    act(() => {
      result.current.moveCard(createdCardId, 'col-2');
    });

    expect(result.current.board.cards[createdCardId].columnId).toBe('col-2');
    expect(result.current.board.columns['col-1'].cardIds).not.toContain(createdCardId);
    expect(result.current.board.columns['col-2'].cardIds).toContain(createdCardId);
  });

  it('creates a new column', () => {
    const { result } = renderHook(() => useBoard());
    
    act(() => {
      result.current.createColumn('New Column');
    });

    const columns = Object.values(result.current.board.columns);
    expect(columns.some((col) => (col as { title: string }).title === 'New Column')).toBe(true);
  });

  it('persists data to localStorage', () => {
    const { result } = renderHook(() => useBoard());
    
    act(() => {
      result.current.createCard('col-1', {
        title: 'Persisted Card',
      });
    });

    const stored = localStorage.getItem('kanban-board-data');
    expect(stored).toBeTruthy();
    
    const parsed = JSON.parse(stored!);
    expect(Object.values(parsed.cards as { title: string }[]).some((card) => 
      card.title === 'Persisted Card'
    )).toBe(true);
  });
});
