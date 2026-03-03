import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CardComponent } from './Card.js';
import type { Card } from '../types/index.js';

describe('CardComponent', () => {
  const mockCard: Card = {
    id: 'card-1',
    title: 'Test Card',
    description: 'Test Description',
    columnId: 'col-1',
    tags: ['Frontend', 'Bug Fix'],
    color: 'blue',
    dueDate: '2026-03-15T00:00:00.000Z',
    createdAt: '2026-03-01T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z',
  };

  it('should render card title', () => {
    render(<CardComponent card={mockCard} />);
    expect(screen.getByText('Test Card')).toBeInTheDocument();
  });

  it('should render card description', () => {
    render(<CardComponent card={mockCard} />);
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should render first tag', () => {
    render(<CardComponent card={mockCard} />);
    expect(screen.getByText('Frontend')).toBeInTheDocument();
  });

  it('should render due date', () => {
    render(<CardComponent card={mockCard} />);
    expect(screen.getByText('Mar 15')).toBeInTheDocument();
  });

  it('should show color indicator', () => {
    const { container } = render(<CardComponent card={mockCard} />);
    const colorIndicator = container.querySelector('.bg-blue-500');
    expect(colorIndicator).toBeInTheDocument();
  });

  it('should call onClick when card is clicked', () => {
    const onClick = vi.fn();
    render(<CardComponent card={mockCard} onClick={onClick} />);
    
    fireEvent.click(screen.getByText('Test Card'));
    expect(onClick).toHaveBeenCalled();
  });

  it('should call onEdit when edit button is clicked', () => {
    const onEdit = vi.fn();
    render(<CardComponent card={mockCard} onEdit={onEdit} />);
    
    const moreButton = screen.getByRole('button');
    fireEvent.click(moreButton);
    expect(onEdit).toHaveBeenCalled();
  });

  it('should show completed state for done cards', () => {
    render(<CardComponent card={mockCard} isDone={true} />);
    
    const title = screen.getByText('Test Card');
    expect(title).toHaveClass('line-through');
  });

  it('should show overdue styling for past due dates', () => {
    const overdueCard = {
      ...mockCard,
      dueDate: '2020-01-01T00:00:00.000Z',
    };
    
    render(<CardComponent card={overdueCard} />);
    
    const dateElement = screen.getByText('Jan 1');
    expect(dateElement.parentElement).toHaveClass('text-error');
  });
});
