'use client';

import { CustomTransaction, TransactionListResponse } from '@repo/types';
import { useEffect, useState } from 'react';
import { TransactionCard } from './TransactionCard';

const getTransactions = async () => {
  const response = await fetch('http://localhost:3000/api/transactions');
  const data: TransactionListResponse = await response.json();
  return data;
};

export const TransactionList = () => {
  const [transactions, setTransactions] = useState<CustomTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await getTransactions();
        setTransactions(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch transactions',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) return <div>Loading transactions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex gap-4 flex-wrap w-full">
      {transactions.map(({ hash, ...props }) => (
        <TransactionCard key={hash} hash={hash} {...props} />
      ))}
    </div>
  );
};
