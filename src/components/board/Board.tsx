import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Card, Column } from '../../types';
import { useBoard } from '../../hooks/useBoard';
import { ColumnComponent } from './Column';
import { CardModal } from './CardModal';

export function Board() {
  const {
    board,
    isLoaded,
    createCard,
    updateCard,
    deleteCard,
    createColumn,
  } = useBoard();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string>('');

  if (!isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  const handleAddCard = (columnId: string) => {
    setEditingCard(null);
    setActiveColumnId(columnId);
    setIsModalOpen(true);
  };

  const handleEditCard = (card: Card) => {
    setEditingCard(card);
    setActiveColumnId(card.columnId);
    setIsModalOpen(true);
  };

  const handleSaveCard = (cardData: Partial<Card>) => {
    if (editingCard) {
      updateCard(editingCard.id, cardData);
    } else {
      createCard(activeColumnId, cardData);
    }
  };

  const handleDeleteCard = (cardId: string) => {
    deleteCard(cardId);
  };

  const handleAddColumn = () => {
    const title = prompt('Enter column name:');
    if (title?.trim()) {
      createColumn(title.trim());
    }
  };

  const getColumnCards = (column: Column): Card[] => {
    return column.cardIds
      .map((id) => board.cards[id])
      .filter((card): card is Card => card !== undefined);
  };

  return (
    <>
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="h-full flex px-6 py-6 gap-6 min-w-max">
          {board.columnOrder.map((columnId) => {
            const column = board.columns[columnId];
            if (!column) return null;

            return (
              <ColumnComponent
                key={column.id}
                column={column}
                cards={getColumnCards(column)}
                onAddCard={handleAddCard}
                onEditCard={handleEditCard}
                onDeleteCard={handleDeleteCard}
              />
            );
          })}

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

      <CardModal
        card={editingCard}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCard}
        onDelete={editingCard ? handleDeleteCard : undefined}
      />
    </>
  );
}
