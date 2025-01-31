'use client';

import AppLayout from '../components/layout/AppLayout';
import ChatInterface from '../components/chat/ChatInterface';

export default function Home() {
  return (
    <AppLayout>
      <ChatInterface />
    </AppLayout>
  );
}