// Kanban Board Types

export interface Tag {
  id: string;
  name: string;
  color: 'blue' | 'orange' | 'purple' | 'emerald' | 'red' | 'yellow';
}

export interface Card {
  id: string;
  title: string;
  description: string;
  tags: Tag[];
  dueDate: string | null;
  columnId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: string;
  title: string;
  order: number;
  cards: Card[];
}

export interface Board {
  id: string;
  title: string;
  columns: Column[];
}

export type DueDateFilter = 'all' | 'overdue' | 'today' | 'this-week';

export interface FilterState {
  searchText: string;
  selectedTags: string[];
  dueDateFilter: DueDateFilter;
}
