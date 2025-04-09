'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSocket } from '../../hooks/useSocket';

type Message = {
  author: string;
  message: string;
  timestamp: number;
  index: number;
};

async function fetchMessages(): Promise<Message[]> {
  const response = await fetch('/api/solana/messages');
  if (!response.ok) throw new Error('Failed to fetch messages');
  return response.json();
}

export const MessageList = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages()
      .then(messages => {
        setMessages(
          messages
            .filter(msg => !!msg.message)
            .sort((a, b) => b.timestamp - a.timestamp),
        );
      })
      .catch(() => setError('Failed to load messages. Please try again later.'))
      .finally(() => setLoading(false));
  }, []);

  const handleNewMessage = useCallback((data: Message) => {
    setMessages(prev =>
      [...prev, data].sort((a, b) => b.timestamp - a.timestamp),
    );
  }, []);

  useSocket('message-posted', handleNewMessage);

  if (loading)
    return <div className="text-center py-4">Loading messages...</div>;
  if (error)
    return <div className="text-red-500 text-center py-4">{error}</div>;
  if (messages.length === 0)
    return <div className="text-center py-4">No messages found.</div>;

  return (
    <div className="space-y-4">
      {messages.map((msg, i) => (
        <div key={i + msg.timestamp} className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="font-mono text-sm text-gray-300">
              {msg.author.slice(0, 4)}...{msg.author.slice(-4)}
            </div>
            <div className="text-sm text-gray-300 italic">
              {new Date(msg.timestamp).toLocaleString()}
            </div>
          </div>
          <p className="text-gray-200">{msg.message}</p>
        </div>
      ))}
    </div>
  );
};
