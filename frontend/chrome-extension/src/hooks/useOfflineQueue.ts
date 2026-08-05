import { useState, useEffect, useCallback } from 'react';
import { OfflineService } from '../services/offline';

export function useOfflineQueue() {
  const [queueCount, setQueueCount] = useState<number>(0);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  const refreshCount = useCallback(async () => {
    const count = await OfflineService.getQueueCount();
    setQueueCount(count);
  }, []);

  useEffect(() => {
    refreshCount();

    const handleOnline = () => {
      setIsOnline(true);
      syncQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [refreshCount]);

  const syncQueue = async () => {
    setSyncing(true);
    try {
      const result = await OfflineService.syncQueue();
      await refreshCount();
      return result;
    } finally {
      setSyncing(false);
    }
  };

  return { queueCount, isOnline, syncing, syncQueue, refreshCount };
}
