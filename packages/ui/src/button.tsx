import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from './utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  appName?: string;
  variant?: 'filled' | 'light' | 'outline' | 'subtle' | 'transparent' | 'white';
  type?: 'button' | 'submit' | 'reset';
}

export const Button = ({
  children,
  className,
  variant = 'filled',
  type = 'button',
  ...props
}: ButtonProps): JSX.Element => {
  const classNames = cn(
    className,
    'rounded-full px-4 py-2 font-medium',
    variant === 'filled' && 'bg-black dark:bg-dark-primary text-white',
    variant === 'light' &&
      'bg-white dark:bg-dark-surface text-black dark:text-dark-text',
    variant === 'outline' &&
      'border border-black dark:border-dark-primary text-black dark:text-dark-text',
    variant === 'subtle' &&
      'bg-gray-100 dark:bg-dark-surface text-black dark:text-dark-text',
    variant === 'transparent' &&
      'bg-transparent text-black dark:text-dark-text',
    variant === 'white' &&
      'bg-white dark:bg-dark-surface text-black dark:text-dark-text',
    props.disabled && 'opacity-50 cursor-not-allowed',
  );
  return (
    <button className={classNames} type={type} {...props}>
      {children}
    </button>
  );
};
