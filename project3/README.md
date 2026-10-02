# Project 3: AI Agent Chat Assistant

An intelligent, full-stack AI chat assistant web application designed to help developers and users with code development, debugging, system architecture, and technical learning.

Powered by Next.js App Router, React 19, Tailwind CSS, and the Google Gemini API (`@google/genai`).

---

## 🌟 Key Features

- **Google Gemini API Integration**: Real-time streaming responses powered by Gemini 2.5 Flash, Gemini 2.5 Pro, Gemini 1.5 Flash, and Gemini 1.5 Pro.
- **Interactive Markdown & Code Blocks**:
  - Full GitHub-Flavored Markdown (GFM) support.
  - Syntax-highlighted code blocks with programming language badges and one-click copy to clipboard.
  - Tables, blockquotes, numbered/bulleted lists, and inline code formatting.
- **Multiple Specialized Personas**:
  - **Full-Stack Coding Copilot**: Best practices, TypeScript, Next.js, and clean code generation.
  - **Bug Hunter & Debugger**: Analyzes stack traces, hydration issues, and runtime exceptions.
  - **System Architect & Advisor**: Database schemas, system design, and API trade-offs.
  - **Friendly Tech Guide**: Clear, jargon-free explanations of complex concepts.
- **Multi-Session Management**:
  - Create and switch between multiple conversations.
  - Auto-generated conversation titles based on query content.
  - Persistent state in browser storage (`localStorage`).
  - Delete individual chats or clear history.
- **Interactive Settings & Demo Mode**:
  - Configurable Gemini API Key via UI modal or `.env.local`.
  - Built-in graceful offline/demo preview mode if no API key is provided immediately.
  - Temperature / creativity slider and custom system prompt overrides.

---

## 🚀 Getting Started

### 1. Installation

Navigate into the `project3` folder:
```bash
cd project3
npm install
```

### 2. Environment Configuration (Optional)

You can set your Gemini API key in `.env.local` or enter it directly in the app's settings UI:
```bash
cp .env.example .env.local
```
Edit `.env.local`:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```
*(Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey))*

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## 📁 Project Architecture

```
project3/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   │   └── route.ts         # Gemini API streaming & fallback handler
│   │   │   └── health/
│   │   │       └── route.ts         # Server health & key detection check
│   │   ├── globals.css              # Custom styling & scrollbars
│   │   ├── layout.tsx               # Root HTML & dark theme wrapper
│   │   └── page.tsx                 # Main application view
│   ├── components/
│   │   ├── ChatInterface.tsx        # Central chat manager with streaming logic
│   │   ├── ChatInput.tsx            # Auto-growing input & action controls
│   │   ├── ChatMessageItem.tsx      # Individual message bubble with copy & avatars
│   │   ├── Header.tsx               # Top navbar, persona badge & API key indicator
│   │   ├── MarkdownRenderer.tsx     # Markdown & syntax-highlighted code blocks
│   │   ├── QuickPrompts.tsx         # Suggested prompt starter cards
│   │   ├── SettingsModal.tsx        # API key, model & persona configuration modal
│   │   └── Sidebar.tsx              # Conversation history & persona switcher
│   ├── lib/
│   │   ├── defaultPrompts.ts        # Persona definitions & model metadata
│   │   └── storage.ts               # LocalStorage utilities & session factory
│   └── types/
│       └── chat.ts                  # TypeScript interfaces for messages, sessions & configs
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```
