# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `npm run dev` - Start development server (Next.js)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run Next.js linting

### Development Server
The app runs on Next.js development server. Use `npm run dev` to start development with hot reload.

## Architecture Overview

### Stack & Dependencies
- **Framework**: Next.js 15.4.4 (App Router)
- **UI Components**: Radix UI primitives + Shadcn/ui + Magic UI
- **Styling**: Tailwind CSS v4 with custom animations
- **State Management**: Zustand (configured but not actively used)
- **Authentication**: Supabase with Google OAuth
- **Database**: MongoDB with Mongoose ODM
- **Icons**: Lucide React
- **Date Handling**: date-fns with Korean locale support
- **Animations**: Motion library

### Project Structure

#### App Router Structure (`src/app/`)
- **Root Layout**: `layout.jsx` - Global layout with fonts
- **Landing Page**: `page.jsx` - Root landing page
- **Authentication**: `login/` - Login page with Supabase Google OAuth
- **Main App**: `(main)/` - Protected routes with shared layout
  - `Header.jsx` - Main navigation header
  - `todo/page.jsx` - Todo list page with CRUD operations
  - `calendar/page.jsx` - Calendar view with monthly statistics
- **Auth Callback**: `auth/callback/route.js` - OAuth callback handler
- **API Routes**: `api/todos/` - REST API endpoints for todo CRUD operations
  - `route.js` - Main CRUD endpoints (GET, POST)
  - `[id]/route.js` - Individual todo operations (GET, PUT, DELETE, PATCH)
  - `list/route.js` - Optimized list endpoint with smart sorting
  - `calendar/route.js` - Calendar-specific data with date grouping

#### Component Architecture (`src/components/`)
- **TodoItem.jsx** - Reusable todo item with edit dialog and delete confirmation
- **SettingsModal.jsx** - User settings and account management modal
- **UI Components** (`ui/`) - Shadcn/ui components (buttons, dialogs, cards, etc.)
- **Magic UI** (`magicui/`) - Custom animated components (NumberTicker)

#### Data Models (`src/models/`)
- **Todo.js** - Mongoose schema with user isolation, soft deletion, and performance indexing

#### Core Libraries (`src/lib/`)
- **Supabase Clients**:
  - `client.js` - Browser client for client-side operations
  - `server.js` - Server client with cookie handling
  - `middleware.js` - Session management middleware
- **Database & API**:
  - `mongodb.js` - MongoDB connection with caching and error handling
  - `api.js` - Client-side API functions for todo CRUD operations
  - `validation.js` - Input validation utilities
  - `errors.js` - Error handling utilities
- **Utilities**:
  - `utils.js` - Tailwind class merging utilities
  - `dateUtils.js` - Calendar date calculation utilities

### Authentication & Middleware
- **Middleware**: `src/middleware.js` manages session state across protected routes
- **Protected Routes**: `/todo`, `/calendar` require authentication
- **OAuth Flow**: Google login via Supabase with callback handling

### Data Flow & State Management
- **Backend Database**: MongoDB with Mongoose ODM for data persistence
- **API Layer**: REST API endpoints in `src/app/api/todos/` with comprehensive route handlers
- **Client API**: `src/lib/api.js` provides client-side API functions for CRUD operations
- **State Management**: Component-level React state with hooks (Zustand configured but not actively used)
- **Data Models**: `src/models/Todo.js` defines schema with user isolation and soft deletion

### UI Design System
- **Korean Language**: All user-facing text in Korean as per project requirements
- **Responsive Design**: Mobile-first approach with Tailwind
- **Component Library**: Consistent design using Radix UI + custom styling
- **Calendar Features**: 
  - Monthly view with statistics
  - Color-coded todos (completed/pending/overdue)
  - Date-based todo filtering and display

### Key Features
1. **Todo Management**: Add, edit, delete, complete todos with date/time selection
2. **Calendar View**: Monthly calendar with todo visualization and statistics
3. **Authentication**: Google OAuth via Supabase
4. **Real-time Updates**: Prepared for live data synchronization
5. **Korean Localization**: Date formatting and UI text in Korean

### Security Implementation
- **Authentication**: Supabase OAuth integration with session management
- **Authorization**: User-scoped data access with userId filtering
- **Input Validation**: Comprehensive data validation and sanitization
- **Error Handling**: Standardized error responses preventing information leakage
- **NoSQL Injection Prevention**: Mongoose ODM with parameterized queries
- **Logging Security**: Production-safe logging with sensitive data masking
- **Environment Protection**: Sensitive credentials in environment variables

### Development Notes
- All user-facing messages and comments should be in Korean
- Component architecture follows React patterns with hooks
- Production-ready MongoDB integration with security best practices
- Uses Next.js App Router with server/client component separation

## Environment Variables and Configuration

### Environment Variable Management
- When using environment variables with `NEXT_PUBLIC_` prefix:
  - For client-side accessible variables: Keep `NEXT_PUBLIC_` prefix
  - For server-side only variables: Remove `NEXT_PUBLIC_` prefix
  - `NEXT_PUBLIC_SITE_URL` should remain with prefix if used in actions or client-side code