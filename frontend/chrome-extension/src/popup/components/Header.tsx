import React from 'react';
import { Brain, Settings, Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { User } from '../../types';

interface HeaderProps {
  user: User | null;
  onLogout?: () => void;
  openOptions?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, openOptions }) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleOpenSettings = () => {
    if (openOptions) {
      openOptions();
    } else if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    }
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-darkCard border-b border-gray-100 dark:border-darkBorder shadow-sm">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-lg bg-brain-600 flex items-center justify-center text-white shadow-md">
          <Brain className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-sm font-bold bg-gradient-to-r from-brain-600 to-indigo-500 bg-clip-text text-transparent">
            SecondBrain
          </h1>
          {user && (
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium truncate max-w-[110px]">
              @{user.username}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={toggleTheme}
          title="Toggle Dark/Light Mode"
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        <button
          onClick={handleOpenSettings}
          title="Settings"
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>

        {user && onLogout && (
          <button
            onClick={onLogout}
            title="Log Out"
            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
