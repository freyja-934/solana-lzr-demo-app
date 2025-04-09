'use client';

import { QueryProvider } from './QueryProvider';
import { ThemeProvider } from './ThemeProvider';
import { WalletProvider } from './WalletProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <WalletProvider>{children}</WalletProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
