import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Board } from './components/Board';
import './index.css';

function App() {
  return (
    <div className="h-screen flex overflow-hidden bg-[#101922]">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 relative kanban-grid-bg">
        <Header />
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <Board />
        </div>
      </main>
    </div>
  );
}

export default App;
