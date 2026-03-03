import { useState } from 'react';
import { Header, Sidebar, BoardContainer } from './components/layout';
import { Board } from './components/board';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddTask = () => {
    // Dispatch a custom event to trigger the board's add card
    const event = new CustomEvent('addCard', { detail: { columnId: 'col-1' } });
    window.dispatchEvent(event);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background-dark">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <BoardContainer>
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onAddTask={handleAddTask}
          sidebarOpen={sidebarOpen}
        />
        <Board />
      </BoardContainer>
    </div>
  );
}

export default App;
