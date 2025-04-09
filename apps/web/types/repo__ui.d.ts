declare module '@repo/ui' {
  import { ReactNode } from 'react';

  export interface ButtonProps {
    children: ReactNode;
    className?: string;
    variant?:
      | 'filled'
      | 'light'
      | 'outline'
      | 'subtle'
      | 'transparent'
      | 'white';
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
  }

  export const Button: React.FC<ButtonProps>;
  export const ClientButton: React.FC<ButtonProps>;
  export const cn: (...inputs: unknown[]) => string;
  export const Card: React.FC<{
    children: ReactNode;
    width?: string;
    className?: string;
  }>;
  export const Header: React.FC<{ children: ReactNode; className?: string }>;
  export const Skeleton: React.FC<{
    children?: ReactNode;
    className?: string;
    isLoading?: boolean;
  }>;
}
