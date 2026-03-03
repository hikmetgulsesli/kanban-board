import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface PromptDialogProps {
  isOpen: boolean;
  title: string;
  placeholder?: string;
  defaultValue?: string;
  onConfirm: (value: string) => void;
  onCancel: () => void;
}

export function PromptDialog({ isOpen, title, placeholder, defaultValue, onConfirm, onCancel }: PromptDialogProps) {
  const [value, setValue] = useState(defaultValue || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue || '');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, defaultValue]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onCancel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onConfirm(value.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-card-dark border border-border-dark rounded-xl p-6 w-96 shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-white font-heading">{title}</h3>
          <button type="button" onClick={onCancel} className="text-text-secondary hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2 bg-background-dark border border-border-dark rounded-lg text-white placeholder-text-secondary focus:border-primary focus:outline-none"
        />
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-background-dark text-text-secondary hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!value.trim()}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white transition-colors disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
