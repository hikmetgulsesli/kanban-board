import { MoreHorizontal, Calendar, Flag } from 'lucide-react';
import type { Card as CardType } from '../../types';
import { TAG_COLORS } from '../../types';
import { formatDate, isOverdue, isDueSoon } from '../../utils/date';

interface CardProps {
  card: CardType;
  onEdit: (card: CardType) => void;
  onDelete: (cardId: string) => void;
}

export function CardComponent({ card, onEdit, onDelete }: CardProps) {
  const tagStyle = TAG_COLORS[card.tags[0]] || { bg: 'bg-blue-500/10', text: 'text-blue-400' };
  const overdue = isOverdue(card.dueDate);
  const dueSoon = isDueSoon(card.dueDate);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this card?')) {
      onDelete(card.id);
    }
  };

  return (
    <div
      className="bg-card-dark rounded-xl p-4 border border-border-dark hover:border-primary/50 transition-colors group cursor-pointer relative overflow-hidden shadow-sm"
      onClick={() => onEdit(card)}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: card.color }}
      />
      
      <div className="mb-2 flex justify-between items-start">
        {card.tags.length > 0 && (
          <span className={`text-xs font-medium px-2 py-1 rounded ${tagStyle.bg} ${tagStyle.text}`}>
            {card.tags[0]}
          </span>
        )}
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(card);
            }}
            className="text-text-secondary hover:text-white p-1 rounded hover:bg-white/5 transition-colors"
            aria-label="Edit card"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="text-text-secondary hover:text-red-400 p-1 rounded hover:bg-white/5 transition-colors"
            aria-label="Delete card"
          >
            <span className="text-xs">×</span>
          </button>
        </div>
      </div>
      
      <h4 className="text-white font-medium mb-1 leading-snug font-heading">{card.title}</h4>
      
      {card.description && (
        <p className="text-text-secondary text-sm font-body mb-3 line-clamp-2">{card.description}</p>
      )}
      
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div className="flex items-center gap-3">
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
              <span>High</span>
            </div>
          )}
        </div>
        
        {card.assignee && (
          <div
            className="h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white"
            title={`Assignee: ${card.assignee}`}
          >
            {card.assignee}
          </div>
        )}
      </div>
    </div>
  );
}
