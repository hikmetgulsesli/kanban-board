import { Search, Filter, Bell, Plus } from 'lucide-react';

export function Header() {
  return (
    <header className="h-16 border-b border-[#233648] flex items-center justify-between px-6 bg-[#101922]/80 backdrop-blur-sm z-10">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-white tracking-tight">Sprint Board - Q3 Goals</h2>
        <div className="h-6 w-px bg-[#233648]" />
        <div className="flex -space-x-2">
          <div className="h-8 w-8 rounded-full border-2 border-[#101922] bg-purple-500 flex items-center justify-center text-xs font-bold text-white">JD</div>
          <div className="h-8 w-8 rounded-full border-2 border-[#101922] bg-blue-500 flex items-center justify-center text-xs font-bold text-white">AS</div>
          <div className="h-8 w-8 rounded-full border-2 border-[#101922] bg-emerald-500 flex items-center justify-center text-xs font-bold text-white">MK</div>
          <div className="h-8 w-8 rounded-full border-2 border-[#101922] bg-[#1a2632] flex items-center justify-center text-xs text-[#92adc9]">+2</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#92adc9] group-focus-within:text-[#137fec] transition-colors" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="bg-[#1a2632] border-transparent focus:border-[#137fec] focus:ring-0 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-[#92adc9] w-64 transition-all outline-none border"
          />
        </div>
        <button className="flex items-center justify-center h-9 w-9 rounded-lg bg-[#1a2632] text-[#92adc9] hover:text-white hover:bg-white/10 transition-colors">
          <Filter className="w-5 h-5" />
        </button>
        <button className="flex items-center justify-center h-9 w-9 rounded-lg bg-[#1a2632] text-[#92adc9] hover:text-white hover:bg-white/10 transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <button className="flex items-center gap-2 px-4 h-9 rounded-lg bg-[#137fec] hover:bg-[#0d6fd4] text-white text-sm font-semibold transition-colors shadow-lg shadow-[#137fec]/20">
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
}
