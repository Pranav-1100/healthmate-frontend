import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Menu } from '@headlessui/react';

const NotificationsMenu = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      // TODO: Implement API call
      setNotifications([
        {
          id: 1,
          title: 'Time for medication',
          message: 'Don\'t forget to take your evening medication',
          type: 'medication_reminder',
          createdAt: new Date().toISOString(),
          isRead: false,
        },
        {
          id: 2,
          title: 'Health tip',
          message: 'Stay hydrated! Drink at least 8 glasses of water today.',
          type: 'health_tip',
          createdAt: new Date().toISOString(),
          isRead: true,
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    // TODO: Implement API call
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none">
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Menu.Button>

      <Menu.Items className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
          
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600" />
            </div>
          ) : notifications.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No notifications</p>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Menu.Item key={notification.id}>
                  {({ active }) => (
                    <button
                      className={`w-full text-left p-3 rounded-lg ${
                        active ? 'bg-gray-50' : ''
                      } ${!notification.isRead ? 'bg-blue-50' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {notification.message}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full" />
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </p>
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          )}
        </div>
      </Menu.Items>
    </Menu>
  );
};

export default NotificationsMenu;