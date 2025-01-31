'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import { authAPI } from '@/lib/api';
import { HeartPulse, Bot } from 'lucide-react';

// Features Component
const Features = () => (
  <div className="space-y-3 text-sm">
    <h3 className="font-semibold text-lg mb-4 text-gray-900">Your AI Health Assistant Can:</h3>
    <p className="text-gray-900">• Analyze symptoms and suggest potential conditions</p>
    <p className="text-gray-900">• Recommend appropriate medical specialists</p>
    <p className="text-gray-900">• Provide basic medication information</p>
    <p className="text-gray-900">• Track your health history and patterns</p>
    <p className="text-gray-900">• Offer personalized wellness recommendations</p>
  </div>
);

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData.email, formData.password);
      if (response && response.token) {
        localStorage.setItem('token', response.token);
        document.cookie = `authToken=${response.token}; path=/`;
        localStorage.setItem('user', JSON.stringify(response.user));
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Image */}
      <img 
        src="https://cloud-gs6e53fby-hack-club-bot.vercel.app/0screenshot_2025-01-31_092925.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      <div className="flex w-full max-w-6xl gap-8 relative z-10">
        {/* Left Side - App Info */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-8">
          <div className="flex items-center mb-8">
            <HeartPulse className="w-10 h-10 text-sky-600" />
            <Bot className="w-8 h-8 text-sky-600 ml-2" />
            <h1 className="text-4xl font-bold ml-4 text-gray-900">Doc-Scan AI</h1>
          </div>
          
          <p className="text-xl mb-8 text-gray-900 font-medium">
            Welcome back to your personal health companion. Your health journey
            continues here.
          </p>
          
          <Features />
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-8">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center">
                <HeartPulse className="w-8 h-8 text-sky-600" />
              </div>
            </div>
            
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Welcome back
            </h2>
            
            <p className="mt-2 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-sky-600 hover:text-sky-500 font-semibold">
                Register here
              </Link>
            </p>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <Input
                label="Email address"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="text-gray-900 placeholder-gray-500 font-medium bg-white/90"
              />

              <Input
                label="Password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="text-gray-900 placeholder-gray-500 font-medium bg-white/90"
              />

              {error && (
                <div className="text-sm text-red-600 font-medium">{error}</div>
              )}

              <Button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold"
                loading={loading}
              >
                Sign in
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/70 text-gray-500 font-medium">
                    Need help?
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-center text-sm">
                <Link href="/auth/forgot-password" className="text-sky-600 hover:text-sky-500 font-medium">
                  Forgot your password?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}