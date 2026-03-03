import type { TagColor } from '../../types';

interface TagBadgeProps {
  name: string;
  color: TagColor;
  onClick?: () => void;
  removable?: boolean;
  onRemove?: () => void;
}

const colorClasses: Record<TagColor, { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  orange: { bg: 'bg-orange-500/10', text: 'text-orange-400' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  red: { bg: 'bg-red-500/10', text: 'text-red-400' },
  yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
};

export function TagBadge({ name, color, onClick, removable, onRemove }: TagBadgeProps) {
  const colors = colorClasses[color];
  
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium
        ${colors.bg} ${colors.text}
        ${onClick ? 'cursor-pointer hover:opacity-80' : ''}
        transition-opacity duration-150
      `}
      onClick={onClick}
    >
      {name}
      {removable && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 hover:opacity-70 focus:outline-none"
          aria-label={`Remove ${name} tag`}
        >
          ×
        </button>
      )}
    </span>
  );
}
