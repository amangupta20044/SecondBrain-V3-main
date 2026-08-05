# 🧠 SecondBrain V3 & Chrome Extension (Manifest V3)

[![Manifest V3](https://img.shields.io/badge/Chrome_Extension-Manifest_V3-blue.svg)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![React 18](https://img.shields.io/badge/Frontend-React_18-61dafb.svg)](https://react.dev/)
[![TypeScript 5](https://img.shields.io/badge/Language-TypeScript_5-3178c6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS 3](https://img.shields.io/badge/Styling-Tailwind_CSS_3-38bdf8.svg)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Backend-Express.js-000000.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248.svg)](https://www.mongodb.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-brightgreen.svg)](https://opensource.org/licenses/ISC)

> **SecondBrain V3** is an enterprise-grade knowledge management platform and **Manifest V3 Chrome Extension**. It enables users to capture, organize, summarize, and semantically search web links, articles, YouTube videos, and tweets seamlessly from their browser into a personal digital knowledge base.

![SecondBrain V3 Main Application Interface](frontend/public/home.png)
*Figure 1: SecondBrain V3 Web Application Dashboard featuring a clean dark mode UI, sidebar navigation, and AI vector search bar.*

---

## 🎯 Executive Overview

### The Problem
Modern internet users consume hundreds of articles, research papers, YouTube videos, and tweets daily. Knowledge is fragmented across browser bookmarks, reading lists, chat threads, and physical notes. Existing tools require manual copy-pasting, lack intelligent duplicate detection, fail when internet connection drops, and do not offer AI-assisted summarization or vector similarity search.

### The Solution
**SecondBrain V3** solves knowledge fragmentation by pairing a responsive React Web Application with a Manifest V3 Chrome Extension. Users can capture any tab with a single click or keyboard shortcut (`Ctrl+Shift+S`). The system automatically extracts OpenGraph metadata, checks for duplicates, queues items offline when network connection is unavailable, and synchronizes with a central Express/MongoDB backend equipped with OpenAI embeddings and Google Gemini summarization.

---

## 🖼️ Application Showcase

| Extension Popup Capture | Multi-Category Knowledge Grid |
| :---: | :---: |
| ![Extension Popup UI](frontend/public/extention.click.png) | ![Saved Links & Content Cards](frontend/public/links.png) |
| *One-click tab saver with metadata pre-filling & category picker* | *Responsive 3-column grid displaying links, tags, and domain badges* |

| YouTube AI Summarization | Main Web Application Dashboard |
| :---: | :---: |
| ![YouTube Video Cards & AI Summary](frontend/public/youtube.png) | ![Home Dashboard Overview](frontend/public/home.png) |
| *Embedded YouTube video player cards & AI transcript summarizer* | *Central knowledge repository with sidebar navigation and search* |

---

## ✨ Features

### 1. User Authentication
- **Purpose**: Authenticate users securely and preserve active session states.
- **Workflow**: User submits credentials via the Popup UI or Web App. The system calls `POST /api/v1/user/signin`, receives a JWT token, and stores it securely.
- **UX**: Smooth login/signup forms, inline validation, and automatic session restoration upon extension open.
- **Technical Implementation**: Handled in `AuthService` (`src/services/auth.ts`) and `useAuth` hook. Token is injected via Axios interceptors into all API calls.

### 2. Save Current Web Page
- **Purpose**: Capture active browser tab details without manual copy-pasting.
- **Workflow**: Opening the extension queries `chrome.tabs.query({ active: true, currentWindow: true })` and triggers content script metadata extraction.

![Extension Popup UI in Action](frontend/public/extention.click.png)
*Figure 2: Extension Popup capturing current page title, URL, category, tags, and optional notes.*

- **UX**: Shows a card preview displaying favicon, hostname, URL, pre-filled title, category picker, tag selector, and notes.
- **Technical Implementation**: Implemented in `SaveTabForm.tsx` and `useCurrentTab.ts`.

### 3. Automated Metadata Extraction
- **Purpose**: Extract high-fidelity metadata (OpenGraph tags, title, favicon, images).
- **Workflow**: The extension sends a runtime message `EXTRACT_METADATA` to `contentScript.ts`. The content script parses DOM meta tags (`og:title`, `og:description`, `og:image`, `og:type`, `twitter:title`, favicon links) and returns them to the popup.
- **UX**: Instant pre-filling of page title, description, and website hostname.
- **Technical Implementation**: `metadataExtractor.ts` running inside DOM context via `contentScript.ts`.

### 4. AI-Powered Summarization
- **Purpose**: Generate instant summaries of YouTube videos and long articles.
- **Workflow**: User clicks the "Summary" button on a video card. The request is routed to `POST /api/v1/content/summarize` which uses Google Gemini & YouTube Transcript API to fetch transcripts and summarize text.

![YouTube Video Summarization](frontend/public/youtube.png)
*Figure 3: Rich embedded YouTube video player cards with instant AI Summary modal.*

- **UX**: Animated spinner during AI processing; opens a clean modal displaying the generated summary.
- **Technical Implementation**: Reuses backend route `contentRouter.post("/summarize")` integrated with `ContentService.summarizeUrl()`.

### 5. Multi-Category Knowledge Grid
- **Purpose**: Classify content types for filtering and visual rendering.
- **Workflow**: Auto-detects URL patterns (`youtube.com` $\rightarrow$ `video`, `twitter.com`/`x.com` $\rightarrow$ `tweet`, image URLs $\rightarrow$ `image`, blog URLs $\rightarrow$ `article`, general URLs $\rightarrow$ `link`).

![Saved Links Grid View](frontend/public/links.png)
*Figure 4: Filtered view showing saved web bookmarks, domain badges, action buttons, and custom tags.*

- **UX**: Filter by category (Links, Videos, Tweets, Articles, Images) with responsive 3-column card alignment.
- **Technical Implementation**: `CardComponent.tsx` and `detectCategoryFromUrl()` utility function.

### 6. Offline Queue & Automatic Sync
- **Purpose**: Guarantee zero data loss when working offline or during server downtime.
- **Workflow**: If a network request fails or `navigator.onLine` is false, `OfflineService.enqueue()` saves the request payload into `chrome.storage.local`. When internet connection returns, `OfflineService.syncQueue()` automatically flushes the queue to the backend.
- **UX**: Top banner displays network status and pending item count (e.g. `Offline Mode (3 pending)`), with a manual "Sync Now" button.
- **Technical Implementation**: `OfflineService` (`src/services/offline.ts`), `useOfflineQueue` hook, `window.addEventListener('online')`, and background alarm sync.

### 7. Duplicate Detection
- **Purpose**: Prevent cluttering the database with duplicate URL entries.
- **Workflow**: On tab capture, the extension fetches existing user content from `GET /api/v1/user/contents?userID={id}` and compares normalized URLs.
- **UX**: Displays an amber warning banner: `Already saved in SecondBrain! Saved as: "..."`.
- **Technical Implementation**: `ContentService.checkDuplicate()` comparing sanitized URLs.

### 8. Tag Selector & Dynamic Creation
- **Purpose**: Organize content using tags.
- **Workflow**: Fetches existing global tags via `GET /api/v1/tag/alltags`. Allows multi-selecting tags or typing a new tag title which calls `POST /api/v1/tag/createtag`.
- **UX**: Interactive hashtag pills with instant creation input.
- **Technical Implementation**: `TagSelector.tsx` integrated with `ContentService`.

### 9. Context Menu Integration
- **Purpose**: Quick save without opening extension popup.
- **Workflow**: Right-clicking a page or link shows "Save to SecondBrain". The background service worker receives `chrome.contextMenus.onClicked`, extracts tab info, reads JWT, saves content, and triggers desktop notifications (`chrome.notifications`).
- **UX**: OS native desktop notification (`✔ Saved successfully: "..."`).
- **Technical Implementation**: `chrome.contextMenus.create` in `serviceWorker.ts`.

### 10. Global Keyboard Shortcut
- **Purpose**: Save current page instantly via keyboard.
- **Workflow**: User presses `Ctrl+Shift+S` (or `Cmd+Shift+S`). Chrome triggers `chrome.commands.onCommand`, caught in `serviceWorker.ts`.
- **UX**: Instant desktop notification feedback.
- **Technical Implementation**: Declared in `manifest.json` under `commands`.

---

## 🏗️ Architecture

```mermaid
graph TD
    User([User Browser Tab]) -->|Clicks Extension / Shortcut| PopupUI[Popup React App]
    User -->|Right-Click Context Menu| ServiceWorker[Background Service Worker]
    User -->|Key Command Ctrl+Shift+S| ServiceWorker

    PopupUI -->|Send Message EXTRACT_METADATA| ContentScript[Content Script DOM]
    ContentScript -->|Return Title / OpenGraph / Favicon| PopupUI

    PopupUI -->|Axios REST Requests| APILayer[API Service Layer]
    ServiceWorker -->|Fetch REST Requests| APILayer

    APILayer -->|Online Network Check| ExpressBackend[Express.js Backend API]
    APILayer -->|Network Failure / Offline| StorageQueue[chrome.storage.local Queue]
    StorageQueue -->|Auto-Sync on Network Return| ExpressBackend

    ExpressBackend -->|Mongoose ODM| MongoDB[(MongoDB Database)]
    ExpressBackend -->|Generate Vector Embeddings| OpenAI[OpenAI API]
    ExpressBackend -->|Transcripts & Summaries| Gemini[Google Gemini AI]
```

### Component Responsibilities

| Component | Responsibility |
| :--- | :--- |
| **Popup UI (`src/popup`)** | Main interactive React application for authentication, metadata confirmation, category selection, tag picking, and saving. |
| **Background Service Worker (`src/background`)** | Persistent event handler for context menus, keyboard command shortcuts, desktop notifications, and periodic alarm-based sync. |
| **Content Script (`src/content`)** | Injected script running in the active tab context; extracts DOM metadata (OpenGraph tags, page title, favicon, meta descriptions). |
| **API Service Layer (`src/services`)** | Modular Axios clients with JWT headers, error handling, tag management, and content creation logic. |
| **Storage Engine (`src/storage`)** | Type-safe wrapper around `chrome.storage.local` with fallback to `localStorage` for development environments. |
| **Backend API (`/backend`)** | Node/Express server implementing authentication middleware, content CRUD endpoints, search, and AI processing. |

---

## 📁 Project Structure

```text
SecondBrain-V3/
├── backend/                             # Express REST API Server
│   ├── src/
│   │   ├── ai/                          # AI service wrappers (OpenAI embeddings, Gemini summaries)
│   │   ├── config/                      # Database configuration (Mongoose connection setup)
│   │   ├── db/                          # Database schemas (User, Content, Tag, Link)
│   │   ├── middleware/                  # JWT auth verification middleware
│   │   ├── routes/                      # Express routers (user, content, tags, brain share)
│   │   └── index.ts                     # Application bootstrap & CORS configuration
│   ├── .env.example                     # Environment variables schema template
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                            # React Web Application
│   ├── public/                          # Static assets and project screenshots
│   │   ├── extention.click.png          # Screenshot: Chrome Extension Popup UI
│   │   ├── home.png                     # Screenshot: Web App Main Dashboard
│   │   ├── links.png                    # Screenshot: Saved Links & Content Cards Grid
│   │   └── youtube.png                  # Screenshot: Embedded YouTube Cards & AI Summary
│   ├── src/
│   │   ├── components/                  # CardComponent, Dashboard, Forms, Layouts
│   │   ├── pages/                       # Login, Signup, Home, Landing, Share pages
│   │   ├── store/                       # Redux Toolkit store & slices
│   │   └── utils/                       # Route API endpoints configuration
│   ├── package.json
│   └── vite.config.ts
│
└── frontend/chrome-extension/           # Manifest V3 Chrome Extension
    ├── manifest.json                    # Extension manifest V3 specification
    ├── index.html                       # Popup UI HTML template
    ├── options.html                     # Options Page HTML template
    ├── vite.config.ts                   # Multi-page Rollup bundler & asset copy plugin
    ├── tailwind.config.js               # Tailwind CSS theme configuration
    ├── postcss.config.js                # PostCSS build config
    ├── generate_icons.js                # Script generating PNG icon placeholders
    ├── src/
    │   ├── assets/                      # Extension icons (16x16, 32x32, 48x48, 128x128)
    │   ├── background/                  # Service worker (Context menus, shortcuts, alarms)
    │   ├── content/                     # Content script (DOM OpenGraph metadata extractor)
    │   ├── hooks/                       # Custom hooks (useAuth, useCurrentTab, useOfflineQueue)
    │   ├── options/                     # Extension Settings React page
    │   ├── popup/                       # Extension Popup React UI components
    │   ├── services/                    # Extension API client, Auth & Offline sync queue
    │   ├── storage/                     # chrome.storage.local type-safe wrapper
    │   ├── types/                       # Shared TypeScript interfaces
    │   └── utils/                       # Metadata extractor & category detector
    ├── package.json
    └── README.md
```

---

## 💻 Technology Stack

### Frontend & Chrome Extension

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **React** | `18.3.1` | UI Component Framework |
| **TypeScript** | `5.6.2` | Type Safety & Interfaces |
| **Tailwind CSS** | `3.4.17` | Utility-First Styling & Dark Mode |
| **Vite** | `6.0.5` | Bundler & Build Tool |
| **Axios** | `1.7.9` | HTTP Client |
| **Lucide React** | `0.469.0` | UI Icons |

### Backend & Database

| Technology | Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | `>=18.0.0` | JavaScript Runtime |
| **Express.js** | `4.21.2` | Web Framework |
| **MongoDB / Mongoose** | `8.9.0` | NoSQL Database & ODM |
| **JWT (jsonwebtoken)** | `9.0.2` | Authentication Tokens |
| **bcryptjs** | `2.4.3` | Password Hashing |
| **Zod** | `3.24.1` | Request Body Validation |

### Chrome APIs

| API | Extension Purpose |
| :--- | :--- |
| **`chrome.tabs`** | Query active tab URL, title, and favicon |
| **`chrome.storage.local`** | Secure token, user session, and offline queue storage |
| **`chrome.runtime`** | Cross-script message passing and options page navigation |
| **`chrome.contextMenus`** | Right-click context menu "Save to SecondBrain" |
| **`chrome.commands`** | Keyboard shortcut listener (`Ctrl+Shift+S`) |
| **`chrome.alarms`** | Periodic background offline queue synchronization |
| **`chrome.notifications`** | OS desktop feedback notifications |
| **`chrome.action`** | Browser toolbar icon & popup trigger |

---

## 🔄 Extension Workflow

```text
User Presses Ctrl+Shift+S / Click Save
   │
   ▼
Check Auth State (chrome.storage.local) ───[Unauthenticated]───► Render LoginForm
   │ [Authenticated]
   ▼
Extract Tab Metadata (chrome.tabs + ContentScript)
   │ (URL, Title, Favicon, Hostname, OpenGraph tags)
   ▼
Run Duplicate Detection Check (GET /api/v1/user/contents)
   │
   ├──────[URL Exists]────────► Display Duplicate Warning Banner
   │
   ▼
Auto-Detect Category (video / tweet / article / image / link)
   │
   ▼
User Edits Title / Tags / Notes / Clicks "AI Summarize"
   │
   ▼
Click "Save to SecondBrain"
   │
   ├───[Network Available]────► POST /api/v1/content/create ──► Show "✔ Saved Successfully"
   │
   └───[Network Unavailable]──► Enqueue to chrome.storage.local ──► Show "Offline Saved"
                                      │
                                      ▼
                               Auto-Sync when Internet Returns
```

---

## 📥 Installation & Setup

### 1. Prerequisites
- **Node.js**: v18+ or v20+ LTS
- **npm**: v9+ or v10+
- **MongoDB**: Running instance locally or via MongoDB Atlas

### 2. Repository Setup

```bash
# Clone repository
git clone https://github.com/amangupta20044/SecondBrain-V3-main.git
cd SecondBrain-V3-main
```

### 3. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Configure `backend/.env`:
```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/secondbrain
USER_JWT_SECRET=super_secret_jwt_key_change_in_production
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_google_gemini_api_key_here
SHARABLE_LINK_HOST=http://localhost:3000
```

Start backend development server:
```bash
npm run dev
```

### 4. Web Application Setup

```bash
# Open new terminal
cd frontend
npm install
npm run dev
```
> Access the web application in your browser at `http://localhost:5173`.

### 5. Chrome Extension Setup & Loading

```bash
# Open new terminal
cd frontend/chrome-extension
npm install
npm run build
```

#### Load Unpacked Extension into Chrome:
1. Open Google Chrome and navigate to `chrome://extensions`.
2. Enable **Developer mode** (top-right toggle).
3. Click **Load unpacked** (top-left button).
4. Select directory: `D:\SecondBrain\SecondBrain-V3-main\frontend\chrome-extension\dist`.
5. Pin the **SecondBrain** icon to your toolbar.

---

## 🔌 API Integration

### 1. User Signin
- **Method**: `POST`
- **Endpoint**: `/api/v1/user/signin`
- **Auth Required**: No
- **Request Body**:
```json
{
  "username": "alex",
  "password": "Password123!"
}
```
- **Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65b2a1f8e4b0123456789abc",
    "username": "alex",
    "email": "alex@example.com"
  }
}
```

### 2. Save Content
- **Method**: `POST`
- **Endpoint**: `/api/v1/content/create`
- **Auth Required**: Yes (`Authorization: <token>`)
- **Request Body**:
```json
{
  "link": "https://github.com",
  "type": "link",
  "title": "GitHub: Where the world builds software",
  "description": "Saved via SecondBrain Chrome Extension",
  "tags": ["65b2a222e4b0123456789def"],
  "userId": "65b2a1f8e4b0123456789abc"
}
```
- **Response**:
```json
{
  "message": "Content created",
  "content": {
    "_id": "65b2a333e4b0123456789ghi",
    "link": "https://github.com",
    "type": "link",
    "title": "GitHub: Where the world builds software",
    "description": "Saved via SecondBrain Chrome Extension",
    "tags": ["65b2a222e4b0123456789def"],
    "date": 1770281400000,
    "userId": "65b2a1f8e4b0123456789abc"
  }
}
```

### 3. Fetch User Contents
- **Method**: `GET`
- **Endpoint**: `/api/v1/user/contents?userID=65b2a1f8e4b0123456789abc`
- **Auth Required**: Yes (`Authorization: <token>`)
- **Response**:
```json
[
  {
    "_id": "65b2a333e4b0123456789ghi",
    "link": "https://github.com",
    "type": "link",
    "title": "GitHub",
    "description": "Saved link",
    "tags": [{ "_id": "65b2a222e4b0123456789def", "title": "coding" }]
  }
]
```

### 4. AI Summarization
- **Method**: `POST`
- **Endpoint**: `/api/v1/content/summarize`
- **Auth Required**: Yes
- **Request Body**: `{ "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ" }`
- **Response**: `{ "data": "Summary text generated by AI..." }`

---

## 🔒 Security Architecture

1. **JWT Storage**: JWT tokens are stored securely inside Chrome's isolated `chrome.storage.local` engine and never written to cookies or unencrypted local storage.
2. **Dynamic CORS Whitelisting**: `backend/src/index.ts` validates incoming origin headers and explicitly permits `chrome-extension://` protocol origins.
3. **Manifest V3 Content Security Policy (CSP)**: Disallows inline scripts, evaluated strings (`eval`), and remote script loading.
4. **Input Validation**: All user inputs undergo Zod schema parsing before database queries.

---

## 📶 Offline Queue Architecture

```text
       [Network Failure / Offlining Detected]
                         │
                         ▼
        OfflineService.enqueue(savePayload)
                         │
                         ▼
     Payload persisted to chrome.storage.local
                         │
                         ▼
      User notified: "Saved to Offline Queue"
                         │
                         ▼
       [Network Connectivity Restored]
                         │
                         ▼
        OfflineService.syncQueue() triggers
                         │
                         ▼
     Payloads pushed to POST /api/v1/content/create
                         │
                         ▼
      Queue cleared & Desktop notification sent
```

---

## ❓ Troubleshooting

<details>
<summary><b>1. Extension Not Loading in Chrome</b></summary>
Ensure you clicked <b>Load unpacked</b> and selected the <code>dist</code> folder inside <code>frontend/chrome-extension/dist</code>, not the main project root folder.
</details>

<details>
<summary><b>2. AxiosError 500 on Content Save</b></summary>
Ensure MongoDB is running locally or your <code>MONGO_URI</code> is reachable in <code>backend/.env</code>.
</details>

<details>
<summary><b>3. CORS Request Blocked</b></summary>
Verify your backend is running and `backend/src/index.ts` allows `chrome-extension://` origins.
</details>

---

## 🗺️ Roadmap

- [x] Manifest V3 Extension Architecture
- [x] Automated OpenGraph Metadata Extraction
- [x] Offline Queue & Auto-Sync
- [x] Duplicate URL Detection
- [x] AI YouTube & Article Summarizer
- [ ] Firefox WebExtension Compatibility
- [ ] Full-text OCR on image attachments

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
