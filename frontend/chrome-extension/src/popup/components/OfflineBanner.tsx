import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

interface OfflineBannerProps {
  isOnline: boolean;
  queueCount: number;
  syncing: boolean;
  onSync: () => void;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  isOnline,
  queueCount,
  syncing,
  onSync,
}) => {
  if (isOnline && queueCount === 0) return null;

  return (
    <div
      className={`px-3 py-2 text-xs flex items-center justify-between border-b ${
        !isOnline
          ? 'bg-red-500 text-white border-red-600'
          : 'bg-indigo-600 text-white border-indigo-700'
      }`}
    >
      <div className="flex items-center space-x-1.5 font-medium">
        {!isOnline ? (
          <>
            <WifiOff className="w-3.5 h-3.5" />
            <span>Offline Mode ({queueCount} pending)</span>
          </>
        ) : (
          <span>{queueCount} item(s) pending sync</span>
        )}
      </div>

      {isOnline && queueCount > 0 && (
        <button
          onClick={onSync}
          disabled={syncing}
          className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded text-[11px] font-semibold transition"
        >
          <RefreshCw className={`w-3 h-3 ${syncing ? 'animate-spin' : ''}`} />
          <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
        </button>
      )}
    </div>
  );
};
