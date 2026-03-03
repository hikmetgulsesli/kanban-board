import { useState } from 'react';
import { Header, Sidebar, BoardContainer } from './components/layout';
import { Board } from './components/board';
import { useBoard } from './hooks/useBoard';

function App() {
  const {
    board,
    isLoaded,
    filters,
    filteredCardIds,
    allTags,
    hasActiveFilters,
    createCard,
    updateCard,
    deleteCard,
    moveCard,
    createColumn,
    setSearchText,
    setSelectedTags,
    setDueDateFilter,
    clearFilters,
  } = useBoard();

  const [triggerNewCard, setTriggerNewCard] = useState(false);

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center bg-background-dark">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const handleCreateCard = () => {
    setTriggerNewCard(true);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background-dark">
      <Sidebar />
      <BoardContainer>
        <Header
          filters={filters}
          allTags={allTags}
          hasActiveFilters={hasActiveFilters}
          onSearchChange={setSearchText}
          onTagsChange={setSelectedTags}
          onDueDateChange={setDueDateFilter}
          onClearFilters={clearFilters}
          onCreateCard={handleCreateCard}
        />
        <Board
          board={board}
          filteredCardIds={filteredCardIds}
          onCreateCard={createCard}
          onUpdateCard={updateCard}
          onDeleteCard={deleteCard}
          onMoveCard={moveCard}
          onCreateColumn={createColumn}
          onAddNewCard={triggerNewCard}
          onAddNewCardHandled={() => setTriggerNewCard(false)}
        />
      </BoardContainer>
    </div>
  );
}

export default App;
