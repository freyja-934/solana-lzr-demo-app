'use client';
import { NftsList } from '../components/wallet/NftsList';
import { WalletInfo } from '../components/wallet/WalletInfo';

export default function NFTsPage() {
  return (
    <div className="container mx-auto px-4 pt-[100px]">
      <div className="flex flex-col gap-8">
        <WalletInfo />
        <hr />
        <div className='w-fit mx-auto'>
          <div className="flex items-center justify-between gap-2 mb-2">
            <h2 className="text-xl font-bold  mb-2">My NFTs</h2>
            <div className="bg-blue-700 text-white rounded-full px-2 py-1">
              mainnet
            </div>
          </div>
          <NftsList />
        </div>
      </div>
    </div>
  );
}
