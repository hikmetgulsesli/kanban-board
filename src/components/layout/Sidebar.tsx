import { useState } from 'react';
import { LayoutGrid, CheckSquare, Users, BarChart3, Calendar, Settings, Menu, X, Moon, Sun } from 'lucide-react';

export function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const navItems = [
    { icon: LayoutGrid, label: 'Projects', active: true },
    { icon: CheckSquare, label: 'Tasks', active: false },
    { icon: Users, label: 'Team', active: false },
    { icon: BarChart3, label: 'Analytics', active: false },
    { icon: Calendar, label: 'Calendar', active: false },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-background-dark border-b border-border-dark flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <h1 className="text-white text-base font-bold font-heading">TaskMaster</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <aside 
        className={`
          fixed md:relative z-50
          w-64 flex flex-col border-r border-border-dark bg-background-dark flex-shrink-0
          transition-transform duration-300 ease-out
          h-full
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
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
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href="#"
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors
                    ${item.active 
                      ? 'bg-primary/20 text-primary' 
                      : 'text-text-secondary hover:bg-white/5 hover:text-white'
                    }
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="px-4 py-4 border-t border-border-dark flex flex-col gap-1">
          {/* Dark Mode Toggle - Desktop */}
          <button
            onClick={toggleDarkMode}
            className="hidden md:flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:bg-white/5 hover:text-white transition-colors w-full text-left"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span className="text-sm font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
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
    </>
  );
}
