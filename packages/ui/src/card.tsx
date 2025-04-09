'use-client';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  width?: string;
  className?: string;
}

export function Card({ children, width, className }: CardProps) {
  return (
    <div
      className={`bg-gray-800 rounded-lg p-4 ${className || ''}`}
      style={{ width }}
    >
      {children}
    </div>
  );
}
