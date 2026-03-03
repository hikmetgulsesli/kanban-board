import { useState, useEffect } from 'react';
import { X, Calendar, Tag, User, Flag } from 'lucide-react';
import type { Card, CardColor } from '../../types';
import { CARD_COLORS } from '../../types';
import { ConfirmDialog } from './ConfirmDialog';

interface CardModalProps {
  card: Card | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (cardData: Partial<Card>) => void;
  onDelete?: (cardId: string) => void;
}

const PRIORITIES = [
  { value: 'low', label: 'Low', color: 'text-emerald-400' },
  { value: 'medium', label: 'Medium', color: 'text-amber-400' },
  { value: 'high', label: 'High', color: 'text-red-400' },
] as const;

const TAG_OPTIONS = ['Design System', 'Bug Fix', 'Research', 'Frontend', 'Backend', 'Design', 'Content'];

export function CardModal({ card, isOpen, onClose, onSave, onDelete }: CardModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [color, setColor] = useState<CardColor>('#137fec');
  const [dueDate, setDueDate] = useState('');
  const [assignee, setAssignee] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [tagInput, setTagInput] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isEditing = !!card;

  useEffect(() => {
    if (isOpen) {
      if (card) {
        setTitle(card.title);
        setDescription(card.description);
        setSelectedTags(card.tags);
        setColor(card.color as CardColor);
        setDueDate(card.dueDate || '');
        setAssignee(card.assignee || '');
        setPriority(card.priority || 'medium');
      } else {
        setTitle('');
        setDescription('');
        setSelectedTags([]);
        setColor('#137fec');
        setDueDate('');
        setAssignee('');
        setPriority('medium');
      }
    }
  }, [isOpen, card?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      tags: selectedTags,
      color,
      dueDate: dueDate || null,
      assignee: assignee.trim() || undefined,
      priority,
    });
    
    onClose();
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleAddCustomTag = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      setSelectedTags([...selectedTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (card && onDelete) {
      onDelete(card.id);
      onClose();
    }
    setShowDeleteConfirm(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-card-dark border border-border-dark rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between p-4 border-b border-border-dark">
              <h2 className="text-lg font-bold text-white font-heading">
                {isEditing ? 'Edit Card' : 'New Card'}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="text-text-secondary hover:text-white p-1 rounded hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter card title..."
                  className="w-full bg-background-dark border border-border-dark rounded-lg px-3 py-2 text-white placeholder-text-muted focus:border-primary focus:outline-none transition-colors"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a description..."
                  rows={3}
                  className="w-full bg-background-dark border border-border-dark rounded-lg px-3 py-2 text-white placeholder-text-muted focus:border-primary focus:outline-none transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  <Tag className="w-4 h-4 inline mr-1" /> Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {TAG_OPTIONS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-primary text-white'
                          : 'bg-background-dark text-text-secondary hover:text-white'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add custom tag..."
                    className="flex-1 bg-background-dark border border-border-dark rounded-lg px-3 py-1.5 text-sm text-white placeholder-text-muted focus:border-primary focus:outline-none transition-colors"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomTag();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTag}
                    className="px-3 py-1.5 bg-background-dark text-text-secondary hover:text-white rounded-lg text-sm transition-colors"
                  >
 </button>
                </div>
                                   Add
                  {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/20 text-primary rounded text-xs"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className="hover:text-white"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CARD_COLORS.map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setColor(value)}
                        className={`w-8 h-8 rounded-lg transition-transform ${
                          color === value ? 'ring-2 ring-white scale-110' : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: value }}
                        title={label}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    <Flag className="w-4 h-4 inline mr-1" /> Priority
                  </label>
                  <div className="flex gap-2">
                    {PRIORITIES.map(({ value, label, color: priorityColor }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setPriority(value)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          priority === value
                            ? 'bg-background-dark ring-1 ring-primary'
                            : 'bg-background-dark/50 hover:bg-background-dark'
                        }`}
                      >
                        <span className={priority === value ? priorityColor : 'text-text-secondary'}>
                          {label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    <Calendar className="w-4 h-4 inline mr-1" /> Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-background-dark border border-border-dark rounded-lg px-3 py-2 text-white focus:border-primary focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    <User className="w-4 h-4 inline mr-1" /> Assignee
                  </label>
                  <input
                    type="text"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    placeholder="Initials (e.g. JD)"
                    maxLength={2}
                    className="w-full bg-background-dark border border-border-dark rounded-lg px-3 py-2 text-white placeholder-text-muted focus:border-primary focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border-t border-border-dark">
              {isEditing && onDelete ? (
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                  Delete
                </button>
              ) : (
                <div />
              )}
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-text-secondary hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="px-4 py-2 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  {isEditing ? 'Save Changes' : 'Create Card'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Card"
        message="Are you sure you want to delete this card? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
