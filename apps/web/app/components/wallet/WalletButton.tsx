'use client';

import { Button } from '@repo/ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useEffect, useRef, useState } from 'react';

export function WalletButton() {
  const { publicKey, connected, connect, disconnect, wallet } = useWallet();
  const { setVisible } = useWalletModal();
  const [copied, setCopied] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleConnectClick = async () => {
    console.log(publicKey, connected);
    if (!publicKey || !connected) {
      setVisible(true);
    } else if (!connected) {
      await connect();
    } else {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }


    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const base58 = publicKey?.toBase58();
  const displayAddress = base58
    ? `${base58.slice(0, 4)}..${base58.slice(-4)}`
    : '';

  return (
    <div className="relative inline-block" ref={menuRef}>
      <Button
        className="px-4 py-2 rounded bg-black text-white"
        onClick={handleConnectClick}
      >
        {connected ? displayAddress : 'Connect Wallet'}
      </Button>
      {connected && isMenuOpen && (
        <div className="absolute z-10 mt-2 w-48 bg-white border rounded shadow">
          <button
            className="w-full px-4 py-2 hover:bg-gray-100 text-left"
            onClick={async () => {
              if (base58) {
                await navigator.clipboard.writeText(base58);
                setCopied(true);
                setTimeout(() => setCopied(false), 1000);
              }
            }}
          >
            {copied ? 'Copied!' : 'Copy Address'}
          </button>
          <button
            className="w-full px-4 py-2 hover:bg-gray-100 text-left"
            onClick={() => {
              setVisible(true);
              setIsMenuOpen(false);
            }}
          >
            Change Wallet
          </button>
          <button
            className="w-full px-4 py-2 hover:bg-gray-100 text-left"
            onClick={() => {
              disconnect();
              setIsMenuOpen(false);
            }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
