import { extractPageMetadataFromDocument } from '../utils/metadataExtractor';

// Listen for messages from background worker or popup UI
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === 'EXTRACT_METADATA') {
      try {
        const metadata = extractPageMetadataFromDocument();
        sendResponse({ success: true, metadata });
      } catch (err) {
        sendResponse({ success: false, error: String(err) });
      }
      return true;
    }
  });
}
