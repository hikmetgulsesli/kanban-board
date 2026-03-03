import { useState, useCallback } from 'react';
import { X, Calendar, Tag, Plus, Trash2 } from 'lucide-react';
import type { Card as CardType, CardColor } from '../types/index.js';
import { CARD_COLORS, DEFAULT_TAGS } from '../types/index.js';

interface CardEditModalProps {
  card?: CardType | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (cardData: {
    title: string;
    description: string;
    tags: string[];
    color: CardColor;
    dueDate: string | null;
  }) => void;
  onDelete?: () => void;
}

export function CardEditModal({ card, isOpen, onClose, onSave, onDelete }: CardEditModalProps) {
  const isEditing = !!card;

  const getInitialState = useCallback(() => {
    if (card) {
      return {
        title: card.title,
        description: card.description,
        tags: card.tags,
        color: (card.color as CardColor) || 'blue',
        dueDate: card.dueDate ? card.dueDate.split('T')[0] : '',
      };
    }
    return {
      title: '',
      description: '',
      tags: [],
      color: 'blue' as CardColor,
      dueDate: '',
    };
  }, [card]);

  const initialState = getInitialState();
  const [title, setTitle] = useState(initialState.title);
  const [description, setDescription] = useState(initialState.description);
  const [tags, setTags] = useState<string[]>(initialState.tags);
  const [color, setColor] = useState<CardColor>(initialState.color);
  const [dueDate, setDueDate] = useState<string>(initialState.dueDate);
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    
    onSave({
      title: title.trim(),
      description: description.trim(),
      tags,
      color,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    });
    onClose();
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAddDefaultTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-card-dark border border-border-dark rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-border-dark">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white font-heading">
                {isEditing ? 'Edit Card' : 'New Card'}
              </h2>
              <div className="flex items-center gap-2">
                {isEditing && onDelete && (
                  <button
                    onClick={onDelete}
                    className="p-2 text-text-secondary hover:text-error hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter card title..."
                className={`
                  w-full bg-background-dark border rounded-lg px-3 py-2.5 text-white text-sm
                  placeholder-text-muted focus:outline-none focus:border-primary transition-colors
                  ${errors.title ? 'border-error' : 'border-border-dark'}
                `}
              />
              {errors.title && (
                <p className="text-error text-xs mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description..."
                rows={3}
                className="w-full bg-background-dark border border-border-dark rounded-lg px-3 py-2.5 text-white text-sm placeholder-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Color
              </label>
              <div className="flex gap-2">
                {(Object.keys(CARD_COLORS) as CardColor[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`
                      w-8 h-8 rounded-lg ${CARD_COLORS[c].bg} transition-all
                      ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-card-dark scale-110' : 'hover:scale-105'}
                    `}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Due Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-background-dark border border-border-dark rounded-lg pl-10 pr-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Tags
              </label>
              
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded bg-primary/10 text-primary"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add a tag..."
                  className="flex-1 bg-background-dark border border-border-dark rounded-lg px-3 py-2 text-white text-sm placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
                />
                <button
                  onClick={handleAddTag}
                  disabled={!newTag.trim()}
                  className="px-3 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {DEFAULT_TAGS.filter((t) => !tags.includes(t)).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleAddDefaultTag(tag)}
                    className="text-xs px-2 py-1 rounded bg-white/5 text-text-secondary hover:bg-white/10 hover:text-white transition-colors"
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-border-dark flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-text-secondary hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium transition-colors"
            >
              {isEditing ? 'Save Changes' : 'Create Card'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
