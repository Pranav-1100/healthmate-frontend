'use client';

import { useState, useEffect } from 'react';
import { notificationAPI } from '@/lib/api';
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Loader2,
  AlertCircle,
  Calendar,
  Pill,
  FileText,
  Activity,
  X
} from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  useEffect(() => {
    fetchNotifications();
    fetchStats();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationAPI.getAll();
      setNotifications(response.notifications || response || []);
    } catch (err) {
      setError('Failed to load notifications');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await notificationAPI.getStats();
      setStats(response);
    } catch (err) {
      console.error('Stats error:', err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setSuccess('Notification marked as read');
      fetchNotifications();
      fetchStats();
    } catch (err) {
      setError('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setSuccess('All notifications marked as read');
      fetchNotifications();
      fetchStats();
    } catch (err) {
      setError('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;

    try {
      await notificationAPI.delete(id);
      setSuccess('Notification deleted');
      fetchNotifications();
      fetchStats();
    } catch (err) {
      setError('Failed to delete notification');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment':
      case 'APPOINTMENT_REMINDER':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'medication':
      case 'MEDICATION_REMINDER':
        return <Pill className="w-5 h-5 text-green-600" />;
      case 'prescription':
      case 'PRESCRIPTION':
        return <FileText className="w-5 h-5 text-purple-600" />;
      case 'health':
      case 'HEALTH_ALERT':
        return <Activity className="w-5 h-5 text-red-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationTypeBadge = (type) => {
    const badges = {
      appointment: 'bg-blue-100 text-blue-800',
      APPOINTMENT_REMINDER: 'bg-blue-100 text-blue-800',
      medication: 'bg-green-100 text-green-800',
      MEDICATION_REMINDER: 'bg-green-100 text-green-800',
      prescription: 'bg-purple-100 text-purple-800',
      PRESCRIPTION: 'bg-purple-100 text-purple-800',
      health: 'bg-red-100 text-red-800',
      HEALTH_ALERT: 'bg-red-100 text-red-800',
      system: 'bg-gray-100 text-gray-800',
      SYSTEM: 'bg-gray-100 text-gray-800'
    };
    return badges[type] || badges.system;
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.isRead && !notif.read;
    if (filter === 'read') return notif.isRead || notif.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead && !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="w-8 h-8 text-blue-600" />
              Notifications
            </h1>
            <p className="text-gray-600 mt-2">Stay updated with your health reminders</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <CheckCheck className="w-5 h-5" />
              Mark All as Read
            </button>
          )}
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Notifications</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total || 0}</p>
                </div>
                <Bell className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Unread</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.unread || unreadCount}</p>
                </div>
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-bold text-sm">{stats.unread || unreadCount}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
            <button onClick={() => setError('')} className="ml-auto">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            {success}
            <button onClick={() => setSuccess('')} className="ml-auto">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-2 mb-6 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'unread' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'read' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Read ({notifications.length - unreadCount})
          </button>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 ${
                  !notification.isRead && !notification.read ? 'border-l-4 border-blue-600' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg flex-shrink-0 ${
                    !notification.isRead && !notification.read ? 'bg-blue-50' : 'bg-gray-50'
                  }`}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold ${
                            !notification.isRead && !notification.read ? 'text-gray-900' : 'text-gray-600'
                          }`}>
                            {notification.title}
                          </h3>
                          {(!notification.isRead && !notification.read) && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          getNotificationTypeBadge(notification.type)
                        }`}>
                          {notification.type?.replace('_', ' ').toLowerCase()}
                        </span>
                      </div>

                      <div className="flex gap-2 flex-shrink-0">
                        {(!notification.isRead && !notification.read) && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-2">{notification.message}</p>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(notification.createdAt || notification.timestamp || new Date()).toLocaleString()}
                      </span>
                      {notification.scheduledFor && (
                        <span className="text-blue-600">
                          Scheduled: {new Date(notification.scheduledFor).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'unread' ? 'No unread notifications' :
               filter === 'read' ? 'No read notifications' :
               'No notifications yet'}
            </h3>
            <p className="text-gray-600">
              {filter === 'all'
                ? "You'll receive notifications for appointments, medications, and health reminders"
                : "Check back later for new updates"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
