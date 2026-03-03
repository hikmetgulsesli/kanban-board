import { Plus, MoreHorizontal } from 'lucide-react';
import type { Column as ColumnType, Card as CardType } from '../../types';
import { CardComponent } from './Card';

interface ColumnProps {
  column: ColumnType;
  cards: CardType[];
  onAddCard: (columnId: string) => void;
  onEditCard: (card: CardType) => void;
  onDeleteCard: (cardId: string) => void;
}

export function ColumnComponent({ column, cards, onAddCard, onEditCard, onDeleteCard }: ColumnProps) {
  return (
    <div className="w-80 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-white text-lg font-heading">{column.title}</h3>
          <span className="bg-card-dark text-text-secondary text-xs font-bold px-2 py-0.5 rounded-full border border-white/5">
            {cards.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onAddCard(column.id)}
            className="text-text-secondary hover:text-white p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Add card"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            className="text-text-secondary hover:text-white p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Column options"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {cards.map((card) => (
          <CardComponent
            key={card.id}
            card={card}
            onEdit={onEditCard}
            onDelete={onDeleteCard}
          />
        ))}
        
        {cards.length === 0 && (
          <div className="text-center py-8 text-text-secondary text-sm">
            No cards yet
          </div>
        )}
      </div>
    </div>
  );
}
