# Overview

This is an AI chat assistant application built with Next.js 15 and the assistant-ui library. The application provides a conversational interface with multiple AI models, featuring a thread-based chat system with model selection capabilities. Users can interact with various free AI models through OpenRouter, with support for markdown rendering, code syntax highlighting, and file attachments.

## Recent Changes

### October 18, 2025
- **Custom API Key Support**: Users can now use their own OpenRouter API keys
  - **Custom Model Dialog**: Interactive dialog to enter and manage personal API keys
  - **Visual Feedback**: "Active" indicator in model selector when custom key is set
  - **Secure Storage**: API keys stored only in browser localStorage, never sent to our servers
  - **Reactive Updates**: Automatic UI updates when keys are added/removed via custom events
  - **Custom Model Selection**: Optional custom model ID field for accessing any OpenRouter model
  - **Privacy-First**: Keys used only for direct OpenRouter API calls from the browser
  - By default, uses the application's OpenRouter API key for free models
- **Automatic Chat Title Generation**: AI-powered auto-titling feature (ChatGPT-style)
  - Automatically generates concise titles (5-7 words) from the first user message
  - Uses Mistral Small 3.1 free model via `/api/generate-title` endpoint
  - **localStorage-based persistence** - works without authentication or sign-in
  - **Reactive updates** - sidebar updates instantly via custom event system
  - Dual-component architecture: `AutoTitleGenerator` (generates) + `AutoNameThreadItem` (displays)
  - Thread-aware state management - each new thread gets independent title generation
  - Graceful error handling with automatic retries on failures

### October 17, 2025
- **Migrated from Vercel to Replit**: Configured Next.js to run on Replit with proper port (5000) and host (0.0.0.0) binding
- **Switched from OpenAI to OpenRouter**: Replaced `@ai-sdk/openai` with `@openrouter/ai-sdk-provider`
- **Added Model Selector UI**: Created interactive dropdown showing 8 free OpenRouter models (fixed mobile responsiveness)
- **Firebase Authentication**: Integrated Firebase Auth with email/password and Google sign-in
- **User Profile System**: Added user profile display in sidebar with sign in/out functionality
- **Chat History Storage**: Implemented Firestore-based chat history persistence
- **Environment Configuration**: Using `.env` for API key storage (gitignored for security)
- **Deployment Ready**: Configured autoscale deployment for production

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: Next.js 15 with App Router and React Server Components (RSC)
- Uses the modern Next.js App Router architecture with TypeScript
- Implements client-side state management with Zustand for chat runtime
- Turbopack enabled for faster development builds

**UI Component System**: 
- Built on Radix UI primitives for accessible, unstyled components
- Shadcn/ui component library with "new-york" style preset
- Tailwind CSS v4 for styling with custom design tokens
- Framer Motion for animations and transitions

**Chat Interface Architecture**:
- **assistant-ui**: Core chat functionality with React hooks and primitives
- **Thread-based conversations**: Multiple conversation threads with persistence
- **Automatic title generation**: AI-powered auto-titling from first user message (like ChatGPT)
- **Model switching**: Dynamic model selection from free OpenRouter models
- **Custom API Keys**: Users can bring their own OpenRouter keys for unlimited access
- **Markdown rendering**: Full markdown support with syntax highlighting via react-shiki
- **Attachment support**: File upload and display capabilities
- **Responsive design**: Mobile-first with collapsible sidebar navigation

## Backend Architecture

**API Layer**:
- Next.js API Routes (App Router convention)
- `/api/chat` endpoint handles all chat interactions with streaming responses
- `/api/generate-title` endpoint generates concise chat titles using AI
- `/api/models` endpoint provides available model list

**AI Integration**:
- Primary provider: OpenRouter via `@openrouter/ai-sdk-provider`
- Vercel AI SDK for model abstraction and streaming
- Support for multiple free AI models (DeepSeek, Llama, Venice, etc.)
- Model configuration stored in `/lib/free-models.ts`

**Authentication & Data Persistence**:
- **Firebase Authentication**: Email/password and Google OAuth sign-in
- **User Context**: React Context API (`AuthContext`) for auth state management
- **Firestore Database**: Chat history and thread storage per user
- **Chat History Service**: CRUD operations in `/lib/chatHistory.ts`
- **User Profile**: Display in sidebar with avatar and sign out capability
- **Title Storage**: localStorage-based persistence in `/lib/titleStorage.ts` (works without authentication)
- **Custom API Key Storage**: localStorage-based storage in `/lib/customApiKey.ts` (browser-only, secure)
- **Custom Event System**: 'chat-title-updated' and 'customApiKeyUpdated' events for reactive UI updates across components

**State Management**:
- Client-side: Zustand for runtime state
- Chat runtime: `@assistant-ui/react-ai-sdk` with `useChatRuntime` hook
- Thread management: Built into assistant-ui primitives
- Auth state: Firebase `onAuthStateChanged` listener

## External Dependencies

**AI Services**:
- **OpenRouter**: Primary AI model provider
  - API endpoint for model inference
  - Supports 8 free tier models: DeepSeek R1, DeepSeek V3, Llama 4 Maverick, Venice Uncensored, Kimi VL, Mistral Small 3.1, NVIDIA Nemotron
  - Requires `OPENROUTER_API_KEY` environment variable
  - Free models list maintained in `/lib/free-models.ts`

**Third-party Libraries**:
- **Vercel AI SDK (`ai`)**: Model abstraction and streaming utilities
- **assistant-ui**: Complete chat UI framework with React primitives
- **Radix UI**: Headless UI components (Dialog, Tooltip, Separator, Avatar, Slot)
- **Framer Motion**: Animation library for smooth transitions
- **react-shiki**: Code syntax highlighting in markdown
- **remark-gfm**: GitHub Flavored Markdown support
- **Lucide React**: Icon library

**Development Tools**:
- **TypeScript**: Type safety across the application
- **ESLint**: Code linting with Next.js config
- **Prettier**: Code formatting with Tailwind plugin
- **Tailwind CSS v4**: Utility-first CSS framework

**Replit Environment Setup**:
- **Package Manager**: pnpm (installed globally)
- **Node.js**: Version 20
- **Port Configuration**: 5000 with 0.0.0.0 host binding for Replit compatibility
- **Environment Variables**:
  - Development: `.env` file (gitignored, see `.env.example` for template)
  - Production: Set `OPENROUTER_API_KEY` in Replit Secrets
- **Deployment**: Autoscale deployment configured with `pnpm run build` → `pnpm run start`
- **Dev Server**: `pnpm run dev` with Turbopack enabled