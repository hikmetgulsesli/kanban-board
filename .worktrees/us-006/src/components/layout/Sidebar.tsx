import { LayoutGrid, CheckSquare, Users, BarChart3, Calendar, Settings } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-64 flex flex-col border-r border-border-dark bg-background-dark flex-shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white">
          <LayoutGrid className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-white text-lg font-bold leading-tight font-heading">TaskMaster</h1>
          <p className="text-text-secondary text-xs font-normal">SaaS Productivity</p>
        </div>
      </div>
      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        <ul className="flex flex-col gap-1">
          <li>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/20 text-primary transition-colors"
            >
              <LayoutGrid className="w-5 h-5" />
              <span className="text-sm font-medium">Projects</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-white/5 hover:text-white transition-colors"
            >
              <CheckSquare className="w-5 h-5" />
              <span className="text-sm font-medium">Tasks</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-white/5 hover:text-white transition-colors"
            >
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">Team</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-white/5 hover:text-white transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-sm font-medium">Analytics</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-white/5 hover:text-white transition-colors"
            >
              <Calendar className="w-5 h-5" />
              <span className="text-sm font-medium">Calendar</span>
            </a>
          </li>
        </ul>
      </nav>
      <div className="px-4 py-4 border-t border-border-dark flex flex-col gap-1">
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-white/5 hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm font-medium">Settings</span>
        </a>
        <div className="mt-4 flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-xs font-bold text-white">AM</div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">Alex Morgan</span>
            <span className="text-xs text-text-secondary">Product Manager</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
