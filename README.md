# 🧠 SecondBrain V3

> A modern, full-stack knowledge management platform and **Manifest V3 Chrome Extension** that empowers users to save, categorize, summarize, and semantically search web links, articles, videos, and tweets in one unified second brain.

---

## 📐 System Architecture

```text
┌─────────────────────────┐          ┌───────────────────────────┐
│   Chrome Extension      │          │     Web Application       │
│   (Manifest V3 CRX)     │          │    (React + Vite SPA)    │
└────────────┬────────────┘          └─────────────┬─────────────┘
             │                                     │
             │         HTTP REST / JSON            │
             └──────────────────┬──────────────────┘
                                │
                                ▼
                   ┌──────────────────────────┐
                   │    Express.js Backend    │
                   │   (Node.js + TypeScript) │
                   └────────────┬─────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│ MongoDB Atlas │       │   OpenAI API  │       │ Google Gemini │
│  (Database)   │       │  (Embeddings) │       │ (AI Summary)  │
└───────────────┘       └───────────────┘       └───────────────┘
```

---

## 🛠️ Technology Stack

### **Frontend Web App (`/frontend`)**
- **Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion, Lucide Icons, Glassmorphism UI
- **State & Routing**: Redux Toolkit, React Router v7
- **Networking**: Axios

### **Chrome Extension (`/frontend/chrome-extension`)**
- **Architecture**: Manifest V3, Service Worker, Content Script Injection
- **UI & Build**: React 18, TypeScript, Tailwind CSS, Vite Bundle Generator
- **Storage & Offlining**: `chrome.storage.local`, Custom Offline Queue with Auto-Sync

### **Backend API (`/backend`)**
- **Framework**: Node.js, Express.js, TypeScript
- **Database & ODM**: MongoDB, Mongoose
- **Security & Auth**: JSON Web Tokens (JWT), bcryptjs, CORS
- **Validation**: Zod schema validation
- **AI Integrations**: OpenAI Text Embeddings (`text-embedding-3-small`), Google Gemini AI, YouTube Transcript API

---

## 📂 Project Directory Structure

```text
SecondBrain-V3/
├── backend/                         # Express.js REST API Server
│   ├── src/
│   │   ├── ai/                      # AI integration (OpenAI embeddings & YouTube transcript summarizer)
│   │   ├── config/                  # Database connection setup (Mongoose)
│   │   ├── db/                      # Database models (User, Content, Tag, Link)
│   │   ├── middleware/              # JWT authorization & request middleware
│   │   ├── routes/                  # API routers (User, Content, Tag, Brain Share)
│   │   └── index.ts                 # Express server bootstrap & CORS configuration
│   ├── .env.example                 # Environment variables template
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                        # React Web Application
│   ├── src/
│   │   ├── assets/                  # Graphics and visual media
│   │   ├── components/              # CardComponent, Dashboard, Forms, UI Elements
│   │   ├── data/                    # Static mock data & constants
│   │   ├── pages/                   # Home, Login, Signup, SharePage, Landing
│   │   ├── store/                   # Redux Toolkit slices
│   │   ├── utils/                   # Route API endpoints configuration
│   │   └── main.tsx                 # React entry point
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
│
└── frontend/chrome-extension/       # Downloadable Manifest V3 Chrome Extension
    ├── manifest.json                # Chrome extension manifest v3 configuration
    ├── index.html                   # Extension Popup UI entry
    ├── options.html                 # Extension Settings Page entry
    ├── vite.config.ts               # Multi-input extension bundler & asset copy plugin
    ├── src/
    │   ├── assets/                  # Extension icons (16x16, 32x32, 48x48, 128x128)
    │   ├── background/              # Service worker (Context menus, shortcuts, alarms)
    │   ├── content/                 # Content script (OpenGraph & DOM metadata parser)
    │   ├── hooks/                   # Custom hooks (useAuth, useCurrentTab, useOfflineQueue)
    │   ├── options/                 # Extension Settings React page
    │   ├── popup/                   # Extension Popup React UI components
    │   ├── services/                # Extension API client, Auth & Offline sync queue
    │   ├── storage/                 # chrome.storage.local wrapper
    │   ├── types/                   # Shared TypeScript interfaces
    │   └── utils/                   # Metadata extraction & category detector
    ├── package.json
    └── README.md
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js**: `v18.x` or `v20.x` LTS
- **npm**: `v9.x` or `v10.x`
- **MongoDB**: Local MongoDB instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster URI

---

### 2. Environment Setup

Create a `.env` file inside the `backend/` directory:

```bash
cd backend
cp .env.example .env
```

Configure your `backend/.env` file:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/secondbrain
USER_JWT_SECRET=super_secret_jwt_key_change_in_production
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_google_gemini_api_key_here
SHARABLE_LINK_HOST=http://localhost:3000
```

