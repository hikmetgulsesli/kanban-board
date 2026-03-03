import { useState } from 'react';
import { Search, Filter, Bell, Plus, X, Calendar, Tag } from 'lucide-react';
import type { FilterState } from '../../types';

interface HeaderProps {
  filters: FilterState;
  allTags: string[];
  hasActiveFilters: boolean;
  onSearchChange: (text: string) => void;
  onTagsChange: (tags: string[]) => void;
  onDueDateChange: (filter: FilterState['dueDateFilter']) => void;
  onClearFilters: () => void;
}

export function Header({
  filters,
  allTags,
  hasActiveFilters,
  onSearchChange,
  onTagsChange,
  onDueDateChange,
  onClearFilters,
}: HeaderProps) {
  const [showFilters, setShowFilters] = useState(false);

  const toggleTag = (tag: string) => {
    if (filters.selectedTags.includes(tag)) {
      onTagsChange(filters.selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...filters.selectedTags, tag]);
    }
  };

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
            className="bg-card-dark border border-transparent focus:border-primary focus:ring-0 rounded-lg py-2 pl-10 pr-10 text-sm text-white placeholder-text-secondary w-64 transition-all outline-none"
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
        <div className="relative">
          <button
            aria-label="Filter tasks"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center h-9 w-9 rounded-lg transition-colors cursor-pointer ${
              showFilters || hasActiveFilters
                ? 'bg-primary text-white'
                : 'bg-card-dark text-text-secondary hover:text-white hover:bg-white/10'
            }`}
          >
            <Filter className="w-5 h-5" />
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-accent rounded-full text-xs text-black font-bold flex items-center justify-center">
                {(filters.searchText ? 1 : 0) +
                  filters.selectedTags.length +
                  (filters.dueDateFilter !== 'all' ? 1 : 0)}
              </span>
            )}
          </button>
          {showFilters && (
            <div className="absolute right-0 top-12 w-72 bg-card-dark border border-border-dark rounded-lg shadow-lg p-4 z-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={onClearFilters}
                    className="text-xs text-accent hover:text-accent/80 flex items-center gap-1"
                  >
                    Clear all
                  </button>
                )}
              </div>
              
              {/* Due Date Filter */}
              <div className="mb-4">
                <label className="text-xs text-text-secondary flex items-center gap-2 mb-2">
                  <Calendar className="w-3 h-3" />
                  Due Date
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['all', 'overdue', 'today', 'thisWeek'] as const).map((option) => (
                    <button
                      key={option}
                      onClick={() => onDueDateChange(option)}
                      className={`px-3 py-1 text-xs rounded-md transition-colors ${
                        filters.dueDateFilter === option
                          ? 'bg-primary text-white'
                          : 'bg-background-dark text-text-secondary hover:text-white'
                      }`}
                    >
                      {option === 'all' ? 'All' : option === 'overdue' ? 'Overdue' : option === 'today' ? 'Today' : 'This Week'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tag Filter */}
              {allTags.length > 0 && (
                <div>
                  <label className="text-xs text-text-secondary flex items-center gap-2 mb-2">
                    <Tag className="w-3 h-3" />
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${
                          filters.selectedTags.includes(tag)
                            ? 'bg-primary text-white'
                            : 'bg-background-dark text-text-secondary hover:text-white'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Filter Indicators */}
              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-border-dark">
                  <div className="flex flex-wrap gap-2">
                    {filters.searchText && (
                      <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded">
                        Search: "{filters.searchText}"
                      </span>
                    )}
                    {filters.selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-primary/20 text-primary rounded flex items-center gap-1"
                      >
                        {tag}
                        <button onClick={() => toggleTag(tag)}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {filters.dueDateFilter !== 'all' && (
                      <span className="px-2 py-1 text-xs bg-primary/20 text-primary rounded">
                        Due: {filters.dueDateFilter}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <button aria-label="View notifications" className="flex items-center justify-center h-9 w-9 rounded-lg bg-card-dark text-text-secondary hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
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
