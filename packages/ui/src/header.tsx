import { ReactNode } from 'react';
import { cn } from './utils';

interface HeaderProps {
  children: ReactNode;
  className?: string;
}

export const Header = ({ children, className }: HeaderProps) => {
  return (
    <header
      className={cn(
        'flex items-center justify-between p-4 bg-gray-800',
        className,
      )}
    >
      {children}
    </header>
  );
};
