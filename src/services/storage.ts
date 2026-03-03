/**
 * LocalStorage Service for Kanban Board
 * 
 * Story US-002: Data Layer & TypeScript Types
 * Provides persistent storage using localStorage with error handling
 */

import type { BoardData, BoardFilters } from '../types/index.js';

type StorageKey = 'kanban-board-data' | 'kanban-board-filters' | 'kanban-board-settings';

/**
 * Custom error class for storage operations
 */
export class StorageError extends Error {
  key: string;
  operation: 'read' | 'write' | 'delete';
  
  constructor(
    message: string,
    key: string,
    operation: 'read' | 'write' | 'delete'
  ) {
    super(message);
    this.name = 'StorageError';
    this.key = key;
    this.operation = operation;
  }
}

/**
 * Check if localStorage is available in the current environment
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Save data to localStorage with error handling
 */
export function saveToStorage<T>(key: StorageKey, data: T): void {
  if (!isStorageAvailable()) {
    throw new StorageError('localStorage is not available', key, 'write');
  }

  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new StorageError(`Failed to save data: ${message}`, key, 'write');
  }
}

/**
 * Load data from localStorage with error handling
 */
export function loadFromStorage<T>(key: StorageKey, defaultValue: T): T {
  if (!isStorageAvailable()) {
    return defaultValue;
  }

  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) {
      return defaultValue;
    }
    return JSON.parse(serialized) as T;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.warn(`Failed to load data from ${key}: ${message}`);
    return defaultValue;
  }
}

/**
 * Remove data from localStorage
 */
export function removeFromStorage(key: StorageKey): void {
  if (!isStorageAvailable()) {
    throw new StorageError('localStorage is not available', key, 'delete');
  }

  try {
    localStorage.removeItem(key);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new StorageError(`Failed to remove data: ${message}`, key, 'delete');
  }
}

/**
 * Clear all kanban board data from localStorage
 */
export function clearAllBoardData(): void {
  if (!isStorageAvailable()) {
    return;
  }

  const keys: StorageKey[] = [
    'kanban-board-data',
    'kanban-board-filters',
    'kanban-board-settings',
  ];

  keys.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore errors during cleanup
    }
  });
}

/**
 * Save board data to localStorage
 */
export function saveBoardData(data: BoardData): void {
  saveToStorage('kanban-board-data', data);
}

/**
 * Load board data from localStorage
 */
export function loadBoardData(): BoardData | null {
  return loadFromStorage<BoardData | null>('kanban-board-data', null);
}

/**
 * Save board filters to localStorage
 */
export function saveBoardFilters(filters: BoardFilters): void {
  saveToStorage('kanban-board-filters', filters);
}

/**
 * Load board filters from localStorage
 */
export function loadBoardFilters(): BoardFilters | null {
  return loadFromStorage<BoardFilters | null>('kanban-board-filters', null);
}

/**
 * Get storage size information for debugging
 */
export function getStorageInfo(): { used: number; remaining: number; total: number } {
  if (!isStorageAvailable()) {
    return { used: 0, remaining: 0, total: 0 };
  }

  let used = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const value = localStorage.getItem(key) || '';
      used += key.length + value.length;
    }
  }

  // Approximate localStorage limit (varies by browser, typically 5-10MB)
  const total = 5 * 1024 * 1024; // 5MB
  const remaining = Math.max(0, total - used);

  return { used, remaining, total };
}
