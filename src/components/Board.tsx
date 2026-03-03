import { useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { PlusCircle } from 'lucide-react';
import { Column } from './Column';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Column as ColumnType } from '../types';

const INITIAL_COLUMNS: ColumnType[] = [
  { id: 'col-1', title: 'To Do', order: 0 },
  { id: 'col-2', title: 'In Progress', order: 1 },
  { id: 'col-3', title: 'Done', order: 2 },
];

export function Board() {
  const [columns, setColumns] = useLocalStorage<ColumnType[]>('kanban-columns', INITIAL_COLUMNS);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [isAddingColumn, setIsAddingColumn] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setColumns((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        
        const reordered = arrayMove(items, oldIndex, newIndex);
        
        // Update order property
        return reordered.map((col, index) => ({
          ...col,
          order: index,
        }));
      });
    }
  }, [setColumns]);

  const handleAddColumn = useCallback(() => {
    const trimmed = newColumnTitle.trim();
    if (!trimmed) return;

    const newColumn: ColumnType = {
      id: `col-${Date.now()}`,
      title: trimmed,
      order: columns.length,
    };

    setColumns([...columns, newColumn]);
    setNewColumnTitle('');
    setIsAddingColumn(false);
  }, [newColumnTitle, columns, setColumns]);

  const handleUpdateColumnTitle = useCallback((id: string, title: string) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === id ? { ...col, title } : col))
    );
  }, [setColumns]);

  const handleDeleteColumn = useCallback((id: string) => {
    setColumns((prev) => {
      const filtered = prev.filter((col) => col.id !== id);
      // Reorder remaining columns
      return filtered.map((col, index) => ({
        ...col,
        order: index,
      }));
    });
  }, [setColumns]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddColumn();
    } else if (e.key === 'Escape') {
      setIsAddingColumn(false);
      setNewColumnTitle('');
    }
  };

  // Sort columns by order
  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full flex px-6 py-6 gap-6 min-w-max">
        <SortableContext
          items={sortedColumns.map((col) => col.id)}
          strategy={horizontalListSortingStrategy}
        >
          {sortedColumns.map((column) => (
            <Column
              key={column.id}
              column={column}
              onUpdateTitle={handleUpdateColumnTitle}
              onDelete={handleDeleteColumn}
              cardCount={0}
            />
          ))}
        </SortableContext>

        <div className="w-80 flex flex-col h-full pt-[52px]">
          {isAddingColumn ? (
            <div className="bg-[#1a2632] border border-[#233648] rounded-xl p-4">
              <input
                type="text"
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                  if (!newColumnTitle.trim()) {
                    setIsAddingColumn(false);
                  }
                }}
                placeholder="Enter column title..."
                autoFocus
                className="w-full bg-[#101922] border border-[#233648] focus:border-[#137fec] focus:ring-1 focus:ring-[#137fec] rounded-lg px-3 py-2 text-white placeholder-[#92adc9] outline-none mb-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddColumn}
                  disabled={!newColumnTitle.trim()}
                  className="flex-1 px-4 py-2 bg-[#137fec] hover:bg-[#0d6fd4] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Add Column
                </button>
                <button
                  onClick={() => {
                    setIsAddingColumn(false);
                    setNewColumnTitle('');
                  }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-[#92adc9] hover:text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingColumn(true)}
              className="w-full py-3 border-2 border-dashed border-[#233648] rounded-xl text-[#92adc9] hover:text-white hover:border-[#137fec] hover:bg-[#137fec]/5 transition-all flex items-center justify-center gap-2 group"
            >
              <PlusCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Add New Column</span>
            </button>
          )}
        </div>
      </div>
    </DndContext>
  );
}
