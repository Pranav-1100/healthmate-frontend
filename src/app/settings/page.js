'use client';

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/shared/Button';
import { Bell, Lock, Eye, Globe, Moon, Settings2, Shield, Database, AlertCircle } from 'lucide-react';

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

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    darkMode: false,
    twoFactor: false,
    language: 'en',
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
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
              enabled={settings.darkMode}
              onChange={(value) => updateSetting('darkMode', value)}
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
                variant="outline" 
                size="sm"
                className="w-full py-2.5 border-gray-200 hover:bg-gray-50 text-black rounded-xl"
              >
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
                variant="outline" 
                size="sm"
                className="w-full py-2.5 border-gray-200 hover:bg-gray-50 text-black rounded-xl"
              >
                Export Data
              </Button>
              <Button 
                variant="danger" 
                size="sm"
                className="w-full py-2.5 bg-red-50 text-red-600 hover:bg-red-100 border-red-100 rounded-xl"
              >
                Delete Account
              </Button>
            </div>
          </SettingSection>
        </div>
      </div>
    </AppLayout>
  );
}