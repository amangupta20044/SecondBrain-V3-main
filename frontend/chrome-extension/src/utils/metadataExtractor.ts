import { ContentType, PageMetadata } from '../types';

export function extractPageMetadataFromDocument(): PageMetadata {
  const getMeta = (names: string[]): string => {
    for (const name of names) {
      const el =
        document.querySelector(`meta[name="${name}"]`) ||
        document.querySelector(`meta[property="${name}"]`);
      if (el) {
        const content = el.getAttribute('content');
        if (content && content.trim()) {
          return content.trim();
        }
      }
    }
    return '';
  };

  const getFavicon = (): string => {
    const iconLink = document.querySelector(
      'link[rel*="icon"], link[rel="shortcut icon"]'
    ) as HTMLLinkElement | null;
    if (iconLink && iconLink.href) {
      return iconLink.href;
    }
    return `${window.location.protocol}//${window.location.hostname}/favicon.ico`;
  };

  const url = window.location.href;
  const title = getMeta(['og:title', 'twitter:title']) || document.title || url;
  const description =
    getMeta(['og:description', 'twitter:description', 'description']) || '';
  const image = getMeta(['og:image', 'twitter:image']);
  const ogType = getMeta(['og:type']);

  return {
    url,
    title,
    description,
    favicon: getFavicon(),
    hostname: window.location.hostname,
    image: image || undefined,
    ogType: ogType || undefined,
    timestamp: Date.now(),
  };
}

export function detectCategoryFromUrl(url: string, ogType?: string): ContentType {
  const lowerUrl = url.toLowerCase();

  if (
    lowerUrl.includes('youtube.com/watch') ||
    lowerUrl.includes('youtu.be/') ||
    lowerUrl.includes('vimeo.com') ||
    ogType === 'video.other' ||
    ogType === 'video'
  ) {
    return 'video';
  }

  if (
    lowerUrl.includes('twitter.com') ||
    lowerUrl.includes('x.com')
  ) {
    return 'tweet';
  }

  if (
    lowerUrl.match(/\.(jpeg|jpg|gif|png|svg|webp)$/i) ||
    ogType === 'image'
  ) {
    return 'image';
  }

  if (
    lowerUrl.includes('/article/') ||
    lowerUrl.includes('/blog/') ||
    lowerUrl.includes('medium.com') ||
    lowerUrl.includes('dev.to') ||
    lowerUrl.includes('substack.com') ||
    ogType === 'article'
  ) {
    return 'article';
  }

  return 'link';
}
