import { getApiClient } from './api';
import { ContentType, SavedContent, Tag } from '../types';

export class ContentService {
  /**
   * Normalizes category type to match backend enum schema.
   * Backend enum: [ "image" , 'video' , "article " , "tweet" , "link"]
   */
  private static mapTypeForBackend(type: ContentType): string {
    switch (type) {
      case 'article':
        return 'article ';
      case 'video':
        return 'video';
      case 'tweet':
        return 'tweet';
      case 'image':
        return 'image';
      case 'custom':
      case 'link':
      default:
        return 'link';
    }
  }

  static async saveContent(payload: {
    link: string;
    type: ContentType;
    title: string;
    description: string;
    tags: string[];
    userId: string;
  }): Promise<void> {
    const api = await getApiClient();
    const formattedPayload = {
      ...payload,
      type: this.mapTypeForBackend(payload.type),
    };
    const response = await api.post('/api/v1/content/create', formattedPayload);
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Failed to save content');
    }
  }

  static async fetchUserContents(userId: string): Promise<SavedContent[]> {
    try {
      const api = await getApiClient();
      const response = await api.get(`/api/v1/user/contents?userID=${userId}`);
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return [];
    } catch (err) {
      console.warn('Failed to fetch user contents:', err);
      return [];
    }
  }

  static async checkDuplicate(url: string, userId: string): Promise<SavedContent | null> {
    const contents = await this.fetchUserContents(userId);
    const cleanUrl = url.trim().toLowerCase();
    const existing = contents.find((item) => item.link.trim().toLowerCase() === cleanUrl);
    return existing || null;
  }

  static async summarizeUrl(url: string): Promise<string> {
    const api = await getApiClient();
    const response = await api.post('/api/v1/content/summarize', { url });
    if (response.data && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data?.message || 'No summary returned for this URL');
  }

  static async fetchAllTags(): Promise<Tag[]> {
    try {
      const api = await getApiClient();
      const response = await api.get('/api/v1/tag/alltags');
      if (response.data && Array.isArray(response.data.tags)) {
        return response.data.tags;
      }
      return [];
    } catch (err) {
      console.warn('Failed to fetch tags:', err);
      return [];
    }
  }

  static async createTag(title: string): Promise<void> {
    const api = await getApiClient();
    const response = await api.post('/api/v1/tag/createtag', { title });
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data?.message || 'Failed to create tag');
    }
  }
}
