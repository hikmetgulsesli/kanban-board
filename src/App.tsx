import { Header, Sidebar, BoardContainer } from './components/layout';
import { Board } from './components/board';

function App() {
  return (
    <div className="h-screen flex overflow-hidden bg-background-dark">
      <Sidebar />
      <BoardContainer>
        <Header />
        <Board />
      </BoardContainer>
    </div>
  );
}

export default App;
