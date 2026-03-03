// Types for Kanban Board

export interface Card {
  id: string;
  title: string;
  description: string;
  columnId: string;
  tags: Tag[];
  dueDate?: string;
  assignees: string[];
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color: TagColor;
}

export type TagColor = 
  | 'blue' 
  | 'orange' 
  | 'purple' 
  | 'emerald' 
  | 'red' 
  | 'yellow' 
  | 'cyan';

export interface Column {
  id: string;
  title: string;
  order: number;
}

export interface BoardState {
  columns: Column[];
  cards: Card[];
  tags: Tag[];
}

export interface FilterState {
  searchQuery: string;
  selectedTags: string[];
  priorityFilter: ('low' | 'medium' | 'high')[];
  dueDateFilter: 'all' | 'overdue' | 'today' | 'week';
}

export type Theme = 'dark';
