/**
 * Board Component
 * 
 * Story US-005: Drag & Drop Card Movement
 * Main board component with drag-and-drop functionality using @dnd-kit
 */

import { useCallback, useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  defaultDropAnimationSideEffects,
  type DragOverlayProps,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { useBoard } from '../../context/useBoard.js';
import { SortableColumn } from './SortableColumn.js';
import type { Card, CardDragData } from '../../types/index.js';

// ============================================
// Drag Overlay Card
// ============================================

function DragOverlayCard({ card }: { card: Card }) {
  const { state } = useBoard();
  const tags = card.tagIds.map((id) => state.tags[id]).filter(Boolean);

  return (
    <div className="bg-card-dark rounded-xl p-4 border-2 border-primary shadow-2xl rotate-2 opacity-95">
      <div className="mb-2">
        {tags[0] && (
          <span className="text-xs font-medium px-2 py-1 rounded bg-primary/10 text-primary">
            {tags[0].name}
          </span>
        )}
      </div>
      <h4 className="text-white font-medium mb-1">{card.title}</h4>
      {card.description && (
        <p className="text-text-secondary text-sm line-clamp-2">{card.description}</p>
      )}
    </div>
  );
}

// ============================================
// Main Board Component
// ============================================

export function Board() {
  const { state, moveCard, createColumn } = useBoard();
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  // Get columns in order
  const columns = useMemo(() => {
    return state.board.columnIds
      .map((id) => state.columns[id])
      .filter(Boolean);
  }, [state.board.columnIds, state.columns]);

  // Get cards for a column
  const getCardsForColumn = useCallback(
    (columnId: string) => {
      const column = state.columns[columnId];
      if (!column) return [];
      return column.cardIds
        .map((id) => state.cards[id])
        .filter(Boolean);
    },
    [state.columns, state.cards]
  );

  // Sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Handle drag start
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current as CardDragData | undefined;
    
    if (data?.type === 'card') {
      setActiveCardId(data.cardId);
    }
  }, []);

  // Handle drag over
  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeData = active.data.current as CardDragData | undefined;
    const overData = over.data.current as { type: string; columnId?: string; cardId?: string } | undefined;
    
    if (!activeData || activeData.type !== 'card') return;
    
    const activeCardIdValue = activeData.cardId;
    const activeColumnId = activeData.columnId;
    
    let targetColumnId: string;
    let targetIndex: number;
    
    if (overData?.type === 'column') {
      targetColumnId = overData.columnId!;
      targetIndex = state.columns[targetColumnId].cardIds.length;
    } else if (overData?.type === 'card') {
      targetColumnId = over.id === activeCardIdValue 
        ? activeColumnId 
        : state.cards[overData.cardId!]?.columnId || activeColumnId;
      
      const overColumn = state.columns[targetColumnId];
      targetIndex = overColumn.cardIds.indexOf(over.id as string);
      if (targetIndex === -1) targetIndex = overColumn.cardIds.length;
    } else {
      return;
    }
    
    if (activeColumnId !== targetColumnId) {
      moveCard(activeCardIdValue, activeColumnId, targetColumnId, targetIndex);
    }
  }, [moveCard, state.columns, state.cards]);

  // Handle drag end
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveCardId(null);
    
    if (!over) return;
    
    const activeData = active.data.current as CardDragData | undefined;
    
    if (!activeData || activeData.type !== 'card') return;
    
    const activeCardIdValue = activeData.cardId;
    const activeColumnId = activeData.columnId;
    
    const overData = over.data.current as { type: string; columnId?: string; cardId?: string } | undefined;
    
    let targetColumnId: string;
    let targetIndex: number;
    
    if (overData?.type === 'column') {
      targetColumnId = overData.columnId!;
      targetIndex = state.columns[targetColumnId].cardIds.length;
    } else if (overData?.type === 'card') {
      targetColumnId = state.cards[overData.cardId!]?.columnId || activeColumnId;
      const overColumn = state.columns[targetColumnId];
      targetIndex = overColumn.cardIds.indexOf(over.id as string);
      if (targetIndex === -1) targetIndex = overColumn.cardIds.length;
    } else {
      return;
    }
    
    if (activeColumnId === targetColumnId) {
      const column = state.columns[activeColumnId];
      const oldIndex = column.cardIds.indexOf(activeCardIdValue);
      const newIndex = targetIndex;
      
      if (oldIndex !== newIndex) {
        const newCardIds = arrayMove(column.cardIds, oldIndex, newIndex);
        const cardAtTarget = newCardIds[newIndex];
        const actualTargetIndex = state.columns[targetColumnId].cardIds.indexOf(cardAtTarget);
        moveCard(activeCardIdValue, activeColumnId, targetColumnId, actualTargetIndex >= 0 ? actualTargetIndex : newIndex);
      }
    }
  }, [moveCard, state.columns, state.cards]);

  // Drop animation config
  const dropAnimation: DragOverlayProps['dropAnimation'] = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  // Active card for overlay
  const activeCard = activeCardId ? state.cards[activeCardId] : null;

  // Handle add column
  const handleAddColumn = useCallback(() => {
    const titles = ['To Do', 'In Progress', 'Done', 'Backlog', 'Review'];
    const existingTitles = new Set(columns.map((c) => c.title));
    const newTitle = titles.find((t) => !existingTitles.has(t)) || `Column ${columns.length + 1}`;
    createColumn({ title: newTitle });
  }, [columns, createColumn]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="h-full flex px-6 py-6 gap-6 min-w-max">
          {columns.map((column) => (
            <SortableColumn
              key={column.id}
              column={column}
              cards={getCardsForColumn(column.id)}
              tags={state.tags}
            />
          ))}
          
          {/* Add Column Button */}
          <div className="w-80 flex flex-col h-full pt-[52px]">
            <button
              onClick={handleAddColumn}
              className="w-full py-3 border-2 border-dashed border-border-dark rounded-xl text-text-secondary hover:text-white hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Add New Column</span>
            </button>
          </div>
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay dropAnimation={dropAnimation}>
        {activeCard ? <DragOverlayCard card={activeCard} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
