import { Header, Sidebar, BoardContainer } from './components/layout';

function App() {
  return (
    <div className="h-screen flex overflow-hidden bg-background-dark">
      <Sidebar />
      <BoardContainer>
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2 font-heading">Kanban Board</h1>
            <p className="text-text-secondary">Project initialized successfully!</p>
            <p className="text-text-muted text-sm mt-4">Ready for US-002: Drag & Drop Implementation</p>
          </div>
        </div>
      </BoardContainer>
    </div>
  );
}

export default App;
