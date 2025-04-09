'use client';
import { Header } from '@repo/ui';
import Image from 'next/image';
import { WalletButton } from '../wallet/WalletButton';
import { Links } from './Links';

interface HeaderProps {
  className?: string;
}

export const AppHeader = ({ className = '' }: HeaderProps) => {
  return (
    <Header>
      <Image src="/lzr-token.png" alt="logo" width={32} height={32} />
      <Links />
      <WalletButton />
    </Header>
  );
};
