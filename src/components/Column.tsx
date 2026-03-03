import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import type { Column as ColumnType } from '../types';

interface ColumnProps {
  column: ColumnType;
  onUpdateTitle: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  cardCount: number;
}

export function Column({ column, onUpdateTitle, onDelete, cardCount }: ColumnProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSaveTitle = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== column.title) {
      onUpdateTitle(column.id, trimmed);
    } else {
      setEditTitle(column.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setEditTitle(column.title);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    onDelete(column.id);
    setShowDeleteConfirm(false);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="w-80 flex flex-col h-full opacity-50"
      >
        <div className="flex items-center justify-between mb-4 p-2 bg-[#1a2632]/50 rounded-lg">
          <div className="flex items-center gap-2">
            <GripVertical className="w-5 h-5 text-[#92adc9]" />
            <h3 className="font-bold text-white text-lg">{column.title}</h3>
            <span className="bg-[#1a2632] text-[#92adc9] text-xs font-bold px-2 py-0.5 rounded-full border border-white/5">
              {cardCount}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-80 flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-1">
          <button
            {...attributes}
            {...listeners}
            className="p-1 text-[#92adc9] hover:text-white hover:bg-white/5 rounded transition-colors cursor-grab active:cursor-grabbing"
            aria-label="Drag column"
          >
            <GripVertical className="w-5 h-5" />
          </button>
          
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={handleKeyDown}
              autoFocus
              className="bg-[#1a2632] border border-[#233648] focus:border-[#137fec] focus:ring-1 focus:ring-[#137fec] rounded px-2 py-1 text-white font-bold text-lg w-full outline-none"
            />
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="font-bold text-white text-lg hover:text-[#137fec] transition-colors text-left"
            >
              {column.title}
            </button>
          )}
          
          <span className="bg-[#1a2632] text-[#92adc9] text-xs font-bold px-2 py-0.5 rounded-full border border-white/5">
            {cardCount}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            className="text-[#92adc9] hover:text-white p-1 rounded hover:bg-white/5 transition-colors"
            aria-label="Add card"
          >
            <Plus className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
              className="text-[#92adc9] hover:text-white p-1 rounded hover:bg-white/5 transition-colors"
              aria-label="Column options"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            
            {showDeleteConfirm && (
              <div className="absolute right-0 top-full mt-1 bg-[#1a2632] border border-[#233648] rounded-lg shadow-lg p-3 z-50 min-w-[200px]">
                <p className="text-sm text-[#92adc9] mb-3">Delete this column?</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded text-sm font-medium transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-3 py-1.5 bg-white/5 text-[#92adc9] hover:bg-white/10 hover:text-white rounded text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar min-h-[100px]">
        {/* Cards will go here in future stories */}
      </div>
    </div>
  );
}
