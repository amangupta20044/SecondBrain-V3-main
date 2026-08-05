import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCurrentTab } from '../hooks/useCurrentTab';
import { useOfflineQueue } from '../hooks/useOfflineQueue';
import { Header } from './components/Header';
import { LoginForm } from './components/LoginForm';
import { SaveTabForm } from './components/SaveTabForm';
import { SkeletonLoader } from './components/SkeletonLoader';
import { OfflineBanner } from './components/OfflineBanner';

export const Popup: React.FC = () => {
  const { user, isAuthenticated, loading: authLoading, error: authError, login, signup, logout } = useAuth();
  const { metadata, category, loading: tabLoading, error: tabError } = useCurrentTab();
  const { isOnline, queueCount, syncing, syncQueue } = useOfflineQueue();

  const isLoading = authLoading || (isAuthenticated && tabLoading);

  return (
    <div className="w-full bg-gray-50 dark:bg-darkBg min-h-[480px] flex flex-col font-sans">
      <Header user={user} onLogout={logout} />

      <OfflineBanner
        isOnline={isOnline}
        queueCount={queueCount}
        syncing={syncing}
        onSync={syncQueue}
      />

      <div className="flex-1">
        {isLoading ? (
          <SkeletonLoader />
        ) : !isAuthenticated ? (
          <LoginForm
            onLogin={login}
            onSignup={signup}
            loading={authLoading}
            error={authError}
          />
        ) : tabError ? (
          <div className="p-6 text-center text-xs text-red-500">
            <p className="font-semibold mb-1">Failed to capture active tab</p>
            <p>{tabError}</p>
          </div>
        ) : metadata ? (
          <SaveTabForm
            metadata={metadata}
            initialCategory={category}
            user={user!}
            isOnline={isOnline}
          />
        ) : null}
      </div>
    </div>
  );
};
