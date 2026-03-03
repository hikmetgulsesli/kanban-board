import { useState } from 'react';
import { Header, Sidebar, BoardContainer } from './components/layout/index.js';
import { useKanbanStore } from './store/kanbanStore.js';
import type { Card, Column, Tag } from './types/index.js';
import { MoreHorizontal, Plus, Calendar, X } from 'lucide-react';

const tagColorClasses: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500' },
  orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500' },
  red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500' },
  yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500' },
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

function CardItem({ card, isOverdue, isDueToday }: { card: Card; isOverdue: (card: Card) => boolean; isDueToday: (card: Card) => boolean }) {
  const colors = tagColorClasses[card.tags[0]?.color || 'blue'];
  const overdue = isOverdue(card);
  const dueToday = isDueToday(card);

  return (
    <div className="bg-card-dark rounded-xl p-4 border border-border-dark hover:border-primary/50 transition-colors group cursor-pointer relative overflow-hidden shadow-sm">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${colors.border}`}></div>
      <div className="mb-2 flex justify-between items-start">
        {card.tags.length > 0 && (
          <span className={`text-xs font-medium px-2 py-1 rounded ${colors.bg} ${colors.text}`}>
            {card.tags[0].name}
          </span>
        )}
        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-text-secondary hover:text-white">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      <h4 className="text-white font-medium mb-1 leading-snug">{card.title}</h4>
      <p className="text-text-secondary text-sm font-body mb-3 line-clamp-2">{card.description}</p>
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div className="flex items-center gap-3">
          {card.dueDate && (
            <div className={`flex items-center gap-1 text-xs ${
              overdue ? 'text-error' : dueToday ? 'text-warning' : 'text-text-secondary'
            }`}>
              <Calendar className="w-3 h-3" />
              <span>{formatDate(card.dueDate)}</span>
              {overdue && <span className="text-error font-medium">(Overdue)</span>}
              {dueToday && <span className="text-warning font-medium">(Today)</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function KanbanColumn({ column, isOverdue, isDueToday, onAddCard }: { column: Column; isOverdue: (card: Card) => boolean; isDueToday: (card: Card) => boolean; onAddCard: (columnId: string) => void }) {
  return (
    <div className="w-80 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-white text-lg">{column.title}</h3>
          <span className="bg-card-dark text-text-secondary text-xs font-bold px-2 py-0.5 rounded-full border border-white/5">
            {column.cards.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onAddCard(column.id)}
            className="text-text-secondary hover:text-white p-1 rounded hover:bg-white/5 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button className="text-text-secondary hover:text-white p-1 rounded hover:bg-white/5 transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {column.cards.map((card) => (
          <CardItem key={card.id} card={card} isOverdue={isOverdue} isDueToday={isDueToday} />
        ))}
      </div>
    </div>
  );
}

function AddCardModal({ isOpen, columnId, onClose, onAdd, availableTags }: { isOpen: boolean; columnId: string | null; onClose: () => void; onAdd: (columnId: string, card: { title: string; description: string; tags: Tag[]; dueDate: string | null }) => void; availableTags: Tag[] }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');

  if (!isOpen || !columnId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const tags = availableTags.filter((tag) => selectedTags.includes(tag.id));
    onAdd(columnId, { title: title.trim(), description: description.trim(), tags, dueDate: dueDate || null });
    setTitle('');
    setDescription('');
    setSelectedTags([]);
    setDueDate('');
    onClose();
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) => prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card-dark border border-border-dark rounded-xl p-6 w-96 max-w-[90vw]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold font-heading">Add New Task</h3>
          <button onClick={onClose} className="text-text-secondary hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-text-secondary text-sm mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-background-dark border border-border-dark rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
              placeholder="Enter task title"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-text-secondary text-sm mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-background-dark border border-border-dark rounded-lg px-3 py-2 text-white focus:border-primary outline-none h-20 resize-none"
              placeholder="Enter task description"
            />
          </div>
          <div className="mb-4">
            <label className="block text-text-secondary text-sm mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-background-dark border border-border-dark rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
            />
          </div>
          {availableTags.length > 0 && (
            <div className="mb-4">
              <label className="block text-text-secondary text-sm mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const colors = tagColorClasses[tag.color];
                  const isSelected = selectedTags.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                        isSelected ? colors.bg + ' ' + colors.text + ' ring-1 ring-' + tag.color + '-500' : 'bg-background-dark text-text-secondary hover:text-white'
                      }`}
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg bg-background-dark text-text-secondary hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function App() {
  const {
    filters,
    getAllTags,
    getFilteredColumns,
    hasActiveFilters,
    setSearchText,
    toggleTag,
    setDueDateFilter,
    clearFilters,
    addCard,
    isOverdue,
    isDueToday,
    defaultTags,
  } = useKanbanStore();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);

  const columns = getFilteredColumns();
  const allTags = getAllTags();

  const handleAddCard = (columnId: string) => {
    setSelectedColumnId(columnId);
    setIsAddModalOpen(true);
  };

  const handleAddCardSubmit = (columnId: string, card: { title: string; description: string; tags: Tag[]; dueDate: string | null }) => {
    addCard(columnId, card);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background-dark">
      <Sidebar />
      <BoardContainer>
        <Header
          filters={filters}
          allTags={allTags}
          hasActiveFilters={hasActiveFilters()}
          onSearchChange={setSearchText}
          onTagToggle={toggleTag}
          onDueDateFilterChange={setDueDateFilter}
          onClearFilters={clearFilters}
          onAddTask={() => handleAddCard(columns[0]?.id || 'col-1')}
        />
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="h-full flex px-6 py-6 gap-6 min-w-max">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                isOverdue={isOverdue}
                isDueToday={isDueToday}
                onAddCard={handleAddCard}
              />
            ))}
            <div className="w-80 flex flex-col h-full pt-[52px]">
              <button className="w-full py-3 border-2 border-dashed border-border-dark rounded-xl text-text-secondary hover:text-white hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group">
                <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Add New Column</span>
              </button>
            </div>
          </div>
        </div>
      </BoardContainer>
      <AddCardModal
        isOpen={isAddModalOpen}
        columnId={selectedColumnId}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCardSubmit}
        availableTags={defaultTags}
      />
    </div>
  );
}

export default App;
