import { BoardProvider } from './context/index.js';
import { Header, Sidebar, BoardContainer } from './components/layout/index.js';
import { Board } from './components/board/index.js';

function App() {
  return (
    <BoardProvider>
      <div className="h-screen flex overflow-hidden bg-background-dark">
        <Sidebar />
        <BoardContainer>
          <Header />
          <Board />
        </BoardContainer>
      </div>
    </BoardProvider>
  );
}

export default App;
