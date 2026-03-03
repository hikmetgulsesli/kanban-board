import type { FilterState, Tag } from '../../types';
import { TagBadge } from '../ui';
import { Search, X } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableTags: Tag[];
}

export function FilterBar({ filters, onFilterChange, availableTags }: FilterBarProps) {
  const hasActiveFilters = 
    filters.searchQuery || 
    filters.selectedTags.length > 0 ||
    filters.priorityFilter.length > 0 ||
    filters.dueDateFilter !== 'all';

  const clearFilters = () => {
    onFilterChange({
      searchQuery: '',
      selectedTags: [],
      priorityFilter: [],
      dueDateFilter: 'all',
    });
  };

  const toggleTag = (tagId: string) => {
    onFilterChange({
      ...filters,
      selectedTags: filters.selectedTags.includes(tagId)
        ? filters.selectedTags.filter(id => id !== tagId)
        : [...filters.selectedTags, tagId],
    });
  };

  const togglePriority = (priority: 'low' | 'medium' | 'high') => {
    onFilterChange({
      ...filters,
      priorityFilter: filters.priorityFilter.includes(priority)
        ? filters.priorityFilter.filter(p => p !== priority)
        : [...filters.priorityFilter, priority],
    });
  };

  return (
    <div className="bg-card-dark/50 border-b border-border-dark px-6 py-3 space-y-3">
      {/* Search Row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            placeholder="Search tasks..."
            className="w-full bg-background-dark border border-border-dark rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Due Date Filter */}
        <select
          value={filters.dueDateFilter}
          onChange={(e) => onFilterChange({ ...filters, dueDateFilter: e.target.value as FilterState['dueDateFilter'] })}
          className="bg-background-dark border border-border-dark rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 cursor-pointer"
        >
          <option value="all">All Dates</option>
          <option value="overdue">Overdue</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2 text-sm text-text-secondary hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
            Clear filters
          </button>
        )}
      </div>

      {/* Tags & Priority Row */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Tags */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">Tags:</span>
          <div className="flex gap-1">
            {availableTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag.id)}
                className={`
                  transition-all duration-150
                  ${filters.selectedTags.includes(tag.id) ? 'opacity-100 ring-2 ring-primary ring-offset-1 ring-offset-card-dark rounded' : 'opacity-50 hover:opacity-75'}
                `}
              >
                <TagBadge name={tag.name} color={tag.color} />
              </button>
            ))}
          </div>
        </div>

        <div className="w-px h-6 bg-border-dark" />

        {/* Priority */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-text-secondary">Priority:</span>
          <div className="flex gap-1">
            {(['low', 'medium', 'high'] as const).map((priority) => (
              <button
                key={priority}
                onClick={() => togglePriority(priority)}
                className={`
                  px-3 py-1 rounded-full text-xs font-medium capitalize transition-all duration-150
                  ${filters.priorityFilter.includes(priority)
                    ? priority === 'high' 
                      ? 'bg-error/20 text-error ring-2 ring-error/50' 
                      : priority === 'medium'
                        ? 'bg-warning/20 text-warning ring-2 ring-warning/50'
                        : 'bg-text-secondary/20 text-text-secondary ring-2 ring-text-secondary/50'
                    : 'bg-border-dark text-text-secondary hover:bg-white/5'
                  }
                `}
              >
                {priority}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
