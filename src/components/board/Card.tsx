import { useState } from 'react';
import { MoreHorizontal, Calendar, Flag } from 'lucide-react';
import type { Card as CardType } from '../../types';
import { TAG_COLORS } from '../../types';
import { formatDate, isOverdue, isDueSoon } from '../../utils/date';
import { ConfirmDialog } from './ConfirmDialog';

interface CardProps {
  card: CardType;
  onEdit: (card: CardType) => void;
  onDelete: (cardId: string) => void;
}

export function CardComponent({ card, onEdit, onDelete }: CardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const tagStyle = TAG_COLORS[card.tags[0]] || { bg: 'bg-blue-500/10', text: 'text-blue-400' };
  const overdue = isOverdue(card.dueDate);
  const dueSoon = isDueSoon(card.dueDate);

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(card.id);
    setShowDeleteConfirm(false);
  };

  const handleTouchStart = () => {
    setIsPressed(true);
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
  };

  return (
    <>
      <div
        className={`
          bg-card-dark rounded-xl p-3 md:p-4 border border-border-dark 
          hover:border-primary/50 transition-all duration-200
          group cursor-pointer relative overflow-hidden shadow-sm
          card-hover
          ${isPressed ? 'scale-[0.98] border-primary/50' : ''}
        `}
        onClick={() => onEdit(card)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onEdit(card);
          }
        }}
        aria-label={`Edit card: ${card.title}`}
      >
        <div
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{ backgroundColor: card.color }}
          aria-hidden="true"
        />
        
        <div className="mb-2 flex justify-between items-start">
          {card.tags.length > 0 && (
            <span className={`text-xs font-medium px-2 py-1 rounded ${tagStyle.bg} ${tagStyle.text}`}>
              {card.tags[0]}
            </span>
          )}
          
          <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(card);
              }}
              className="text-text-secondary hover:text-white p-1 rounded hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Edit card"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="text-text-secondary hover:text-red-400 p-1 rounded hover:bg-white/5 transition-colors focus-visible:ring-2 focus-visible:ring-red-400"
              aria-label="Delete card"
            >
              <span className="text-xs">×</span>
            </button>
          </div>
        </div>
        
        <h4 className="text-white font-medium mb-1 leading-snug font-heading text-sm md:text-base">{card.title}</h4>
        
        {card.description && (
          <p className="text-text-secondary text-xs md:text-sm font-body mb-2 md:mb-3 line-clamp-2">{card.description}</p>
        )}
        
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-2 md:gap-3">
            {card.dueDate && (
              <div
                className={`flex items-center gap-1 text-xs ${
                  overdue
                    ? 'text-red-400'
                    : dueSoon
                    ? 'text-amber-400'
                    : 'text-text-secondary'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(card.dueDate)}</span>
              </div>
            )}
            
            {card.priority === 'high' && (
              <div className="flex items-center gap-1 text-red-400 text-xs font-medium">
                <Flag className="w-3.5 h-3.5" />
                <span className="hidden md:inline">High</span>
              </div>
            )}
          </div>
          
          {card.assignee && (
            <div
              className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-indigo-500 flex items-center justify-center text-[9px] md:text-[10px] font-bold text-white"
              title={`Assignee: ${card.assignee}`}
            >
              {card.assignee}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Card"
        message="Are you sure you want to delete this card? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
