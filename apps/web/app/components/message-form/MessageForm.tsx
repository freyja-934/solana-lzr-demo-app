'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction } from '@solana/web3.js';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type FormValues = {
  message: string;
};

async function postMessage(message: string, author: string) {
  const response = await fetch('/api/solana/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, author }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to post message: ${error}`);
  }

  return response.text();
}

export const MessageForm =() => {
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const { connection } = useConnection();
  const [status, setStatus] = useState<string>('');

  const hasError = status === 'Failed to post message. Please try again.';

  const onSubmit = async (data: FormValues) => {
    if (!publicKey || !signTransaction) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setStatus('Signing transaction...');
      const serializedTx = await postMessage(
        data.message,
        publicKey.toBase58(),
      );
      console.log('Serialized transaction:', serializedTx);
      const transaction = Transaction.from(Buffer.from(serializedTx, 'base64'));

      transaction.feePayer = publicKey;
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;

      const sim = await connection.simulateTransaction(transaction);
      console.log('Sim logs:', sim.value.logs);
      console.log('Sim errors:', sim.value.err);
      setStatus('Sending transaction...');
      const signature = await sendTransaction(transaction, connection);
      console.log('Transaction sent:', signature);
      setStatus('Transaction sent successfully');
      setTimeout(() => {
        setStatus('Confirming transaction...');
      }, 1000);
      await connection.confirmTransaction({
        signature,
        ...(await connection.getLatestBlockhash()),
      }, 'finalized');
      setStatus('Message posted successfully!');
      setTimeout(() => {
        setStatus('');
      }, 2000);
      reset();
    } catch (error) {
      console.error('Error posting message:', error);
      setStatus('Failed to post message. Please try again.');
      setTimeout(() => {
        setStatus('');
      }, 3000);
    }
  };



  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <textarea
        {...register('message')}
        placeholder="Enter your message..."
        className="w-full p-2 border rounded bg-gray-800 text-white"
        rows={4}
        disabled={!publicKey || status !== ''}
      />
      <button
        type="submit"
        disabled={!publicKey || status !== ''}
        className="rounded-full px-4 py-2 font-medium bg-purple-950"
      >
        Post Message
      </button>
      <div className={`text-sm ${hasError ? 'text-red-500' : 'text-blue-500'} animate-pulse`}>{status}</div>
    </form>
  );
};
