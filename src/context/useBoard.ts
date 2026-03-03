/**
 * useBoard Hook
 * 
 * Separate file for the useBoard hook to satisfy fast refresh requirements
 */

import { useContext } from 'react';
import { BoardContext } from './BoardContext.js';
import type { BoardContextValue } from './BoardContextValue.js';

export function useBoard(): BoardContextValue {
  const context = useContext(BoardContext);
  if (!context) {
    throw new Error('useBoard must be used within a BoardProvider');
  }
  return context;
}
