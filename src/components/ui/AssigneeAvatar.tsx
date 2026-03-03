interface AssigneeAvatarProps {
  initials: string;
  color?: string;
  size?: 'sm' | 'md';
  title?: string;
  grayscale?: boolean;
}

const colorClasses = [
  'bg-purple-500',
  'bg-blue-500',
  'bg-emerald-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-cyan-500',
  'bg-rose-500',
];

export function AssigneeAvatar({ 
  initials, 
  color, 
  size = 'md', 
  title,
  grayscale = false 
}: AssigneeAvatarProps) {
  const sizeClasses = size === 'sm' 
    ? 'h-6 w-6 text-[9px] ring-2' 
    : 'h-8 w-8 text-xs ring-2';
  
  const bgColor = color || colorClasses[initials.charCodeAt(0) % colorClasses.length];
  
  return (
    <div
      className={`
        ${sizeClasses} ${bgColor} 
        rounded-full flex items-center justify-center 
        font-bold text-white ring-card-dark
        ${grayscale ? 'grayscale opacity-60' : ''}
        transition-all duration-200
      `}
      title={title || initials}
    >
      {initials}
    </div>
  );
}

interface AssigneeGroupProps {
  assignees: string[];
  maxDisplay?: number;
}

export function AssigneeGroup({ assignees, maxDisplay = 3 }: AssigneeGroupProps) {
  if (assignees.length === 0) return null;
  
  const displayAssignees = assignees.slice(0, maxDisplay);
  const remaining = assignees.length - maxDisplay;
  
  return (
    <div className="flex -space-x-1.5">
      {displayAssignees.map((initials, index) => (
        <AssigneeAvatar
          key={index}
          initials={initials}
          size="sm"
        />
      ))}
      {remaining > 0 && (
        <div className="h-6 w-6 rounded-full bg-card-dark ring-2 ring-card-dark flex items-center justify-center text-[9px] text-text-secondary">
          +{remaining}
        </div>
      )}
    </div>
  );
}
