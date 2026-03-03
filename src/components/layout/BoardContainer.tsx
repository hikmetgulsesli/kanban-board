import type { ReactNode } from 'react';

interface BoardContainerProps {
  children: ReactNode;
}

export function BoardContainer({ children }: BoardContainerProps) {
  return (
    <main className="flex-1 flex flex-col min-w-0 bg-background-dark relative kanban-grid-bg overflow-hidden">
      {children}
    </main>
  );
}
