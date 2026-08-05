import { ChromeStorage } from '../storage/chromeStorage';
import { ContentService } from './content';
import { ContentType, OfflineQueueItem } from '../types';

export class OfflineService {
  static async enqueue(payload: {
    link: string;
    type: ContentType;
    title: string;
    description: string;
    tags: string[];
    userId: string;
  }): Promise<OfflineQueueItem> {
    const queue = await ChromeStorage.getOfflineQueue();
    const newItem: OfflineQueueItem = {
      id: `offline_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      payload,
      createdAt: Date.now(),
    };
    queue.push(newItem);
    await ChromeStorage.setOfflineQueue(queue);
    return newItem;
  }

  static async getQueueCount(): Promise<number> {
    const queue = await ChromeStorage.getOfflineQueue();
    return queue.length;
  }

  static async syncQueue(): Promise<{ synced: number; failed: number }> {
    const queue = await ChromeStorage.getOfflineQueue();
    if (queue.length === 0) {
      return { synced: 0, failed: 0 };
    }

    const remainingItems: OfflineQueueItem[] = [];
    let synced = 0;
    let failed = 0;

    for (const item of queue) {
      try {
        await ContentService.saveContent(item.payload);
        synced++;
      } catch (err) {
        console.warn(`Failed to sync queued item ${item.id}:`, err);
        remainingItems.push(item);
        failed++;
      }
    }

    await ChromeStorage.setOfflineQueue(remainingItems);
    return { synced, failed };
  }
}
