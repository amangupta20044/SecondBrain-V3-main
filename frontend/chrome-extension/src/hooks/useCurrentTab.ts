import { useState, useEffect } from 'react';
import { PageMetadata, ContentType } from '../types';
import { detectCategoryFromUrl } from '../utils/metadataExtractor';

export function useCurrentTab() {
  const [metadata, setMetadata] = useState<PageMetadata | null>(null);
  const [category, setCategory] = useState<ContentType>('link');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTabInfo() {
      setLoading(true);
      setError(null);

      if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
        try {
          const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
          if (!tab || !tab.id || !tab.url) {
            throw new Error('No active browser tab found');
          }

          const fallbackFavicon =
            tab.favIconUrl ||
            (tab.url ? `${new URL(tab.url).origin}/favicon.ico` : '');

          const basicMetadata: PageMetadata = {
            url: tab.url,
            title: tab.title || tab.url,
            description: '',
            favicon: fallbackFavicon,
            hostname: new URL(tab.url).hostname,
            timestamp: Date.now(),
          };

          // Try messaging content script for rich OpenGraph metadata
          chrome.tabs.sendMessage(
            tab.id,
            { action: 'EXTRACT_METADATA' },
            (response) => {
              if (chrome.runtime.lastError || !response || !response.success) {
                // Content script might not be injected or restricted tab (e.g. chrome://)
                setMetadata(basicMetadata);
                setCategory(detectCategoryFromUrl(basicMetadata.url));
              } else {
                const richMetadata: PageMetadata = response.metadata;
                setMetadata(richMetadata);
                setCategory(
                  detectCategoryFromUrl(richMetadata.url, richMetadata.ogType)
                );
              }
              setLoading(false);
            }
          );
        } catch (err: any) {
          setError(err.message || 'Could not fetch tab info');
          setLoading(false);
        }
      } else {
        // Fallback for standalone browser testing mode
        const devMetadata: PageMetadata = {
          url: window.location.href,
          title: document.title || 'SecondBrain Demo Page',
          description: 'Testing tab metadata extraction in dev environment.',
          favicon: 'https://vitejs.dev/logo.svg',
          hostname: window.location.hostname,
          timestamp: Date.now(),
        };
        setMetadata(devMetadata);
        setCategory(detectCategoryFromUrl(devMetadata.url));
        setLoading(false);
      }
    }

    fetchTabInfo();
  }, []);

  return { metadata, category, setCategory, loading, error };
}
