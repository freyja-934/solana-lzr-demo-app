import { useWallet } from '@solana/wallet-adapter-react';
import { IconWallet } from '@tabler/icons-react';
import { WalletBalanceDisplay } from './WalletBalanceDisplay';
export const WalletInfo = () => {
  const { publicKey } = useWallet();
  return (
    <div>
      <div className="flex items-center  gap-2">
        
      <div className="flex items-center justify-center w-16 h-16 gap-2 bg-gray-800 p-2 rounded-full">
        <IconWallet className="w-8 h-8" />
      </div>
      <div>
        {publicKey && (
          <div className="flex flex-col gap-2">
            <div className="bg-yellow-500 text-white rounded-full px-2 py-1 w-fit text-xs">devnet</div>
            <span className="text-sm text-gray-500">
              {publicKey.toBase58().slice(0, 8)}...
              {publicKey.toBase58().slice(-8)}
            </span>
          </div>
        )}
        <WalletBalanceDisplay />
      </div>
      </div>

    </div>
  );
};
