/**
 * Sortable Column Component
 * 
 * Story US-005: Drag & Drop Card Movement
 * Implements a droppable column with sortable cards using @dnd-kit
 */

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, MoreHorizontal } from 'lucide-react';
import type { Column, Card, Tag } from '../../types/index.js';
import { SortableCard } from './SortableCard.js';

interface SortableColumnProps {
  column: Column;
  cards: Card[];
  tags: Record<string, Tag>;
  onAddCard?: (columnId: string) => void;
}

export function SortableColumn({ column, cards, tags, onAddCard }: SortableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'column',
      columnId: column.id,
    },
  });

  const cardIds = cards.map((card) => card.id);

  return (
    <div className="w-80 flex flex-col h-full">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-white text-lg font-heading">{column.title}</h3>
          <span className="bg-card-dark text-text-secondary text-xs font-bold px-2 py-0.5 rounded-full border border-white/5">
            {cards.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onAddCard?.(column.id)}
            className="text-text-secondary hover:text-white p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Add card"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button className="text-text-secondary hover:text-white p-1 rounded hover:bg-white/5 transition-colors cursor-pointer">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Cards Container */}
      <div
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar min-h-[100px] ${
          isOver ? 'bg-primary/5 rounded-lg' : ''
        }`}
      >
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {cards.map((card, index) => (
            <SortableCard
              key={card.id}
              card={card}
              tags={card.tagIds.map((id) => tags[id]).filter(Boolean)}
              index={index}
            />
          ))}
        </SortableContext>
        
        {cards.length === 0 && (
          <div className="h-24 border-2 border-dashed border-border-dark rounded-xl flex items-center justify-center text-text-secondary text-sm">
            Drop cards here
          </div>
        )}
      </div>
    </div>
  );
}
