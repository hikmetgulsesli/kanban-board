import { Filter, Bell, Plus, Search, X, Menu } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleSidebar: () => void;
  onAddTask: () => void;
  sidebarOpen: boolean;
}

export function Header({
  searchQuery,
  onSearchChange,
  onToggleSidebar,
  onAddTask,
  sidebarOpen,
}: HeaderProps) {
  return (
    <header className="h-16 border-b border-border-dark flex items-center justify-between px-4 lg:px-6 bg-background-dark/80 backdrop-blur-sm z-10 flex-shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <h2 className="text-lg lg:text-xl font-bold text-white tracking-tight font-heading truncate">
          Sprint Board - Q3 Goals
        </h2>
        
        <div className="hidden sm:flex h-6 w-px bg-border-dark" />
        
        <div className="hidden sm:flex -space-x-2">
          <div className="h-8 w-8 rounded-full border-2 border-background-dark bg-purple-500 flex items-center justify-center text-xs font-bold text-white">JD</div>
          <div className="h-8 w-8 rounded-full border-2 border-background-dark bg-blue-500 flex items-center justify-center text-xs font-bold text-white">AS</div>
          <div className="h-8 w-8 rounded-full border-2 border-background-dark bg-emerald-500 flex items-center justify-center text-xs font-bold text-white">MK</div>
          <div className="h-8 w-8 rounded-full border-2 border-background-dark bg-card-dark flex items-center justify-center text-xs text-text-secondary">+2</div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 lg:gap-3">
        <div className="relative group hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks..."
            className="bg-card-dark border border-transparent focus:border-primary focus:ring-0 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-text-secondary w-48 lg:w-64 transition-all outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <button 
          aria-label="Filter tasks" 
          className="hidden sm:flex items-center justify-center h-9 w-9 rounded-lg bg-card-dark text-text-secondary hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <Filter className="w-5 h-5" />
        </button>
        
        <button 
          aria-label="View notifications" 
          className="hidden sm:flex items-center justify-center h-9 w-9 rounded-lg bg-card-dark text-text-secondary hover:text-white hover:bg-white/10 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <Bell className="w-5 h-5" />
        </button>
        
        <button 
          onClick={onAddTask}
          className="flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 h-9 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors shadow-lg shadow-primary/20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Task</span>
        </button>
      </div>
    </header>
  );
}
