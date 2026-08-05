# SecondBrain V3 - Chrome Extension (Manifest V3)

A powerful, isolated, downloadable Chrome Extension built with **React**, **TypeScript**, **Tailwind CSS**, and **Manifest V3** that connects directly to your production SecondBrain application.

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
   - Configurable Backend Host URL (Default: `https://secondbrain-v3-main.onrender.com`).
   - Dark, Light, and System Theme support.

---

## 📦 Downloading & Installing the Extension

Users can install the extension in **Developer Mode** without needing Node.js or local backend servers:

1. **Download Pre-built ZIP**: Download `secondbrain-extension.zip` from GitHub Releases.
2. **Extract ZIP**: Extract the archive to a folder on your computer.
3. **Open Chrome Extensions**: Go to `chrome://extensions` in Google Chrome.
4. **Enable Developer Mode**: Turn **ON** Developer Mode in the top-right corner.
5. **Click "Load Unpacked"**: Click **Load unpacked** in the top-left corner and select the extracted `dist` folder.

---

## 🛠️ Building From Source Code

If you want to build the extension bundle from source code:

```bash
cd frontend/chrome-extension
npm install
npm run build
```

This compiles TypeScript, bundles React components, processes Tailwind CSS, and outputs the final extension files into `frontend/chrome-extension/dist/`.

To package the compiled extension into a downloadable ZIP:
- **Windows (PowerShell)**:
  ```powershell
  Compress-Archive -Path dist\* -DestinationPath secondbrain-extension.zip -Force
  ```
- **macOS/Linux**:
  ```bash
  cd dist && zip -r ../secondbrain-extension.zip . && cd ..
  ```
