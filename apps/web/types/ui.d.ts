// This file extends the UI package types to properly handle async server components
import { ReactNode } from 'react';

declare module '@repo/ui' {
  export interface CardProps {
    width?: string;
    children: ReactNode;
    className?: string;
  }

  export const Card: React.FC<CardProps>;
}
