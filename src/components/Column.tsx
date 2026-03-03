import { useState } from 'react';
import { Plus, MoreHorizontal, Trash2, Edit2, X, Check } from 'lucide-react';
import { CardComponent } from './Card.js';
import { CardModal } from './CardModal.js';
import type { Column as ColumnType, Card as CardType } from '../types/index.js';

interface ColumnProps {
  column: ColumnType;
  cards: CardType[];
  onAddCard: (columnId: string) => void;
  onEditCard: (card: CardType) => void;
  onDeleteCard: (cardId: string) => void;
  onUpdateColumn: (columnId: string, title: string) => void;
  onDeleteColumn: (columnId: string) => void;
  isDoneColumn?: boolean;
}

export function ColumnComponent({
  column,
  cards,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onUpdateColumn,
  onDeleteColumn,
  isDoneColumn,
}: ColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);

  const handleSaveTitle = () => {
    if (editTitle.trim()) {
      onUpdateColumn(column.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditTitle(column.title);
    setIsEditing(false);
  };

  const handleCardClick = (card: CardType) => {
    setSelectedCard(card);
  };

  const handleCardEdit = (card: CardType) => {
    onEditCard(card);
    setSelectedCard(null);
  };

  const handleCardDelete = (cardId: string) => {
    onDeleteCard(cardId);
    setSelectedCard(null);
  };

  return (
    <div className={`w-80 flex flex-col h-full ${isDoneColumn ? 'opacity-70 hover:opacity-100 transition-opacity' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveTitle();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                className="bg-card-dark border border-border-dark rounded px-2 py-1 text-sm text-white w-40 focus:border-primary focus:outline-none"
                autoFocus
              />
              <button
                onClick={handleSaveTitle}
                className="text-emerald-400 hover:text-emerald-300 p-1"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancelEdit}
                className="text-text-secondary hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <h3 className="font-bold text-white text-lg font-heading">{column.title}</h3>
              <span className="bg-card-dark text-text-secondary text-xs font-bold px-2 py-0.5 rounded-full border border-white/5">
                {cards.length}
              </span>
            </>
          )}
        </div>
        
        {!isEditing && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onAddCard(column.id)}
              className="text-text-secondary hover:text-white p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
            >
              <Plus className="w-5 h-5" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-text-secondary hover:text-white p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 w-40 bg-card-dark border border-border-dark rounded-lg shadow-lg z-20 py-1">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Rename
                    </button>
                    <button
                      onClick={() => {
                        onDeleteColumn(column.id);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error hover:text-red-400 hover:bg-white/5 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {cards.map((card) => (
          <CardComponent
            key={card.id}
            card={card}
            isDone={isDoneColumn}
            onClick={() => handleCardClick(card)}
            onEdit={() => handleCardEdit(card)}
          />
        ))}
      </div>

      {selectedCard && (
        <CardModal
          card={selectedCard}
          isOpen={true}
          onClose={() => setSelectedCard(null)}
          onEdit={() => handleCardEdit(selectedCard)}
          onDelete={() => handleCardDelete(selectedCard.id)}
        />
      )}
    </div>
  );
}
