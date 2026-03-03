import { useState, useCallback, useRef } from 'react';

interface DragState {
  isDragging: boolean;
  draggedItemId: string | null;
  draggedType: 'card' | 'column' | null;
  sourceColumnId: string | null;
}

interface DropTarget {
  id: string;
  type: 'card' | 'column';
  columnId?: string;
}

export function useDragAndDrop(
  onCardMove: (cardId: string, targetColumnId: string, targetIndex?: number) => void,
  onColumnReorder?: (columnId: string, targetIndex: number) => void
) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedItemId: null,
    draggedType: null,
    sourceColumnId: null,
  });

  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);
  const dragImageRef = useRef<HTMLDivElement | null>(null);

  const handleDragStart = useCallback((
    e: React.DragEvent,
    id: string,
    type: 'card' | 'column',
    columnId?: string
  ) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', JSON.stringify({ id, type, columnId }));
    
    // Set custom drag image for better UX
    if (dragImageRef.current) {
      e.dataTransfer.setDragImage(dragImageRef.current, 0, 0);
    }

    setDragState({
      isDragging: true,
      draggedItemId: id,
      draggedType: type,
      sourceColumnId: columnId || null,
    });

    // Add a small delay to show the drag state
    setTimeout(() => {
      const element = e.target as HTMLElement;
      element.classList.add('dragging');
    }, 0);
  }, []);

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    const element = e.target as HTMLElement;
    element.classList.remove('dragging');
    
    setDragState({
      isDragging: false,
      draggedItemId: null,
      draggedType: null,
      sourceColumnId: null,
    });
    setDropTarget(null);
  }, []);

  const handleDragOver = useCallback((
    e: React.DragEvent,
    id: string,
    type: 'card' | 'column',
    columnId?: string
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    setDropTarget({ id, type, columnId });
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDropTarget(null);
  }, []);

  const handleDrop = useCallback((
    e: React.DragEvent,
    targetId: string,
    targetType: 'card' | 'column',
    targetColumnId?: string
  ) => {
    e.preventDefault();
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const { id: sourceId, type: sourceType, columnId: sourceColumnId } = data;

      if (sourceType === 'card' && targetType === 'column') {
        // Dropping card onto column
        onCardMove(sourceId, targetId);
      } else if (sourceType === 'card' && targetType === 'card') {
        // Dropping card onto another card - move to same column
        const finalColumnId = targetColumnId || sourceColumnId;
        if (finalColumnId) {
          onCardMove(sourceId, finalColumnId);
        }
      } else if (sourceType === 'column' && targetType === 'column' && onColumnReorder) {
        // Reordering columns
        const columns = Array.from(document.querySelectorAll('[data-column-id]'));
        const targetIndex = columns.findIndex(col => col.getAttribute('data-column-id') === targetId);
        if (targetIndex !== -1) {
          onColumnReorder(sourceId, targetIndex);
        }
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }

    setDropTarget(null);
  }, [onCardMove, onColumnReorder]);

  const isDraggingOver = useCallback((id: string) => {
    return dropTarget?.id === id;
  }, [dropTarget]);

  return {
    dragState,
    dropTarget,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    isDraggingOver,
    dragImageRef,
  };
}