---

### 3. Backend API Installation & Running

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start development server with hot-reload
npm run dev
```
> The API server will start at `http://localhost:3000`. Test health status at `http://localhost:3000/check`.

---

### 4. Frontend Web App Installation & Running

```bash
# Open a new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
> Access the web application in your browser at `http://localhost:5173`.

---

### 5. Chrome Extension Setup & Installation

```bash
# Open a new terminal and navigate to chrome-extension
cd frontend/chrome-extension

# Install extension dependencies
npm install

# Build production extension package
npm run build
```

#### Loading Unpacked Extension into Chrome:
1. Open Google Chrome and navigate to `chrome://extensions`.
2. Enable **Developer mode** in the top-right corner.
3. Click **Load unpacked** in the top-left corner.
4. Select the directory:
   `d:\SecondBrain\SecondBrain-V3-main\frontend\chrome-extension\dist`
5. Pin the **SecondBrain** icon to your browser toolbar!

---

## 📡 API Reference Endpoint Specification

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/user/signup` | No | User registration with email, username, and password |
| `POST` | `/api/v1/user/signin` | No | User login; returns JWT token & user profile |
| `GET` | `/api/v1/user/contents` | Yes | Retrieves saved contents for authenticated user |
| `POST` | `/api/v1/content/create` | Yes | Saves new web page, article, video, or tweet |
| `DELETE` | `/api/v1/content/remove` | Yes | Deletes content item by ID |
| `POST` | `/api/v1/content/search` | Yes | Vector similarity search on saved items |
| `POST` | `/api/v1/content/summarize` | Yes | AI-assisted YouTube transcript summarization |
| `GET` | `/api/v1/tag/alltags` | No | Fetches available global tags |
| `POST` | `/api/v1/tag/createtag` | Yes | Dynamically creates a new tag |
| `POST` | `/api/v1/brain/share` | Yes | Generates or disables a shareable brain link |
| `GET` | `/api/v1/brain/share/:hash` | No | Public endpoint to view a shared brain collection |

---

## 🧩 Chrome Extension Features

- **One-Click Tab Saver**: Automatically extracts page title, favicon, hostname, URL, and OpenGraph metadata.
- **Category Classification**: Classifies items into `Link`, `Article`, `Video`, `Tweet`, or `Custom`.
- **Right-Click Context Menu**: Select **"Save to SecondBrain"** on any webpage.
- **Keyboard Command**: Press **`Ctrl + Shift + S`** (or `Cmd + Shift + S` on macOS).
- **Offline Queue & Auto-Sync**: Enqueues saves in `chrome.storage.local` when offline and automatically syncs when internet returns.
- **Settings Page**: Configurable backend URL host, theme switcher (Dark/Light/System), and local data management.

---

## 🏗️ Production Build Commands

```bash
# Build Backend TypeScript project
cd backend
npm run build
npm start

# Build Web Application production bundle
cd frontend
npm run build
npm run preview

# Build Chrome Extension production bundle
cd frontend/chrome-extension
npm run build
```

---

## 📄 License

This project is released under the [ISC License](LICENSE).
