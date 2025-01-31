'use client';

import { useState } from 'react';
import { Menu, MessageSquare, User, Settings, LogOut, LayoutDashboard } from 'lucide-react';
import NotificationsMenu from '@/components/shared/NotificationsMenu';
import ChatHistory from '@/components/chat/ChatHistory';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  const navLinks = [
    { href: '/', icon: MessageSquare, label: 'Chat' },
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
          <button 
  onClick={() => setSidebarOpen(!sidebarOpen)}
  className="p-2 hover:bg-blue-50 rounded-lg"
>
  <Menu className="w-6 h-6 text-blue-600" />
</button>
            <h1 className="text-xl font-semibold text-blue-600">HealthMate</h1>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-4 ml-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link 
  key={link.href}
  href={link.href}
  className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 ${
    pathname === link.href ? 'bg-blue-50' : ''
  }`}
>
  <Icon className="w-5 h-5 text-blue-600" />
  <span className="text-gray-900">{link.label}</span>
</Link>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
          <Link href="/profile" className="p-2 hover:bg-blue-50 rounded-lg">
  <User className="w-6 h-6 text-gray-900" />
</Link>
<NotificationsMenu />
<Link href="/settings" className="p-2 hover:bg-blue-50 rounded-lg">
  <Settings className="w-6 h-6 text-gray-900" />
</Link>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} z-40`}>
        <div className="flex flex-col h-full">
          <nav className="flex-1 px-4 py-4">
            <Link href="/" className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-gray-100 rounded-lg">
              <MessageSquare className="w-5 h-5" />
              <span>New Chat</span>
            </Link>
            <div className="mt-4">
              <h2 className="px-4 text-sm font-medium text-gray-500">Recent Chats</h2>
              <div className="mt-2">
                <ChatHistory onSelectChat={(chat) => {
                  setSidebarOpen(false);
                  // Implement chat selection logic
                }} />
              </div>
            </div>
          </nav>
          <div className="p-4 border-t border-gray-200">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`pt-16 transition-all duration-200 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;