import { useState, useCallback } from 'react';
import type { Column } from '../../types';
import { Modal, Button } from '../ui';

interface ColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  column?: Column | null;
  onSave: (column: Partial<Column>) => void;
  onDelete?: (id: string) => void;
}

export function ColumnModal({
  isOpen,
  onClose,
  column,
  onSave,
  onDelete,
}: ColumnModalProps) {
  const [title, setTitle] = useState(column?.title || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens
  const handleOpen = useCallback(() => {
    setTitle(column?.title || '');
    setErrors({});
  }, [column]);

  if (isOpen && title !== (column?.title || '') && Object.keys(errors).length === 0) {
    handleOpen();
  }

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {
      newErrors.title = 'Column title is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    onSave({
      id: column?.id,
      title: title.trim(),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={column ? 'Edit Column' : 'New Column'}
      size="sm"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">
            Column Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`
              w-full bg-background-dark border rounded-lg px-4 py-2 text-white
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              transition-all duration-200
              ${errors.title ? 'border-error' : 'border-border-dark'}
            `}
            placeholder="Enter column title..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              }
            }}
          />
          {errors.title && (
            <p className="text-error text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div className="flex justify-between pt-4 border-t border-border-dark">
          <div>
            {column && onDelete && (
              <Button
                variant="danger"
                onClick={() => {
                  onDelete(column.id);
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
              {column ? 'Save Changes' : 'Create Column'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
