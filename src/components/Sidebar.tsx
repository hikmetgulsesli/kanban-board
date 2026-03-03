import { Folder, CheckSquare, Users, BarChart3, Calendar, Settings } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-64 flex flex-col border-r border-[#233648] bg-[#101922] flex-shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-[#137fec] flex items-center justify-center text-white">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </svg>
        </div>
        <div>
          <h1 className="text-white text-lg font-bold leading-tight">TaskMaster</h1>
          <p className="text-[#92adc9] text-xs font-normal">SaaS Productivity</p>
        </div>
      </div>
      <nav className="flex-1 px-4 py-4 flex flex-col gap-1 overflow-y-auto">
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#137fec]/20 text-[#137fec] group transition-colors"
        >
          <Folder className="w-5 h-5" />
          <span className="text-sm font-medium">Projects</span>
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#92adc9] hover:bg-white/5 hover:text-white transition-colors"
        >
          <CheckSquare className="w-5 h-5" />
          <span className="text-sm font-medium">Tasks</span>
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#92adc9] hover:bg-white/5 hover:text-white transition-colors"
        >
          <Users className="w-5 h-5" />
          <span className="text-sm font-medium">Team</span>
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#92adc9] hover:bg-white/5 hover:text-white transition-colors"
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-sm font-medium">Analytics</span>
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#92adc9] hover:bg-white/5 hover:text-white transition-colors"
        >
          <Calendar className="w-5 h-5" />
          <span className="text-sm font-medium">Calendar</span>
        </a>
      </nav>
      <div className="px-4 py-4 border-t border-[#233648] flex flex-col gap-1">
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#92adc9] hover:bg-white/5 hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm font-medium">Settings</span>
        </a>
        <div className="mt-4 flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#137fec] to-purple-500 ring-2 ring-[#137fec]/50" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">Alex Morgan</span>
            <span className="text-xs text-[#92adc9]">Product Manager</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
