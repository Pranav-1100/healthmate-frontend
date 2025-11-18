'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import { useApp, actions } from '@/lib/context';
import { Bell, Lock, Globe, Moon, Settings2, Shield, Database, X, Download, Trash } from 'lucide-react';

const SettingSection = ({ icon: Icon, title, description, children }) => (
  <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
    <div className="flex flex-col space-y-6">
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-blue-50 rounded-xl">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-black">{title}</h3>
          <p className="mt-1 text-sm text-black/70">{description}</p>
        </div>
      </div>
      <div className="w-full">{children}</div>
    </div>
  </div>
);

const Toggle = ({ enabled, onChange, label }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm font-medium text-black">{label}</span>
    <button
      type="button"
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        enabled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
      onClick={() => onChange(!enabled)}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function SettingsPage() {
  const { state, dispatch } = useApp();
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    twoFactor: false,
    language: 'en',
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleDarkModeToggle = (enabled) => {
    dispatch(actions.setTheme(enabled ? 'dark' : 'light'));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual password change API call
      // await authAPI.changePassword(passwordData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setShowPasswordModal(false);
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    setLoading(true);
    try {
      // TODO: Implement actual data export API call
      // const data = await userAPI.exportData();

      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockData = {
        profile: { name: 'User', email: 'user@example.com' },
        medications: [],
        prescriptions: [],
        documents: [],
        exportDate: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(mockData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `healthmate-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess('Data exported successfully!');
      setTimeout(() => {
        setShowExportModal(false);
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual account deletion API call
      // await userAPI.deleteAccount();

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccess('Account deletion initiated. You will be logged out shortly.');
      setTimeout(() => {
        localStorage.clear();
        window.location.href = '/auth/login';
      }, 3000);
    } catch (err) {
      setError('Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-100 rounded-xl">
            <Settings2 className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-black">Settings</h1>
            <p className="text-black/70">Manage your account preferences and settings</p>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notifications */}
          <SettingSection
            icon={Bell}
            title="Notifications"
            description="Choose how you want to receive updates"
          >
            <div className="space-y-2">
              <Toggle
                label="Push notifications"
                enabled={settings.notifications}
                onChange={(value) => updateSetting('notifications', value)}
              />
              <Toggle
                label="Email updates"
                enabled={settings.emailUpdates}
                onChange={(value) => updateSetting('emailUpdates', value)}
              />
            </div>
          </SettingSection>

          {/* Appearance */}
          <SettingSection
            icon={Moon}
            title="Appearance"
            description="Customize your viewing experience"
          >
            <Toggle
              label="Dark mode"
              enabled={state.theme === 'dark'}
              onChange={handleDarkModeToggle}
            />
          </SettingSection>

          {/* Security */}
          <SettingSection
            icon={Shield}
            title="Security"
            description="Protect your account with additional security"
          >
            <div className="space-y-4">
              <Toggle
                label="Two-factor authentication"
                enabled={settings.twoFactor}
                onChange={(value) => updateSetting('twoFactor', value)}
              />
              <Button
                onClick={() => setShowPasswordModal(true)}
                variant="outline"
                size="sm"
                className="w-full py-2.5 border-gray-200 hover:bg-gray-50 text-black rounded-xl"
              >
                <Lock className="w-4 h-4 inline mr-2" />
                Change Password
              </Button>
            </div>
          </SettingSection>

          {/* Language */}
          <SettingSection
            icon={Globe}
            title="Language"
            description="Select your preferred language"
          >
            <select
              value={settings.language}
              onChange={(e) => updateSetting('language', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </SettingSection>

          {/* Data & Privacy */}
          <SettingSection
            icon={Database}
            title="Data & Privacy"
            description="Manage your data and privacy preferences"
          >
            <div className="space-y-3">
              <Button
                onClick={() => setShowExportModal(true)}
                variant="outline"
                size="sm"
                className="w-full py-2.5 border-gray-200 hover:bg-gray-50 text-black rounded-xl"
              >
                <Download className="w-4 h-4 inline mr-2" />
                Export Data
              </Button>
              <Button
                onClick={() => setShowDeleteModal(true)}
                variant="danger"
                size="sm"
                className="w-full py-2.5 bg-red-50 text-red-600 hover:bg-red-100 border-red-100 rounded-xl"
              >
                <Trash className="w-4 h-4 inline mr-2" />
                Delete Account
              </Button>
            </div>
          </SettingSection>
        </div>

        {/* Password Change Modal */}
        <Modal
          isOpen={showPasswordModal}
          onClose={() => {
            setShowPasswordModal(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setError('');
            setSuccess('');
          }}
          title="Change Password"
        >
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg">
              {success}
            </div>
          )}
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              required
              className="text-gray-900"
            />
            <Input
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              required
              minLength={8}
              className="text-gray-900"
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              required
              className="text-gray-900"
            />
            <Button
              type="submit"
              loading={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700"
            >
              Change Password
            </Button>
          </form>
        </Modal>

        {/* Export Data Modal */}
        <Modal
          isOpen={showExportModal}
          onClose={() => {
            setShowExportModal(false);
            setError('');
            setSuccess('');
          }}
          title="Export Your Data"
        >
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg">
              {success}
            </div>
          )}
          <div className="space-y-4">
            <p className="text-gray-600">
              Download all your health data including prescriptions, medications, documents, and health records in JSON format.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">What's included:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Profile information</li>
                <li>• Medications and prescriptions</li>
                <li>• Medical documents</li>
                <li>• Health metrics and reports</li>
                <li>• Chat history</li>
              </ul>
            </div>
            <Button
              onClick={handleExportData}
              loading={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download My Data
            </Button>
          </div>
        </Modal>

        {/* Delete Account Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeleteConfirmation('');
            setError('');
            setSuccess('');
          }}
          title="Delete Account"
        >
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-600 text-sm rounded-lg">
              {success}
            </div>
          )}
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-900 mb-2">Warning: This action cannot be undone!</h4>
              <p className="text-sm text-red-800">
                Deleting your account will permanently remove:
              </p>
              <ul className="text-sm text-red-800 mt-2 space-y-1">
                <li>• Your profile and personal information</li>
                <li>• All medications and prescriptions</li>
                <li>• Medical documents and records</li>
                <li>• Health history and chat data</li>
                <li>• All appointments and reminders</li>
              </ul>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Type <span className="font-bold text-red-600">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="DELETE"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <Button
              onClick={handleDeleteAccount}
              loading={loading}
              disabled={deleteConfirmation !== 'DELETE'}
              className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Permanently Delete Account
            </Button>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
