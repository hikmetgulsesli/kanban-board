import { Search, Filter, Bell, Plus, X, Calendar, Tag } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { FilterState, DueDateFilter } from '../../types/index.js';

interface HeaderProps {
  filters: FilterState;
  allTags: Array<{ id: string; name: string; color: string }>;
  hasActiveFilters: boolean;
  onSearchChange: (text: string) => void;
  onTagToggle: (tagId: string) => void;
  onDueDateFilterChange: (filter: DueDateFilter) => void;
  onClearFilters: () => void;
  onAddTask: () => void;
}

const dueDateOptions: { value: DueDateFilter; label: string }[] = [
  { value: 'all', label: 'All Dates' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'today', label: 'Due Today' },
  { value: 'this-week', label: 'This Week' },
];

export function Header({
  filters,
  allTags,
  hasActiveFilters,
  onSearchChange,
  onTagToggle,
  onDueDateFilterChange,
  onClearFilters,
  onAddTask,
}: HeaderProps) {
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };

    if (showFilters) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilters]);

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
            value={filters.searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-card-dark border border-transparent focus:border-primary focus:ring-0 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-text-secondary w-64 transition-all outline-none"
          />
          {filters.searchText && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setShowFilters(!showFilters)}
            aria-label="Filter tasks"
            className={`flex items-center justify-center h-9 w-9 rounded-lg transition-colors cursor-pointer relative ${
              hasActiveFilters
                ? 'bg-primary text-white'
                : 'bg-card-dark text-text-secondary hover:text-white hover:bg-white/10'
            }`}
          >
            <Filter className="w-5 h-5" />
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full border-2 border-background-dark"></span>
            )}
          </button>

          {showFilters && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-card-dark border border-border-dark rounded-xl shadow-lg z-50 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold font-heading">Filters</h3>
                {hasActiveFilters && (
                  <button
                    onClick={onClearFilters}
                    className="text-xs text-primary hover:text-primary-hover transition-colors flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Clear all
                  </button>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 text-text-secondary text-sm mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Due Date</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {dueDateOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => onDueDateFilterChange(option.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        filters.dueDateFilter === option.value
                          ? 'bg-primary text-white'
                          : 'bg-background-dark text-text-secondary hover:text-white'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {allTags.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-text-secondary text-sm mb-2">
                    <Tag className="w-4 h-4" />
                    <span>Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => onTagToggle(tag.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          filters.selectedTags.includes(tag.id)
                            ? 'bg-primary text-white'
                            : 'bg-background-dark text-text-secondary hover:text-white'
                        }`}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <button
          aria-label="View notifications"
          className="flex items-center justify-center h-9 w-9 rounded-lg bg-card-dark text-text-secondary hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <Bell className="w-5 h-5" />
        </button>
        <button
          onClick={onAddTask}
          className="flex items-center gap-2 px-4 h-9 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors shadow-lg shadow-primary/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
}
