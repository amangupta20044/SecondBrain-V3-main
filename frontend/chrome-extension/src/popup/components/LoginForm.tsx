import React, { useState } from 'react';
import { Lock, User as UserIcon, Mail, AlertCircle, ArrowRight } from 'lucide-react';

interface LoginFormProps {
  onLogin: (username: string, pass: string) => Promise<any>;
  onSignup: (username: string, email: string, pass: string) => Promise<any>;
  loading: boolean;
  error: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  onSignup,
  loading,
  error,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!username.trim() || !password.trim()) {
      setLocalError('Please fill in all required fields');
      return;
    }

    try {
      if (isSignUp) {
        if (!email.trim()) {
          setLocalError('Email is required for signup');
          return;
        }
        await onSignup(username.trim(), email.trim(), password.trim());
        // Switch to login tab after registration
        setIsSignUp(false);
      } else {
        await onLogin(username.trim(), password.trim());
      }
    } catch (err: any) {
      setLocalError(err.message || 'Operation failed');
    }
  };

  const displayError = localError || error;

  return (
    <div className="p-5 flex flex-col justify-between h-[420px]">
      <div>
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {isSignUp ? 'Create SecondBrain Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {isSignUp
              ? 'Sign up to start saving web links and knowledge'
              : 'Log in to connect your web browser extension'}
          </p>
        </div>

        {displayError && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 flex items-start space-x-2 text-xs text-red-600 dark:text-red-400">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{displayError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-darkBorder bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brain-500 focus:outline-none transition"
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-darkBorder bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brain-500 focus:outline-none transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-darkBorder bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brain-500 focus:outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 rounded-lg bg-brain-600 hover:bg-brain-700 active:bg-brain-800 text-white font-medium text-xs flex items-center justify-center space-x-2 shadow-md transition disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="text-center pt-3 border-t border-gray-100 dark:border-darkBorder">
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setLocalError(null);
          }}
          className="text-xs text-brain-600 hover:text-brain-700 dark:text-indigo-400 font-medium hover:underline"
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  );
};
