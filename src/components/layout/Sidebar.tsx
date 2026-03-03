import { LayoutGrid, CheckSquare, Users, BarChart3, Calendar, Settings, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 flex flex-col border-r border-border-dark bg-background-dark flex-shrink-0
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-white text-lg font-bold leading-tight font-heading">TaskMaster</h1>
            <p className="text-text-secondary text-xs font-normal">SaaS Productivity</p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          <ul className="flex flex-col gap-1">
            <li>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/20 text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <LayoutGrid className="w-5 h-5" />
                <span className="text-sm font-medium">Projects</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-white/5 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <CheckSquare className="w-5 h-5" />
                <span className="text-sm font-medium">Tasks</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-white/5 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <Users className="w-5 h-5" />
                <span className="text-sm font-medium">Team</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-white/5 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <BarChart3 className="w-5 h-5" />
                <span className="text-sm font-medium">Analytics</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-white/5 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
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
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-white/5 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm font-medium">Settings</span>
          </a>
          
          <div className="mt-4 flex items-center gap-3 px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-xs font-bold text-white ring-2 ring-primary/30">AM</div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">Alex Morgan</span>
              <span className="text-xs text-text-secondary">Product Manager</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
