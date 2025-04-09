import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...args: Parameters<typeof clsx>) => twMerge(clsx(...args));

// Add default export to fix import issues
export default cn;
