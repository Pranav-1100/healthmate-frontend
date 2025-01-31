'use client';

import { useEffect, useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import { authAPI } from '@/lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { User, MapPin, Activity, Heart, Scale, Ruler } from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await authAPI.getProfile();
      setProfile(data);
      setFormData(data);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const updatedProfile = await authAPI.updateProfile(formData);
      setProfile(updatedProfile);
      setEditing(false);
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        {/* Profile Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-500">{formData.email}</p>
            </div>
          </div>
          {!editing && (
            <Button 
              onClick={() => setEditing(true)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
            >
              Edit Profile
            </Button>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Input
                    label="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!editing}
                    className="rounded-xl text-black"
                  />

                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="rounded-xl bg-gray-50 text-black"
                  />

                  <Input
                    label="Age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    disabled={!editing}
                    className="rounded-xl text-black"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      disabled={!editing}
                      className="w-full px-4 text-black py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <Input
                    label="Height (cm)"
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    disabled={!editing}
                    className="rounded-xl text-black"
                  />

                  <Input
                    label="Weight (kg)"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    disabled={!editing}
                    className="rounded-xl text-black"
                  />

                  <Input
                    label="Location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    disabled={!editing}
                    className="rounded-xl text-black"
                  />
                </div>

                <div className="space-y-4">
                  <Input
                    label="Medical Conditions"
                    as="textarea"
                    rows={3}
                    value={formData.medical_conditions}
                    onChange={(e) => setFormData({ ...formData, medical_conditions: e.target.value })}
                    disabled={!editing}
                    className="rounded-xl text-black"
                  />

                  <Input
                    label="Allergies"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    disabled={!editing}
                    className="rounded-xl text-black"
                  />
                </div>

                {editing && (
                  <div className="flex gap-4 pt-4">
                    <Button 
                      type="submit" 
                      loading={loading}
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm"
                    >
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData(profile);
                        setEditing(false);
                      }}
                      className="px-6 py-2 border border-gray-300 hover:bg-gray-50 rounded-xl"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Health Metrics Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Health Overview</h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <h3 className="text-sm font-medium text-gray-900">BMI</h3>
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {((formData.weight / Math.pow(formData.height / 100, 2)) || 0).toFixed(1)}
                  </p>
                </div>

                <div className="p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Scale className="w-5 h-5 text-green-600" />
                    <h3 className="text-sm font-medium text-gray-900">Weight</h3>
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {formData.weight} kg
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Ruler className="w-5 h-5 text-purple-600" />
                    <h3 className="text-sm font-medium text-gray-900">Height</h3>
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-gray-900">
                    {formData.height} cm
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weight Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Weight History</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={[
                  { date: '2024-01-01', weight: formData.weight },
                  { date: '2024-01-15', weight: formData.weight - 1 },
                  { date: '2024-01-30', weight: formData.weight - 0.5 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '0.5rem',
                    padding: '0.5rem'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#2563EB" 
                  strokeWidth={2}
                  dot={{ fill: '#2563EB', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}