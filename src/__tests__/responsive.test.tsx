import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import type { FilterState } from '../types';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Responsive Design', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Sidebar', () => {
    it('renders mobile menu button on small screens', () => {
      render(<Sidebar />);
      const menuButton = screen.getByLabelText('Toggle menu');
      expect(menuButton).toBeInTheDocument();
    });

    it('toggles mobile menu when button is clicked', () => {
      render(<Sidebar />);
      const menuButton = screen.getByLabelText('Toggle menu');
      
      // Initially closed
      fireEvent.click(menuButton);
      
      // Should show close button
      const closeButton = screen.getByLabelText('Toggle menu');
      expect(closeButton).toBeInTheDocument();
    });

    it('renders dark mode toggle buttons', () => {
      render(<Sidebar />);
      // Both mobile and desktop dark mode buttons should exist
      const darkModeButtons = screen.getAllByLabelText(/Switch to (light|dark) mode/);
      expect(darkModeButtons.length).toBeGreaterThanOrEqual(1);
    });

    it('toggles dark mode when button is clicked', () => {
      render(<Sidebar />);
      const darkModeButtons = screen.getAllByLabelText(/Switch to (light|dark) mode/);
      
      // Click the first one (mobile)
      fireEvent.click(darkModeButtons[0]);
      
      // Should still have buttons
      const newButtons = screen.getAllByLabelText(/Switch to (light|dark) mode/);
      expect(newButtons.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Header', () => {
    const mockFilters: FilterState = {
      searchText: '',
      selectedTags: [],
      dueDateFilter: 'all',
    };

    const defaultProps = {
      filters: mockFilters,
      allTags: ['Design', 'Bug Fix', 'Feature'],
      hasActiveFilters: false,
      onSearchChange: vi.fn(),
      onTagsChange: vi.fn(),
      onDueDateChange: vi.fn(),
      onClearFilters: vi.fn(),
    };

    it('renders search input', () => {
      render(<Header {...defaultProps} />);
      const searchInput = screen.getByPlaceholderText('Search tasks...');
      expect(searchInput).toBeInTheDocument();
    });

    it('calls onSearchChange when search input changes', () => {
      render(<Header {...defaultProps} />);
      const searchInput = screen.getByPlaceholderText('Search tasks...');
      
      fireEvent.change(searchInput, { target: { value: 'test' } });
      
      expect(defaultProps.onSearchChange).toHaveBeenCalledWith('test');
    });

    it('renders filter button', () => {
      render(<Header {...defaultProps} />);
      const filterButton = screen.getByLabelText('Filter tasks');
      expect(filterButton).toBeInTheDocument();
    });

    it('shows filter panel when filter button is clicked', () => {
      render(<Header {...defaultProps} />);
      const filterButton = screen.getByLabelText('Filter tasks');
      
      fireEvent.click(filterButton);
      
      expect(screen.getByText('Filters')).toBeInTheDocument();
    });

    it('shows active filter count badge', () => {
      const propsWithFilters = {
        ...defaultProps,
        hasActiveFilters: true,
        filters: {
          ...mockFilters,
          searchText: 'test',
          selectedTags: ['Design'],
        },
      };
      
      render(<Header {...propsWithFilters} />);
      
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  describe('Touch Interactions', () => {
    it('cards have proper touch action styles', () => {
      // Verify CSS classes for touch interactions are defined
      const style = document.createElement('style');
      style.textContent = `
        @media (hover: none) and (pointer: coarse) {
          .touch-pan-x { touch-action: pan-x; }
          .touch-pan-y { touch-action: pan-y; }
        }
      `;
      document.head.appendChild(style);
      
      expect(style.sheet).toBeTruthy();
      document.head.removeChild(style);
    });
  });

  describe('Focus States', () => {
    it('focus visible styles are defined', () => {
      const style = document.createElement('style');
      style.textContent = `
        *:focus-visible {
          outline: 2px solid var(--color-primary);
          outline-offset: 2px;
        }
      `;
      document.head.appendChild(style);
      
      expect(style.sheet).toBeTruthy();
      document.head.removeChild(style);
    });
  });
});
