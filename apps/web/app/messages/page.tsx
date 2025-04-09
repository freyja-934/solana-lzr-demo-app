'use client';

import { MessageForm } from '../components/message-form/MessageForm';
import { MessageList } from '../components/message-list/MessageList';

export default function MessagesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Messages</h1>
      <div className="space-y-8">
        <MessageForm />
        <MessageList />
      </div>
    </div>
  );
}
