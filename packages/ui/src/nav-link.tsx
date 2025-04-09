'use client';

import type { ReactNode } from 'react';
import cn from './utils/cn';

type NavLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  active?: boolean;
};

export function NavLink({ children, className, active, href }: NavLinkProps) {
  const linkClassName = cn(className, active && 'text-primary font-semibold');

  return (
    <a href={href} className={linkClassName}>
      {children}
    </a>
  );
}
