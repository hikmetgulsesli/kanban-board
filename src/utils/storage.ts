import type { BoardState, Column, Card, Tag } from '../types';

const STORAGE_KEY = 'kanban-board-data';

export const defaultTags: Tag[] = [
  { id: 'tag-1', name: 'Design System', color: 'blue' },
  { id: 'tag-2', name: 'Bug Fix', color: 'orange' },
  { id: 'tag-3', name: 'Research', color: 'purple' },
  { id: 'tag-4', name: 'Frontend', color: 'emerald' },
  { id: 'tag-5', name: 'Backend', color: 'red' },
  { id: 'tag-6', name: 'Content', color: 'yellow' },
];

export const defaultColumns: Column[] = [
  { id: 'col-1', title: 'To Do', order: 0 },
  { id: 'col-2', title: 'In Progress', order: 1 },
  { id: 'col-3', title: 'Done', order: 2 },
];

export const defaultCards: Card[] = [
  {
    id: 'card-1',
    title: 'Update color palette tokens',
    description: 'Review current design tokens and propose changes for dark mode contrast ratios.',
    columnId: 'col-1',
    tags: [{ id: 'tag-1', name: 'Design System', color: 'blue' }],
    dueDate: '2024-09-12',
    assignees: ['JS'],
    priority: 'medium',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'card-2',
    title: 'Login timeout issue',
    description: 'Users are being logged out unexpectedly after 5 minutes of inactivity.',
    columnId: 'col-1',
    tags: [{ id: 'tag-2', name: 'Bug Fix', color: 'orange' }],
    assignees: ['MK'],
    priority: 'high',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'card-3',
    title: 'Competitor Analysis Q3',
    description: 'Analyze feature sets of top 3 competitors for the upcoming quarterly review.',
    columnId: 'col-1',
    tags: [{ id: 'tag-3', name: 'Research', color: 'purple' }],
    assignees: [],
    priority: 'low',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'card-4',
    title: 'Implement Dark Mode Toggle',
    description: 'Create the switch component and hook it up to the theme context provider.',
    columnId: 'col-2',
    tags: [{ id: 'tag-4', name: 'Frontend', color: 'emerald' }],
    assignees: ['AS', 'TM'],
    priority: 'medium',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'card-5',
    title: 'Q3 Newsletter Draft',
    description: 'Write copy for the upcoming product release email blast.',
    columnId: 'col-2',
    tags: [{ id: 'tag-6', name: 'Content', color: 'yellow' }],
    assignees: ['LJ'],
    priority: 'low',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'card-6',
    title: 'API Endpoint Optimization',
    description: 'Refactor the user data endpoint to reduce latency by 20%.',
    columnId: 'col-3',
    tags: [{ id: 'tag-5', name: 'Backend', color: 'red' }],
    assignees: ['JS'],
    priority: 'high',
    completed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'card-7',
    title: 'Homepage Hero Assets',
    description: 'Create hero images and graphics for the new homepage design.',
    columnId: 'col-3',
    tags: [{ id: 'tag-1', name: 'Design System', color: 'blue' }],
    assignees: [],
    priority: 'medium',
    completed: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function getInitialState(): BoardState {
  if (typeof window === 'undefined') {
    return {
      columns: defaultColumns,
      cards: defaultCards,
      tags: defaultTags,
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }

  return {
    columns: defaultColumns,
    cards: defaultCards,
    tags: defaultTags,
  };
}

export function saveState(state: BoardState): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
