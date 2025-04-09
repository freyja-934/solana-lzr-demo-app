'use client';
import { Button, Card, Modal } from '@repo/ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { WalletButton } from '../wallet/WalletButton';
const lazer_tkn_address = 'FetsjyT1gddRKAuRHuEZq7mmLf2cNGpeMSSZPdSFtE6N';

const getAirdrop = async (wallet: string, amount: number, mint: string) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const response = await fetch(`${baseUrl}/api/solana/faucet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ wallet, amount, mint }),
  });
  const data = await response.json();
  return data.txId;
};

export default function FaucetRequestCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [txn, setTxn] = useState<string | null>(null);
  const [txnStatus, setTxnStatus] = useState<string | null>(null);
  const { publicKey, connected } = useWallet();

  const { register, handleSubmit, watch } = useForm({
    defaultValues: { amount: 1 },
  });
  const { connection } = useConnection();

  const amount = watch('amount');

  const onSubmit = async (data: any) => {
    if (amount <= 0) return;
    setIsLoading(true);
    const response = await getAirdrop(
      publicKey?.toBase58() || '',
      data.amount,
      lazer_tkn_address,
    );
    console.log(response);
    setTxn(response);
    
  };

  useEffect(() => {
    if (!txn) return;

    const checkTransaction = async () => {
      try {
        const latest = await connection.getLatestBlockhash();

        const result = await connection.confirmTransaction(
          {
            blockhash: latest.blockhash,
            lastValidBlockHeight: latest.lastValidBlockHeight,
            signature: txn,
          },
          'confirmed',
        );

        setTxnStatus(result.value?.err ? 'failed' : 'success');
        setIsOpen(true);
        setIsLoading(false);
      } catch (e) {
        console.error('Transaction confirmation error', e);
        setTxnStatus('failed');
      }
    };

    checkTransaction();
  }, [txn]);

  return (
    <Card width="500px">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-2">
          <h1 className="text-2xl font-bold">Request LAZR</h1>
          <div className="flex items-center border border-gray-600 rounded-full px-2 bg-orange-300 text-white w-fit">
            devnet
          </div>
        </div>
        <WalletButton />
        <div className="flex flex-col gap-2">
          <input
            step={1}
            className="rounded-md bg-gray-700 p-2"
            type="number"
            placeholder="Amount"
            disabled={!publicKey || !connected}
            {...register('amount')}
          />
        </div>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading || amount <= 0 || !publicKey || !connected}
        >
          {isLoading ? 'Requesting...' : 'Request'}
        </Button>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Airdrop Request"
        size="md"
      >
        <div className="flex flex-col gap-2">
        <p>Airdrop {amount} LAZR</p>
        <p className="text-sm">{publicKey?.toBase58()}</p>
        <p className={`text-xs text-white rounded-full p-2 flex items-center justify-center w-fit ${txnStatus === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {txnStatus === 'success' ? 'success' : 'failed'}
        </p>
        {txnStatus === 'success' && (
          <a
            href={`https://solscan.io/tx/${txn}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline text-sm"
          >
            View on Solscan
          </a>
        )}
        <button onClick={() => setIsOpen(false)}>Close</button>
        </div>
      </Modal>
    </Card>
  );
}
