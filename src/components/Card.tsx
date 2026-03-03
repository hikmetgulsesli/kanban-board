import { MoreHorizontal, Calendar, Check } from 'lucide-react';
import type { Card as CardType } from '../types/index.js';
import { TAG_COLORS, CARD_COLORS } from '../types/index.js';

interface CardProps {
  card: CardType;
  onClick?: () => void;
  onEdit?: () => void;
  isDone?: boolean;
}

export function CardComponent({ card, onClick, onEdit, isDone }: CardProps) {
  const colorStyle = CARD_COLORS[card.color as keyof typeof CARD_COLORS] || CARD_COLORS.blue;
  
  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date() && !isDone;

  return (
    <div
      onClick={onClick}
      className={`
        bg-card-dark rounded-xl p-4 border border-border-dark 
        hover:border-primary/50 transition-colors group cursor-pointer 
        relative overflow-hidden shadow-sm
        ${isDone ? 'opacity-70' : ''}
      `}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${colorStyle.bg}`} ></div>
      
      <div className="pl-2">
        <div className="mb-2 flex justify-between items-start">
          {card.tags.length > 0 && (
            <span className={`
              text-xs font-medium px-2 py-1 rounded 
              ${TAG_COLORS[card.tags[0]]?.bg || 'bg-blue-500/10'} 
              ${TAG_COLORS[card.tags[0]]?.text || 'text-blue-400'}
            `}>
              {card.tags[0]}
            </span>
          )}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="text-text-secondary hover:text-white p-1 rounded hover:bg-white/5 transition-colors"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <h4 className={`
          text-white font-medium mb-1 leading-snug font-heading
          ${isDone ? 'line-through text-white/60' : ''}
        `}>
          {card.title}
        </h4>

        {card.description && (
          <p className="text-text-secondary text-sm font-body mb-3 line-clamp-2">
            {card.description}
          </p>
        )}

        {card.tags.length > 1 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {card.tags.slice(1).map((tag) => (
              <span
                key={tag}
                className={`
                  text-xs font-medium px-2 py-0.5 rounded
                  ${TAG_COLORS[tag]?.bg || 'bg-blue-500/10'}
                  ${TAG_COLORS[tag]?.text || 'text-blue-400'}
                `}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-3">
            {card.dueDate && (
              <div className={`
                flex items-center gap-1 text-xs
                ${isOverdue ? 'text-error' : 'text-text-secondary'}
              `}>
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(card.dueDate)}</span>
              </div>
            )}
          </div>
          
          {isDone && (
            <div className="h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Check className="w-3 h-3" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
