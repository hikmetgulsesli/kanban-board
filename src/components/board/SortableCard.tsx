/**
 * Sortable Card Component
 * 
 * Story US-005: Drag & Drop Card Movement
 * Implements a draggable card using @dnd-kit
 */

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreHorizontal, Calendar, Flag } from 'lucide-react';
import type { Card, Tag, Priority } from '../../types/index.js';

interface SortableCardProps {
  card: Card;
  tags: Tag[];
  index: number;
}

const priorityColors: Record<Priority, string> = {
  low: 'text-emerald-400',
  medium: 'text-amber-400',
  high: 'text-red-400',
};

const tagColorClasses: Record<Tag['color'], { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  orange: { bg: 'bg-orange-500/10', text: 'text-orange-400' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  red: { bg: 'bg-red-500/10', text: 'text-red-400' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
};

function formatDate(dateString: string | null): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays > 0) return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function SortableCard({ card, tags, index }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: 'card',
      cardId: card.id,
      columnId: card.columnId,
      index,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const primaryTag = tags[0];
  const hasMoreTags = tags.length > 1;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-card-dark rounded-xl p-4 border border-border-dark hover:border-primary/50 transition-colors group cursor-grab active:cursor-grabbing relative overflow-hidden shadow-sm"
    >
      {/* Left border accent based on priority */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${
          card.priority === 'high'
            ? 'bg-red-500'
            : card.priority === 'medium'
            ? 'bg-primary'
            : 'bg-emerald-500'
        }`}
      />

      <div className="mb-2 flex justify-between items-start">
        {primaryTag && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded ${tagColorClasses[primaryTag.color].bg} ${tagColorClasses[primaryTag.color].text}`}
          >
            {primaryTag.name}
            {hasMoreTags && ` +${tags.length - 1}`}
          </span>
        )}
        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-text-secondary hover:text-white">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <h4 className="text-white font-medium mb-1 leading-snug">{card.title}</h4>
      
      {card.description && (
        <p className="text-text-secondary text-sm font-body mb-3 line-clamp-2">
          {card.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div className="flex items-center gap-3">
          {card.dueDate && (
            <div className="flex items-center gap-1 text-text-secondary text-xs">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(card.dueDate)}</span>
            </div>
          )}
          
          {card.priority !== 'low' && (
            <div className={`flex items-center gap-1 text-xs font-medium ${priorityColors[card.priority]}`}>
              <Flag className="w-3.5 h-3.5" />
              <span className="capitalize">{card.priority}</span>
            </div>
          )}
        </div>

        {card.assignee && (
          <div
            className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-[10px] font-bold text-white"
            title={`Assignee: ${card.assignee}`}
          >
            {card.assignee.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}
