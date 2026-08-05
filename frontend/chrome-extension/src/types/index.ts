export type ContentType = 'link' | 'article' | 'video' | 'tweet' | 'custom' | 'image';

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Tag {
  _id: string;
  title: string;
}

export interface SavedContent {
  _id?: string;
  link: string;
  type: ContentType;
  title: string;
  description: string;
  tags: string[]; // tag ObjectIds
  userId: string;
  date?: number | string;
}

export interface PageMetadata {
  url: string;
  title: string;
  description: string;
  favicon: string;
  hostname: string;
  image?: string;
  ogType?: string;
  timestamp: number;
}

export interface OfflineQueueItem {
  id: string;
  payload: {
    link: string;
    type: ContentType;
    title: string;
    description: string;
    tags: string[];
    userId: string;
  };
  createdAt: number;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface StorageData {
  token?: string;
  user?: User;
  backendUrl?: string;
  theme?: ThemeMode;
  offlineQueue?: OfflineQueueItem[];
}
