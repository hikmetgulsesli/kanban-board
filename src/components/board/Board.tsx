import { useState, useMemo, useCallback } from 'react';
import type { Card, Column, FilterState } from '../../types';
import { useBoard } from '../../hooks/useBoard';
import { useDragAndDrop } from '../../hooks/useDragAndDrop';
import { filterCards } from '../../utils/filters';
import { Column as ColumnComponent } from './Column';
import { CardModal } from './CardModal';
import { ColumnModal } from './ColumnModal';
import { FilterBar } from './FilterBar';

export function Board() {
  const {
    state,
    addColumn,
    updateColumn,
    deleteColumn,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    toggleCardComplete,
  } = useBoard();

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedTags: [],
    priorityFilter: [],
    dueDateFilter: 'all',
  });

  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [newCardColumnId, setNewCardColumnId] = useState<string | undefined>();

  const [columnModalOpen, setColumnModalOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<Column | null>(null);

  // Filter cards
  const filteredCards = useMemo(() => {
    return filterCards(state.cards, filters);
  }, [state.cards, filters]);

  // Group cards by column
  const cardsByColumn = useMemo(() => {
    const grouped: Record<string, Card[]> = {};
    state.columns.forEach((col) => {
      grouped[col.id] = filteredCards
        .filter((card) => card.columnId === col.id)
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    });
    return grouped;
  }, [filteredCards, state.columns]);

  // Drag and drop
  const handleCardMove = useCallback((cardId: string, targetColumnId: string) => {
    moveCard(cardId, targetColumnId);
  }, [moveCard]);

  const {
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    isDraggingOver,
  } = useDragAndDrop(handleCardMove);

  // Card modal handlers
  const handleAddCard = (columnId: string) => {
    setEditingCard(null);
    setNewCardColumnId(columnId);
    setCardModalOpen(true);
  };

  const handleEditCard = (card: Card) => {
    setEditingCard(card);
    setNewCardColumnId(undefined);
    setCardModalOpen(true);
  };

  const handleSaveCard = (cardData: Partial<Card>) => {
    if (cardData.id) {
      updateCard(cardData.id, cardData);
    } else if (newCardColumnId) {
      addCard(newCardColumnId, cardData);
    }
  };

  // Column modal handlers
  const handleAddColumn = () => {
    setEditingColumn(null);
    setColumnModalOpen(true);
  };

  const handleEditColumn = (column: Column) => {
    setEditingColumn(column);
    setColumnModalOpen(true);
  };

  const handleSaveColumn = (columnData: Partial<Column>) => {
    if (columnData.id) {
      updateColumn(columnData.id, columnData.title || '');
    } else {
      addColumn(columnData.title || 'New Column');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        availableTags={state.tags}
      />

      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="h-full flex px-6 py-6 gap-6 min-w-max">
          {state.columns.map((column, index) => (
            <ColumnComponent
              key={column.id}
              column={column}
              cards={cardsByColumn[column.id] || []}
              onAddCard={handleAddCard}
              onEditCard={handleEditCard}
              onDeleteCard={deleteCard}
              onToggleCardComplete={toggleCardComplete}
              onEditColumn={handleEditColumn}
              onDeleteColumn={deleteColumn}
              onDragStart={(e, cardId) => handleDragStart(e, cardId, 'card', column.id)}
              onCardDragEnd={handleDragEnd}
              onColumnDragStart={(e, columnId) => handleDragStart(e, columnId, 'column')}
              onColumnDragEnd={handleDragEnd}
              onDragOver={(e, colId) => handleDragOver(e, colId, 'column')}
              onDrop={(e, colId) => handleDrop(e, colId, 'column')}
              isDropTarget={isDraggingOver(column.id)}
              isDoneColumn={index === state.columns.length - 1}
            />
          ))}

          {/* Add Column Button */}
          <div className="w-80 flex-shrink-0 pt-[52px]">
            <button
              onClick={handleAddColumn}
              className="w-full py-3 border-2 border-dashed border-border-dark rounded-xl text-text-secondary hover:text-white hover:border-primary hover:bg-primary/5 transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform duration-200"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>
              <span className="font-medium">Add New Column</span>
            </button>
          </div>
        </div>
      </div>

      <CardModal
        isOpen={cardModalOpen}
        onClose={() => setCardModalOpen(false)}
        card={editingCard}
        columnId={newCardColumnId}
        availableTags={state.tags}
        onSave={handleSaveCard}
        onDelete={editingCard ? deleteCard : undefined}
      />

      <ColumnModal
        isOpen={columnModalOpen}
        onClose={() => setColumnModalOpen(false)}
        column={editingColumn}
        onSave={handleSaveColumn}
        onDelete={editingColumn ? deleteColumn : undefined}
      />
    </div>
  );
}
