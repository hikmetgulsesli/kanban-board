import type { Card, FilterState } from '../types';

export function filterCards(cards: Card[], filters: FilterState): Card[] {
  return cards.filter(card => {
    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesTitle = card.title.toLowerCase().includes(query);
      const matchesDescription = card.description.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDescription) {
        return false;
      }
    }

    // Tag filter
    if (filters.selectedTags.length > 0) {
      const cardTagIds = card.tags.map(tag => tag.id);
      const hasMatchingTag = filters.selectedTags.some(tagId => 
        cardTagIds.includes(tagId)
      );
      if (!hasMatchingTag) {
        return false;
      }
    }

    // Priority filter
    if (filters.priorityFilter.length > 0) {
      if (!filters.priorityFilter.includes(card.priority)) {
        return false;
      }
    }

    // Due date filter
    if (filters.dueDateFilter !== 'all' && card.dueDate) {
      const cardDate = new Date(card.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const cardDateOnly = new Date(cardDate);
      cardDateOnly.setHours(0, 0, 0, 0);

      switch (filters.dueDateFilter) {
        case 'overdue':
          if (cardDateOnly >= today) return false;
          break;
        case 'today':
          if (cardDateOnly.getTime() !== today.getTime()) return false;
          break;
        case 'week': {
          const weekFromNow = new Date(today);
          weekFromNow.setDate(weekFromNow.getDate() + 7);
          if (cardDateOnly < today || cardDateOnly > weekFromNow) return false;
          break;
        }
      }
    }

    return true;
  });
}
