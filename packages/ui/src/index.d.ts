declare module '@repo/ui' {
  import { ButtonHTMLAttributes, ReactNode } from 'react';

  export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    className?: string;
    appName?: string;
    variant?:
      | 'filled'
      | 'light'
      | 'outline'
      | 'subtle'
      | 'transparent'
      | 'white';
    type?: 'button' | 'submit' | 'reset';
  }

  export const Button: React.FC<ButtonProps>;
  export const ClientButton: React.FC<ButtonProps>;
  export const cn: (...inputs: any[]) => string;

  // Add other component exports as needed
  export const Card: React.FC<any>;
}
