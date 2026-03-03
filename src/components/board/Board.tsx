import { useState, useRef, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Card, Column as ColumnType } from '../../types';
import { ColumnComponent } from './Column';
import { CardModal } from './CardModal';
import { PromptDialog } from './PromptDialog';

interface BoardProps {
  board: {
    cards: Record<string, Card>;
    columns: Record<string, ColumnType>;
    columnOrder: string[];
  };
  filteredCardIds: Set<string>;
  onCreateCard: (columnId: string, cardData: Partial<Card>) => Card;
  onUpdateCard: (cardId: string, updates: Partial<Card>) => Card | null;
  onDeleteCard: (cardId: string) => boolean;
  onMoveCard: (cardId: string, targetColumnId: string, targetIndex?: number) => void;
  onCreateColumn: (title: string) => ColumnType;
}

export function Board({
  board,
  filteredCardIds,
  onCreateCard,
  onUpdateCard,
  onDeleteCard,
  onMoveCard: _onMoveCard,
  onCreateColumn,
}: BoardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string>('');
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

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
      onUpdateCard(editingCard.id, cardData);
    } else {
      onCreateCard(activeColumnId, cardData);
    }
  };

  const handleDeleteCard = (cardId: string) => {
    onDeleteCard(cardId);
  };

  const handleAddColumn = () => {
    setIsPromptOpen(true);
  };

  const handlePromptConfirm = (title: string) => {
    onCreateColumn(title);
    setIsPromptOpen(false);
  };

  const getColumnCards = (column: ColumnType): Card[] => {
    return column.cardIds
      .map((id) => board.cards[id])
      .filter((card): card is Card => card !== undefined && filteredCardIds.has(card.id));
  };

  return (
    <>
      <div className="relative flex-1">
        {/* Mobile Scroll Buttons */}
        <button
          onClick={() => scroll('left')}
          className={`md:hidden absolute left-2 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-card-dark/90 backdrop-blur border border-border-dark flex items-center justify-center text-white shadow-lg transition-opacity ${
            canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => scroll('right')}
          className={`md:hidden absolute right-2 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-card-dark/90 backdrop-blur border border-border-dark flex items-center justify-center text-white shadow-lg transition-opacity ${
            canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-x-auto overflow-y-hidden h-full snap-x-mandatory md:snap-none"
        >
          <div className="h-full flex px-4 md:px-6 py-4 md:py-6 gap-4 md:gap-6 min-w-max">
            {board.columnOrder.map((columnId) => {
              const column = board.columns[columnId];
              if (!column) return null;

              return (
                <div key={column.id} className="snap-center">
                  <ColumnComponent
                    column={column}
                    cards={getColumnCards(column)}
                    onAddCard={handleAddCard}
                    onEditCard={handleEditCard}
                    onDeleteCard={handleDeleteCard}
                  />
                </div>
              );
            })}

            <div className="w-72 md:w-80 flex flex-col h-full pt-[52px] snap-center">
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
      </div>

      <CardModal
        card={editingCard}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCard}
        onDelete={editingCard ? handleDeleteCard : undefined}
      />

      <PromptDialog
        isOpen={isPromptOpen}
        title="Add New Column"
        placeholder="Enter column name"
        onConfirm={handlePromptConfirm}
        onCancel={() => setIsPromptOpen(false)}
      />
    </>
  );
}
