# SecondBrain V3 - Chrome Extension (Manifest V3)

A powerful, isolated, downloadable Chrome Extension built with **React**, **TypeScript**, **Tailwind CSS**, and **Manifest V3** that connects directly to your existing SecondBrain application.

---

## 🌟 Key Features

1. **User Authentication**
   - Instant login & signup using existing backend auth APIs.
   - Secure token storage using `chrome.storage.local`.
   - Automatic session restoration upon extension popup open.

2. **Save Current Web Tab**
   - Automatically collects: `URL`, `title`, `favicon`, `hostname`, and timestamp.
   - Zero copy-pasting required.

3. **Smart Category Classification**
   - Select between: **Link**, **Article**, **Video**, **Tweet**, or **Custom**.
   - Auto-detects video (YouTube/Vimeo), tweets (X/Twitter), articles (Medium/Substack), and images.

4. **Tags & Notes**
   - Multi-select existing tags or dynamically create new tags.
   - Optional notes field.

5. **AI Summarization**
   - Reuses existing backend AI summarizer (`POST /api/v1/content/summarize`) for videos and web pages.

6. **Duplicate Detection**
   - Automatically checks if the current URL is already saved in SecondBrain and alerts the user.

7. **Context Menu & Keyboard Shortcut**
   - Right-click anywhere on a webpage and click **"Save to SecondBrain"**.
   - Keyboard shortcut: **`Ctrl + Shift + S`** (or `Cmd + Shift + S` on macOS).

8. **Offline Support & Auto-Sync**
   - If the backend is unavailable or internet disconnects, save requests are queued locally in `chrome.storage.local`.
   - Automatically synchronizes when connectivity is restored or on periodic background alarms.

9. **Settings & Themes**
   - Configurable Backend Host URL (Default: `http://localhost:3000`).
   - Dark, Light, and System Theme support.

---

## 📁 Directory Structure

```
frontend/chrome-extension/
├── manifest.json            # Manifest V3 extension configuration
├── index.html               # Popup HTML root
├── options.html             # Options page HTML root
├── vite.config.ts           # Vite build config with asset copy plugin
├── tailwind.config.js       # Tailwind CSS theme configuration
├── postcss.config.js        # PostCSS configuration
├── package.json             # NPM dependencies & scripts
├── src/
│   ├── assets/              # Extension icons (16x16, 32x32, 48x48, 128x128)
│   ├── background/          # Service Worker background script
│   ├── content/             # Webpage content script (metadata extractor)
│   ├── hooks/               # Custom React hooks (useAuth, useCurrentTab, etc.)
│   ├── options/             # Settings UI page
│   ├── popup/               # Extension popup UI & subcomponents
│   ├── services/            # API, Auth, Content, & Offline services
│   ├── storage/             # chrome.storage.local wrapper
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Metadata extractor & helpers
└── README.md
```

---

## 🚀 Installation & Local Development

### 1. Install Dependencies

Navigate to the extension directory:
```bash
cd frontend/chrome-extension
npm install
```

### 2. Build Extension Bundle

Run the production build command:
```bash
npm run build
```
This compiles TypeScript, bundles React components, processes Tailwind CSS, and outputs the final extension files into `frontend/chrome-extension/dist/`.

---

## 🧩 Loading Unpacked Extension in Chrome

1. Open **Google Chrome** and navigate to `chrome://extensions`.
2. Toggle **Developer mode** in the top-right corner.
3. Click the **Load unpacked** button in the top-left corner.
4. Select the directory:
   `d:\SecondBrain\SecondBrain-V3-main\frontend\chrome-extension\dist`
5. The **SecondBrain** extension icon will now appear in your Chrome toolbar!

---

## 📦 Production Packaging

To prepare the extension for distribution (e.g. Chrome Web Store or sharing with team):

1. Run `npm run build`.
2. Compress the contents of the `dist/` directory into a `.zip` file:
   - On Windows: Right-click `dist` folder $\rightarrow$ Send to $\rightarrow$ Compressed (zipped) folder.
   - On macOS/Linux: `cd dist && zip -r ../secondbrain-extension.zip .`
3. Upload the resulting `.zip` file to Chrome Web Store Developer Dashboard.
