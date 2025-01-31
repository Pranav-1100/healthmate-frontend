import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  MessageSquare, 
  ActivitySquare, 
  User, 
  Settings, 
  LogOut, 
  Calendar,
  PieChart,
  Bell
} from 'lucide-react';

const SidebarLink = ({ href, icon: Icon, children, isActive }) => (
  <Link 
    href={href}
    className={`flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-colors ${
      isActive 
        ? 'bg-blue-50 text-blue-600' 
        : 'text-gray-900 hover:bg-blue-50'
    }`}
  >
    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-blue-600'}`} />
    <span>{children}</span>
  </Link>
);


const Sidebar = ({ isOpen }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Clear token and user data
      localStorage.removeItem('token');
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  <Link href="/" className="flex items-center gap-3 w-full px-4 py-2 text-left bg-blue-50 hover:bg-blue-100 rounded-lg">
  <MessageSquare className="w-5 h-5 text-blue-600" />
  <span className="text-gray-900">New Chat</span>
</Link>

  const navItems = [
    { href: '/', icon: MessageSquare, label: 'Chat' },
    { href: '/dashboard', icon: PieChart, label: 'Dashboard' },
    { href: '/appointments', icon: Calendar, label: 'Appointments' },
    { href: '/health', icon: ActivitySquare, label: 'Health Tracking' },
    { href: '/profile', icon: User, label: 'Profile' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ].map(item => ({
    ...item,
    className: "text-gray-900" // Add this to make text black
  }));

  return (
    <div className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 z-30 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="flex flex-col h-full">
        <div className="p-4">
          <div className="flex items-center gap-2 px-4">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold">H</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">HealthMate</span>
          </div>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <SidebarLink
              key={item.href}
              href={item.href}
              icon={item.icon}
              isActive={pathname === item.href}
            >
              {item.label}
            </SidebarLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;