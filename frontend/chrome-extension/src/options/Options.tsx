import React, { useState, useEffect } from 'react';
import { Brain, Server, Moon, Sun, Monitor, Trash2, LogOut, Check, RefreshCw, Database } from 'lucide-react';
import { ChromeStorage } from '../storage/chromeStorage';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { useOfflineQueue } from '../hooks/useOfflineQueue';
import { ThemeMode } from '../types';
import '../index.css';

export const Options: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { queueCount, syncQueue, syncing } = useOfflineQueue();

  const [backendUrl, setBackendUrl] = useState('https://secondbrain-v3-main.onrender.com');
  const [savedUrlMsg, setSavedUrlMsg] = useState(false);
  const [clearedStorageMsg, setClearedStorageMsg] = useState(false);

  useEffect(() => {
    ChromeStorage.getBackendUrl().then(setBackendUrl);
  }, []);

  const handleSaveUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    await ChromeStorage.setBackendUrl(backendUrl);
    setSavedUrlMsg(true);
    setTimeout(() => setSavedUrlMsg(false), 2000);
  };

  const handleClearStorage = async () => {
    if (window.confirm('Are you sure you want to clear local extension storage?')) {
      await ChromeStorage.clear();
      setClearedStorageMsg(true);
      setTimeout(() => {
        setClearedStorageMsg(false);
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkBg text-gray-900 dark:text-gray-100 font-sans p-6 md:p-12">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center space-x-3 pb-6 border-b border-gray-200 dark:border-darkBorder">
          <div className="w-12 h-12 rounded-xl bg-brain-600 flex items-center justify-center text-white shadow-lg">
            <Brain className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-brain-600 to-indigo-500 bg-clip-text text-transparent">
              SecondBrain Extension Settings
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Configure backend connection, appearance, and local offline queue
            </p>
          </div>
        </div>

        {/* Backend Configuration */}
        <section className="bg-white dark:bg-darkCard p-6 rounded-xl border border-gray-200 dark:border-darkBorder shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-brain-600 dark:text-indigo-400 font-semibold">
            <Server className="w-5 h-5" />
            <h2 className="text-base">Backend Host API Configuration</h2>
          </div>
          <form onSubmit={handleSaveUrl} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                API Base URL
              </label>
              <input
                type="url"
                required
                value={backendUrl}
                onChange={(e) => setBackendUrl(e.target.value)}
                placeholder="http://localhost:3000"
                className="w-full px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-darkBorder bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-brain-500 focus:outline-none transition"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Default: <code className="bg-gray-100 dark:bg-slate-800 px-1 py-0.5 rounded">http://localhost:3000</code>
              </span>
              <button
                type="submit"
                className="px-4 py-2 bg-brain-600 hover:bg-brain-700 text-white font-medium text-xs rounded-lg shadow transition flex items-center space-x-1.5"
              >
                {savedUrlMsg ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save URL</span>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Appearance Theme */}
        <section className="bg-white dark:bg-darkCard p-6 rounded-xl border border-gray-200 dark:border-darkBorder shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-brain-600 dark:text-indigo-400 font-semibold">
            <Sun className="w-5 h-5" />
            <h2 className="text-base">Theme Preference</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { mode: 'light' as ThemeMode, label: 'Light', icon: Sun },
              { mode: 'dark' as ThemeMode, label: 'Dark', icon: Moon },
              { mode: 'system' as ThemeMode, label: 'System', icon: Monitor },
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = theme === t.mode;

              return (
                <button
                  key={t.mode}
                  onClick={() => setTheme(t.mode)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-brain-50 dark:bg-brain-900/40 border-brain-500 text-brain-600 dark:text-indigo-300 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-darkBorder text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-2" />
                  <span className="text-xs font-semibold">{t.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Offline Sync Queue */}
        <section className="bg-white dark:bg-darkCard p-6 rounded-xl border border-gray-200 dark:border-darkBorder shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-brain-600 dark:text-indigo-400 font-semibold">
              <Database className="w-5 h-5" />
              <h2 className="text-base">Offline Queue Status</h2>
            </div>
            <span className="text-xs font-bold bg-brain-100 dark:bg-brain-900/60 text-brain-700 dark:text-indigo-300 px-2.5 py-1 rounded-full">
              {queueCount} Pending Item(s)
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            When you save web pages while offline or when the backend server is temporarily unreachable, items are safely queued in local extension storage and automatically synchronized when connectivity is restored.
          </p>
          <button
            onClick={syncQueue}
            disabled={syncing || queueCount === 0}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium text-xs rounded-lg shadow transition flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Synchronizing...' : 'Force Sync Offline Queue Now'}</span>
          </button>
        </section>

        {/* Storage & Logout */}
        <section className="bg-white dark:bg-darkCard p-6 rounded-xl border border-gray-200 dark:border-darkBorder shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Account & Data Reset
          </h2>
          {user && (
            <div className="text-xs text-gray-600 dark:text-gray-300">
              Logged in as: <span className="font-bold text-gray-900 dark:text-gray-100">@{user.username}</span> ({user.email})
            </div>
          )}
          <div className="flex items-center space-x-4 pt-2">
            <button
              onClick={handleClearStorage}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              <Trash2 className="w-4 h-4" />
              <span>{clearedStorageMsg ? 'Cleared!' : 'Clear Local Storage'}</span>
            </button>

            {user && (
              <button
                onClick={logout}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
