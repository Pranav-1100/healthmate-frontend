'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import { HeartPulse, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Implement actual password reset API call
      // const response = await authAPI.forgotPassword(email);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccess(true);
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err.response?.data?.error || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        <img
          src="https://cloud-gs6e53fby-hack-club-bot.vercel.app/0screenshot_2025-01-31_092925.jpg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="w-full max-w-md relative z-10">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Check Your Email
            </h2>

            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <strong>{email}</strong>.
              Please check your inbox and follow the instructions to reset your password.
            </p>

            <div className="space-y-3">
              <Link href="/auth/login">
                <Button className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold">
                  Back to Login
                </Button>
              </Link>

              <button
                onClick={() => setSuccess(false)}
                className="w-full text-sky-600 hover:text-sky-500 font-medium text-sm"
              >
                Didn't receive the email? Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      <img
        src="https://cloud-gs6e53fby-hack-club-bot.vercel.app/0screenshot_2025-01-31_092925.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center">
              <HeartPulse className="w-8 h-8 text-sky-600" />
            </div>
          </div>

          <h2 className="text-center text-3xl font-bold text-gray-900 mb-2">
            Forgot Password?
          </h2>

          <p className="text-center text-sm text-gray-600 mb-8">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="text-gray-900 placeholder-gray-500 font-medium bg-white/90"
            />

            {error && (
              <div className="text-sm text-red-600 font-medium bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold"
              loading={loading}
            >
              Send Reset Link
            </Button>
          </form>

          <div className="mt-6">
            <Link
              href="/auth/login"
              className="flex items-center justify-center gap-2 text-sky-600 hover:text-sky-500 font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-sky-600 hover:text-sky-500 font-semibold">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
