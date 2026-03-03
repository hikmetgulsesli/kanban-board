import { useState } from 'react';
import type { Card as CardType, TagColor } from '../../types';
import { TagBadge, PriorityBadge, AssigneeGroup } from '../ui';
import { Calendar, MoreHorizontal, Check } from 'lucide-react';

interface CardProps {
  card: CardType;
  onEdit: (card: CardType) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onDragStart: (e: React.DragEvent, cardId: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  isDragging?: boolean;
  isDropTarget?: boolean;
}

const tagColorMap: Record<string, TagColor> = {
  'Design System': 'blue',
  'Bug Fix': 'orange',
  'Research': 'purple',
  'Frontend': 'emerald',
  'Backend': 'red',
  'Content': 'yellow',
  'Design': 'blue',
};

export function Card({
  card,
  onEdit,
  onDelete,
  onToggleComplete,
  onDragStart,
  onDragEnd,
  isDragging,
  isDropTarget,
}: CardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(e, card.id);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const isOverdue = date < today && !card.completed;
    
    const formatted = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
    
    return { formatted, isOverdue };
  };

  const dateInfo = formatDate(card.dueDate);
  const firstTag = card.tags[0];
  const tagColor: TagColor = firstTag ? (tagColorMap[firstTag.name] || firstTag.color) : 'blue';

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onClick={() => onEdit(card)}
      className={`
        bg-card-dark rounded-xl p-4 border relative overflow-hidden shadow-sm
        cursor-pointer select-none
        transition-all duration-200 ease-out
        ${isDragging ? 'opacity-50 scale-95 rotate-2' : 'opacity-100'}
        ${isDropTarget ? 'border-primary ring-1 ring-primary/30' : 'border-border-dark hover:border-primary/50'}
        ${card.completed ? 'opacity-70' : ''}
        group
      `}
      data-card-id={card.id}
    >
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${tagColor}-500`} />

      <div className="mb-2 flex justify-between items-start">
        {firstTag && (
          <TagBadge 
            name={firstTag.name} 
            color={tagColor} 
          />
        )}
        
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="
              opacity-0 group-hover:opacity-100 
              transition-opacity duration-200
              text-text-secondary hover:text-white p-1 rounded hover:bg-white/5
              focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary
            "
            aria-label="Card options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-card-dark border border-border-dark rounded-lg shadow-xl z-20 py-1 animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleComplete(card.id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/5 transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                {card.completed ? 'Mark incomplete' : 'Mark complete'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(card.id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-error hover:bg-white/5 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <h4 className={`
        text-white font-medium mb-1 leading-snug font-heading
        ${card.completed ? 'line-through text-white/60' : ''}
      `}>
        {card.title}
      </h4>
      
      <p className="text-text-secondary text-sm font-body mb-3 line-clamp-2">
        {card.description}
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div className="flex items-center gap-3">
          {dateInfo && (
            <div className={`flex items-center gap-1 text-xs ${dateInfo.isOverdue ? 'text-error' : 'text-text-secondary'}`}>
              <Calendar className="w-3.5 h-3.5" />
              <span>{dateInfo.formatted}</span>
            </div>
          )}
          
          {card.priority === 'high' && !card.completed && (
            <PriorityBadge priority={card.priority} showLabel={false} />
          )}
        </div>

        <AssigneeGroup assignees={card.assignees} />
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}
