import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { AlertBox } from '../components/common/Card';
import { Mail, Lock, Eye, EyeOff, Heart, Smartphone } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading, error, setError } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCaregiver, setIsCaregiver] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password, isCaregiver ? 'caregiver' : undefined);
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by the store
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-elegant p-8 border border-white/20">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Heart className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-bold text-gradient mb-2">ElderEase</h1>
            <p className="text-neutral-600 text-sm">Smart Care for Healthy Aging</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6">
              <AlertBox type="error" message={error} onClose={() => setError(null)} />
            </div>
          )}

          {/* Toggle Role */}
          <div className="flex bg-neutral-100 p-1 rounded-xl mb-6">
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${!isCaregiver ? 'bg-white shadow-sm text-primary-600' : 'text-neutral-500 hover:text-neutral-700'}`}
              onClick={() => setIsCaregiver(false)}
            >
              Elder / User
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${isCaregiver ? 'bg-white shadow-sm text-primary-600' : 'text-neutral-500 hover:text-neutral-700'}`}
              onClick={() => setIsCaregiver(true)}
            >
              Caregiver
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-neutral-400" size={18} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-12"
                  placeholder="your@email.com"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-neutral-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-neutral-400" size={18} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-12 pr-12"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-neutral-400 hover:text-neutral-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  defaultChecked
                  disabled={loading}
                />
                <span className="text-neutral-600">Remember me</span>
              </label>
              <a href="#" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button type="submit" disabled={loading} className="btn-primary-lg w-full mt-6">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-neutral-500 font-medium">or continue with</span>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 rounded-xl p-4 mb-6">
            <p className="text-sm font-bold text-primary-900 mb-2 flex items-center gap-2">
              <Smartphone size={16} />
              Demo Mode
            </p>
            <p className="text-xs text-primary-800 leading-relaxed">
              <strong>Email:</strong> demo@example.com<br />
              <strong>Password:</strong> any password
            </p>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-neutral-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
              Sign up today
            </Link>
          </p>
        </div>

        {/* Footer Text */}
        <p className="text-center text-xs text-neutral-600 mt-8">
          © 2024 ElderEase. Secure & HIPAA Compliant.
        </p>
      </div>
    </div>
  );
};
