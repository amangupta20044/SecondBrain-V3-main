import { ChromeStorage } from '../storage/chromeStorage';
import { ContentService } from '../services/content';
import { OfflineService } from '../services/offline';
import { detectCategoryFromUrl } from '../utils/metadataExtractor';

const CONTEXT_MENU_ID = 'secondbrain_save_page';

// 1. Install & Setup Context Menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: 'Save to SecondBrain',
    contexts: ['page', 'link', 'selection'],
  });

  // Setup periodic sync alarm (every 5 minutes)
  chrome.alarms.create('offlineSyncAlarm', { periodInMinutes: 5 });
});

// Helper function to show notifications safely
function showNotification(title: string, message: string) {
  if (chrome.notifications) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'assets/icon128.png',
      title,
      message,
    });
  }
}

// 2. Core Tab Saver Function
async function saveTabToSecondBrain(tab: chrome.tabs.Tab) {
  if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
    showNotification('SecondBrain', 'Cannot save chrome system pages.');
    return;
  }

  const token = await ChromeStorage.getToken();
  const user = await ChromeStorage.getUser();

  if (!token || !user) {
    showNotification('SecondBrain - Authentication Required', 'Please click the extension icon to log in first.');
    return;
  }

  const link = tab.url;
  const title = tab.title || tab.url;
  const description = `Saved via Extension on ${new Date().toLocaleString()}`;
  const category = detectCategoryFromUrl(link);

  const payload = {
    link,
    type: category,
    title,
    description,
    tags: [],
    userId: user.id,
  };

  try {
    // Save to backend
    await ContentService.saveContent(payload);
    showNotification('✔ SecondBrain', `Saved successfully: "${title.slice(0, 35)}..."`);
  } catch (err) {
    // If backend is unreachable or fails, enqueue offline
    await OfflineService.enqueue(payload);
    showNotification(
      'SecondBrain (Offline Mode)',
      `Network unavailable. Saved to offline queue. Will sync automatically.`
    );
  }
}

// 3. Handle Context Menu Click
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === CONTEXT_MENU_ID && tab) {
    await saveTabToSecondBrain(tab);
  }
});

// 4. Handle Keyboard Shortcut (Ctrl+Shift+S / Cmd+Shift+S)
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'save-page') {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      await saveTabToSecondBrain(tab);
    }
  }
});

// 5. Handle Periodic Offline Sync Alarm
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'offlineSyncAlarm') {
    const result = await OfflineService.syncQueue();
    if (result.synced > 0) {
      showNotification(
        'SecondBrain Sync',
        `Successfully synced ${result.synced} offline item(s)!`
      );
    }
  }
});

// 6. Listen for Runtime Messages from Popup or Content Script
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'SYNC_OFFLINE_QUEUE') {
    OfflineService.syncQueue().then((res) => {
      sendResponse({ success: true, result: res });
    });
    return true;
  }
  if (request.action === 'TRIGGER_SAVE_CURRENT_TAB') {
    chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
      if (tab) {
        saveTabToSecondBrain(tab).then(() => {
          sendResponse({ success: true });
        });
      }
    });
    return true;
  }
});
