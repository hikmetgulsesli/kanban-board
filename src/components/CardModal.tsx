import { X, Calendar, Tag, Trash2, Edit2 } from 'lucide-react';
import type { Card as CardType } from '../types/index.js';
import { CARD_COLORS } from '../types/index.js';

interface CardModalProps {
  card: CardType;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function CardModal({ card, isOpen, onClose, onEdit, onDelete }: CardModalProps) {
  if (!isOpen) return null;

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const colorStyle = CARD_COLORS[card.color as keyof typeof CARD_COLORS] || CARD_COLORS.blue;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-card-dark border border-border-dark rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div className={`h-2 ${colorStyle.bg} rounded-t-xl`} ></div>
          
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-white font-heading pr-4">{card.title}</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={onEdit}
                  className="p-2 text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={onDelete}
                  className="p-2 text-text-secondary hover:text-error hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {card.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded bg-primary/10 text-primary"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {card.description ? (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-text-secondary mb-2">Description</h3>
                <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                  {card.description}
                </p>
              </div>
            ) : (
              <div className="mb-6">
                <p className="text-text-muted text-sm italic">No description</p>
              </div>
            )}

            <div className="flex flex-wrap gap-4 text-sm">
              {card.dueDate && (
                <div className="flex items-center gap-2 text-text-secondary">
                  <Calendar className="w-4 h-4" />
                  <span>Due: {formatDate(card.dueDate)}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-text-muted">
                <span>Created: {formatDate(card.createdAt)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-text-muted">
                <span>Updated: {formatDate(card.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
