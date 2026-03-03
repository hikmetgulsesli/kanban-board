import { useState } from 'react';
import type { Column as ColumnType, Card as CardType } from '../../types';
import { Card } from './Card';
import { MoreHorizontal, Plus, Trash2, GripVertical } from 'lucide-react';

interface ColumnProps {
  column: ColumnType;
  cards: CardType[];
  onAddCard: (columnId: string) => void;
  onEditCard: (card: CardType) => void;
  onDeleteCard: (id: string) => void;
  onToggleCardComplete: (id: string) => void;
  onEditColumn: (column: ColumnType) => void;
  onDeleteColumn: (id: string) => void;
  onDragStart: (e: React.DragEvent, cardId: string, columnId: string) => void;
  onCardDragEnd: (e: React.DragEvent) => void;
  onColumnDragStart: (e: React.DragEvent, columnId: string) => void;
  onColumnDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent, columnId: string) => void;
  onDrop: (e: React.DragEvent, columnId: string) => void;
  isDropTarget?: boolean;
  isDoneColumn?: boolean;
}

export function Column({
  column,
  cards,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onToggleCardComplete,
  onEditColumn,
  onDeleteColumn,
  onDragStart,
  onCardDragEnd,
  onColumnDragStart,
  onColumnDragEnd,
  onDragOver,
  onDrop,
  isDropTarget,
  isDoneColumn,
}: ColumnProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver(e, column.id);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(e, column.id);
  };

  return (
    <div
      draggable
      onDragStart={(e) => onColumnDragStart(e, column.id)}
      onDragEnd={onColumnDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`
        w-80 flex-shrink-0 flex flex-col h-full max-h-full
        ${isDoneColumn ? 'opacity-70 hover:opacity-100 transition-opacity duration-200' : ''}
        ${isDropTarget ? 'ring-2 ring-primary/50 ring-inset rounded-xl' : ''}
        transition-all duration-200
      `}
      data-column-id={column.id}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onColumnDragStart(e as unknown as React.DragEvent, column.id);
            }}
            className="text-text-secondary hover:text-white cursor-grab active:cursor-grabbing p-1 rounded hover:bg-white/5 transition-colors"
            aria-label="Drag column"
          >
            <GripVertical className="w-4 h-4" />
          </button>
          
          <h3 className="font-bold text-white text-lg font-heading">
            {column.title}
          </h3>
          <span className="bg-card-dark text-text-secondary text-xs font-bold px-2 py-0.5 rounded-full border border-white/5">
            {cards.length}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => onAddCard(column.id)}
            className="text-text-secondary hover:text-white p-1.5 rounded hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Add card"
          >
            <Plus className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-text-secondary hover:text-white p-1.5 rounded hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Column options"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-card-dark border border-border-dark rounded-lg shadow-xl z-20 py-1 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => {
                    onEditColumn(column);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/5 transition-colors"
                >
                  Rename
                </button>
                <button
                  onClick={() => {
                    onDeleteColumn(column.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-error hover:bg-white/5 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cards Container */}
      <div 
        className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar min-h-[100px]"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onEdit={onEditCard}
            onDelete={onDeleteCard}
            onToggleComplete={onToggleCardComplete}
            onDragStart={(e, cardId) => onDragStart(e, cardId, column.id)}
            onDragEnd={onCardDragEnd}
          />
        ))}
        
        {cards.length === 0 && (
          <div 
            className="border-2 border-dashed border-border-dark rounded-xl p-8 text-center text-text-secondary hover:border-primary/50 hover:text-text-secondary/70 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <p className="text-sm">Drop cards here</p>
          </div>
        )}
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
