import { Card } from '@repo/ui';
import { Suspense } from 'react';
import FaucetRequestCard from '../components/faucet/FaucetRequestCard';
import TokenInfo from '../components/faucet/TokenInfo';

function FaucetRequestCardFallback() {
  return (
    <Card width="500px" className="animate-pulse">
      <div className="h-[196px]"></div>
    </Card>
  );
}

export default function FaucetPage() {
  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <h1 className="text-3xl font-bold">Faucet</h1>

      <div className="flex flex-col items-center justify-center gap-8 w-full max-w-6xl">
        <TokenInfo />
        <Suspense fallback={<FaucetRequestCardFallback />}>
          <FaucetRequestCard />
        </Suspense>
      </div>
    </div>
  );
}
