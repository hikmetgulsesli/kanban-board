import { Search, Filter, Bell, Plus } from 'lucide-react';

export function Header() {
  return (
    <header className="h-16 border-b border-border-dark flex items-center justify-between px-6 bg-background-dark/80 backdrop-blur-sm z-10">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-white tracking-tight font-heading">Sprint Board - Q3 Goals</h2>
        <div className="h-6 w-px bg-border-dark"></div>
        <div className="flex -space-x-2">
          <div className="h-8 w-8 rounded-full border-2 border-background-dark bg-purple-500 flex items-center justify-center text-xs font-bold text-white">JD</div>
          <div className="h-8 w-8 rounded-full border-2 border-background-dark bg-blue-500 flex items-center justify-center text-xs font-bold text-white">AS</div>
          <div className="h-8 w-8 rounded-full border-2 border-background-dark bg-emerald-500 flex items-center justify-center text-xs font-bold text-white">MK</div>
          <div className="h-8 w-8 rounded-full border-2 border-background-dark bg-card-dark flex items-center justify-center text-xs text-text-secondary">+2</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="bg-card-dark border border-transparent focus:border-primary focus:ring-0 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-text-secondary w-64 transition-all outline-none"
          />
        </div>
        <button className="flex items-center justify-center h-9 w-9 rounded-lg bg-card-dark text-text-secondary hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
          <Filter className="w-5 h-5" />
        </button>
        <button className="flex items-center justify-center h-9 w-9 rounded-lg bg-card-dark text-text-secondary hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
          <Bell className="w-5 h-5" />
        </button>
        <button className="flex items-center gap-2 px-4 h-9 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors shadow-lg shadow-primary/20 cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
}
