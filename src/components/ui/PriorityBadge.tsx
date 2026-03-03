import type { Card } from '../../types';
import { Flag } from 'lucide-react';

interface PriorityBadgeProps {
  priority: Card['priority'];
  showLabel?: boolean;
}

const priorityConfig = {
  low: { color: 'text-text-secondary', label: 'Low' },
  medium: { color: 'text-warning', label: 'Medium' },
  high: { color: 'text-error', label: 'High' },
};

export function PriorityBadge({ priority, showLabel = true }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  
  return (
    <div className={`flex items-center gap-1 ${config.color} text-xs font-medium`}>
      <Flag className="w-3.5 h-3.5" />
      {showLabel && <span>{config.label}</span>}
    </div>
  );
}
