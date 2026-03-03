import { useState } from 'react';
import { Header, Sidebar, BoardContainer } from './components/layout/index.js';
import { ColumnComponent, CardEditModal } from './components/index.js';
import { useKanbanStore } from './store/kanbanStore.js';
import type { Card, CardColor } from './types/index.js';

function App() {
  const {
    state,
    isLoaded,
    createCard,
    updateCard,
    deleteCard,
    getCardsByColumn,
    createColumn,
    updateColumn,
    deleteColumn,
  } = useKanbanStore();

  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);

  const handleAddCard = (columnId: string) => {
    setActiveColumnId(columnId);
    setEditingCard(null);
    setIsEditModalOpen(true);
  };

  const handleEditCard = (card: Card) => {
    setEditingCard(card);
    setActiveColumnId(card.columnId);
    setIsEditModalOpen(true);
  };

  const handleSaveCard = (cardData: {
    title: string;
    description: string;
    tags: string[];
    color: CardColor;
    dueDate: string | null;
  }) => {
    if (editingCard) {
      updateCard(editingCard.id, cardData);
    } else if (activeColumnId) {
      createCard(activeColumnId, cardData);
    }
    setIsEditModalOpen(false);
    setEditingCard(null);
    setActiveColumnId(null);
  };

  const handleDeleteCard = (cardId: string) => {
    if (confirm('Are you sure you want to delete this card?')) {
      deleteCard(cardId);
    }
  };

  const handleUpdateColumn = (columnId: string, title: string) => {
    updateColumn(columnId, { title });
  };

  const handleDeleteColumn = (columnId: string) => {
    if (confirm('Are you sure you want to delete this column and all its cards?')) {
      deleteColumn(columnId);
    }
  };

  const handleAddColumn = () => {
    const title = prompt('Enter column name:');
    if (title?.trim()) {
      createColumn(title.trim());
    }
  };

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-background-dark">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-background-dark">
      <Sidebar />
      <BoardContainer>
        <Header onNewTask={() => {
          if (state.columns.length > 0) {
            handleAddCard(state.columns[0].id);
          }
        }} />
        
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="h-full flex px-6 py-6 gap-6 min-w-max">
            {state.columns.map((column) => (
              <ColumnComponent
                key={column.id}
                column={column}
                cards={getCardsByColumn(column.id)}
                onAddCard={handleAddCard}
                onEditCard={handleEditCard}
                onDeleteCard={handleDeleteCard}
                onUpdateColumn={handleUpdateColumn}
                onDeleteColumn={handleDeleteColumn}
                isDoneColumn={column.title.toLowerCase() === 'done'}
              />
            ))}
            
            <div className="w-80 flex flex-col h-full pt-[52px]">
              <button
                onClick={handleAddColumn}
                className="w-full py-3 border-2 border-dashed border-border-dark rounded-xl text-text-secondary hover:text-white hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <svg
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">Add New Column</span>
              </button>
            </div>
          </div>
        </div>
      </BoardContainer>

      <CardEditModal
        card={editingCard}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingCard(null);
          setActiveColumnId(null);
        }}
        onSave={handleSaveCard}
        onDelete={editingCard ? () => {
          handleDeleteCard(editingCard.id);
          setIsEditModalOpen(false);
          setEditingCard(null);
        } : undefined}
      />
    </div>
  );
}

export default App;
