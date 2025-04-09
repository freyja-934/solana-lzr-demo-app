'use client';

import { Card } from '@repo/ui';
import { PropsWithChildren } from 'react';

interface CardClientProps extends PropsWithChildren {
  width?: string;
  className?: string;
}

export function CardClient({ width, children, className }: CardClientProps) {
  return (
    <Card width={width} className={className}>
      {children}
    </Card>
  );
}
