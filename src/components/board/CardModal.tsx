import { useState, useCallback } from 'react';
import type { Card, Tag } from '../../types';
import { Modal, Button, TagBadge } from '../ui';
import { Calendar } from 'lucide-react';

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  card?: Card | null;
  columnId?: string;
  availableTags: Tag[];
  onSave: (card: Partial<Card>) => void;
  onDelete?: (id: string) => void;
}

// Helper to initialize form state
function useCardForm(card?: Card | null) {
  const [title, setTitle] = useState(card?.title || '');
  const [description, setDescription] = useState(card?.description || '');
  const [selectedTags, setSelectedTags] = useState<Tag[]>(card?.tags || []);
  const [dueDate, setDueDate] = useState(card?.dueDate || '');
  const [assignees, setAssignees] = useState(card?.assignees.join(', ') || '');
  const [priority, setPriority] = useState<Card['priority']>(card?.priority || 'medium');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = useCallback((newCard?: Card | null) => {
    setTitle(newCard?.title || '');
    setDescription(newCard?.description || '');
    setSelectedTags(newCard?.tags || []);
    setDueDate(newCard?.dueDate || '');
    setAssignees(newCard?.assignees.join(', ') || '');
    setPriority(newCard?.priority || 'medium');
    setErrors({});
  }, []);

  const validate = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [title]);

  return {
    title, setTitle,
    description, setDescription,
    selectedTags, setSelectedTags,
    dueDate, setDueDate,
    assignees, setAssignees,
    priority, setPriority,
    errors,
    resetForm,
    validate,
  };
}

export function CardModal({
  isOpen,
  onClose,
  card,
  columnId,
  availableTags,
  onSave,
  onDelete,
}: CardModalProps) {
  const form = useCardForm(card);

  // Reset form when modal opens with new card
  const handleOpenChange = useCallback((open: boolean) => {
    if (open) {
      form.resetForm(card);
    }
  }, [card, form]);

  // Call handleOpenChange when isOpen changes
  if (isOpen) {
    handleOpenChange(true);
  }

  const handleSave = () => {
    if (!form.validate()) return;

    const assigneeList = form.assignees
      .split(',')
      .map(a => a.trim().toUpperCase())
      .filter(a => a.length > 0);

    onSave({
      id: card?.id,
      title: form.title.trim(),
      description: form.description.trim(),
      columnId: card?.columnId || columnId,
      tags: form.selectedTags,
      dueDate: form.dueDate || undefined,
      assignees: assigneeList,
      priority: form.priority,
    });
    onClose();
  };

  const toggleTag = (tag: Tag) => {
    form.setSelectedTags(prev => {
      const exists = prev.find(t => t.id === tag.id);
      if (exists) {
        return prev.filter(t => t.id !== tag.id);
      }
      return [...prev, tag];
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={card ? 'Edit Card' : 'New Card'}
      size="md"
    >
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Title *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => form.setTitle(e.target.value)}
            className={`
              w-full bg-background-dark border rounded-lg px-4 py-2 text-white
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              transition-all duration-200
              ${form.errors.title ? 'border-error' : 'border-border-dark'}
            `}
            placeholder="Enter card title..."
          />
          {form.errors.title && (
            <p className="text-error text-sm mt-1">{form.errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => form.setDescription(e.target.value)}
            rows={3}
            className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
            placeholder="Add a description..."
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggleTag(tag)}
                className={`
                  transition-all duration-150
                  ${form.selectedTags.find(t => t.id === tag.id) ? 'opacity-100' : 'opacity-50 hover:opacity-75'}
                `}
              >
                <TagBadge name={tag.name} color={tag.color} />
              </button>
            ))}
          </div>
        </div>

        {/* Due Date & Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Due Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => form.setDueDate(e.target.value)}
                className="w-full bg-background-dark border border-border-dark rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Priority
            </label>
            <select
              value={form.priority}
              onChange={(e) => form.setPriority(e.target.value as Card['priority'])}
              className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 cursor-pointer"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Assignees */}
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Assignees (comma-separated initials)
          </label>
          <input
            type="text"
            value={form.assignees}
            onChange={(e) => form.setAssignees(e.target.value)}
            className="w-full bg-background-dark border border-border-dark rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            placeholder="e.g. JD, AS, MK"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-4 border-t border-border-dark">
          <div>
            {card && onDelete && (
              <Button
                variant="danger"
                onClick={() => {
                  onDelete(card.id);
                  onClose();
                }}
              >
                Delete
              </Button>
            )}
          </div>
          
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {card ? 'Save Changes' : 'Create Card'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
