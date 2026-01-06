# Coesya Native - Project Analysis

## Overview

**Coesya** is a family chore management mobile application built with React Native and Expo. The app allows families to create collaborative environments, assign household tasks (chores), track completions, and manage family members. It's designed as a multi-user platform where family members can see shared responsibilities and track what has been completed.

**Primary Market**: Italian-speaking users (based on UI localization)

---

## Application Purpose

Coesya enables families to:
- Create or join family groups using invitation codes
- Assign household chores with priorities, frequencies, and categories
- Track which chores are pending vs. completed
- View completion history and family member contributions
- Collaborate on household responsibilities in a structured way

---

## Main Features and Functionality

### Family Management
- Create new families with custom names
- Join existing families using invitation codes
- View family members and their information
- Upload family profile photos
- Manage family settings and information
- Display current active family
- Generate and share family invitation codes

### Chore/Task Management
- Create, read, update, and delete household chores
- Set chore frequency: daily, weekly, monthly, semiannual
- Assign priority (1-5) and weight/importance (1-5)
- Categorize chores with icons (categories fetched from backend)
- Mark chores as completed
- Track chore completion history
- View pending chores and completed tasks
- Filter and organize chores by various criteria

### User Authentication
- Email/password login and registration
- Secure token-based authentication (JWT-like)
- User profile management
- Multi-family support per user
- Session persistence with secure storage
- Automatic session restoration on app launch

### User Account Features
- View and edit user profile
- Manage notification preferences
- View privacy policy and terms
- Reset user data
- Logout functionality

### Dashboard & Social Features
- Home screen showing pending family chores
- Display of recently completed chores
- Goals/achievements tab (placeholder for future features)
- Notifications system

---

## Technology Stack

### Core Framework
- **React Native** 0.81.5 - Cross-platform mobile framework
- **Expo** ~54.0.27 - Development platform and managed services
- **React** 19.1.0 - UI library
- **TypeScript** ~5.9.2 - Type safety

### Navigation
- **@react-navigation/native** v7.1.25 - Navigation foundation
- **@react-navigation/native-stack** v7.8.6 - Stack navigator
- **@react-navigation/bottom-tabs** v7.8.12 - Tab navigation
- **@react-navigation/drawer** v7.7.9 - Drawer/sidebar navigation

### State Management
- **Zustand** 5.0.9 - Lightweight state management library
- Separate stores for:
  - Authentication (`authStore.ts`)
  - Chores (`choreStore.ts`)
  - Families (`familyStore.ts`)
  - Categories (`categoryStore.ts`)
  - Notifications (`notificationStore.ts`)

### Styling & UI
- **NativeWind** 4.2.1 - Tailwind CSS for React Native
- **expo-linear-gradient** v15.0.8 - Gradient backgrounds
- **@expo/vector-icons** v15.0.3 - Icon library (Ionicons)
- **@expo-google-fonts/inter** - Inter font family (400, 500, 600, 700 weights)
- Custom CSS classes in `src/global.css`

### Media & Input
- **expo-image-picker** v17.0.10 - Image selection for profile photos
- **expo-clipboard** v8.0.8 - Clipboard operations
- **react-native-gesture-handler** v2.28.0 - Gesture support

### Storage & Security
- **expo-secure-store** v15.0.8 - Secure token storage (native encryption)
- **@react-native-async-storage/async-storage** v2.2.0 - Local storage fallback
- Platform-aware secure storage implementation

### Animation & Performance
- **react-native-reanimated** v4.1.1 - Animation library
- **react-native-screens** v4.18.0 - Screen management optimization
- **react-native-safe-area-context** v5.6.2 - Safe area handling

### Development Tools
- **ESLint** - Code linting
- **Babel** - JavaScript transpilation
- **Tailwind CSS** - CSS framework configuration

---

## Application Architecture

### Project Directory Structure

```
src/
├── auth/                    # Authentication module
│   ├── authStore.ts        # Zustand store for auth state
│   ├── authTypes.ts        # Type definitions (User, Family, LoginRequest, etc.)
│   └── authSelectors.ts    # Helper functions (hasAnyFamily, getCurrentFamily)
│
├── family/                  # Family management module
│   ├── familyStore.ts      # Zustand store for family operations
│   └── familyTypes.ts      # Type definitions (Family, FamilyMember, etc.)
│
├── chores/                  # Chore/task management module
│   ├── choreStore.ts       # Zustand store for chore operations
│   └── choreTypes.ts       # Type definitions (Chore, ActiveChore, etc.)
│
├── categories/             # Chore categories module
│   ├── categoryStore.ts    # Zustand store for categories
│   └── categoryTypes.ts    # Type definitions (Category)
│
├── navigation/             # Navigation configuration
│   ├── AppGate.tsx         # Entry point (auth state check)
│   ├── AuthNavigator.tsx   # Auth flow navigation
│   ├── LoggedInNavigator.tsx # Post-login navigation (with drawer)
│   ├── MainStack.tsx       # Main app stack navigator
│   ├── FamilyTabs.tsx      # Bottom tab navigation (Home, Family, Chores, Goals)
│   ├── FamilyStack.tsx     # Family-related screens
│   ├── ChoresStack.tsx     # Chore-related screens
│   ├── FamilyOnboardingStack.tsx # Family setup wizard
│   └── MainStackParamList.ts # Type definitions for navigation
│
├── screens/                # Screen components
│   ├── auth/
│   │   └── AuthScreen.tsx  # Login/Register with tabs
│   └── app/
│       ├── tabs/
│       │   ├── FamilyHomeScreen.tsx # Home with pending chores
│       │   ├── FamilyScreen.tsx     # Family management
│       │   ├── ChoresScreen.tsx     # Completed chores history
│       │   └── GoalsScreen.tsx      # Placeholder for achievements
│       ├── CreateFamilyScreen.tsx   # Create new family
│       ├── JoinFamilyScreen.tsx     # Join existing family (stub)
│       ├── FamilyWizardHomeScreen.tsx # Family setup choice
│       ├── ChoreCreateScreen.tsx    # Create/edit chores
│       ├── ChoresListScreen.tsx     # Manage all chores
│       ├── FamilyDetailScreen.tsx   # Family detail view
│       ├── ProfileScreen.tsx        # User profile (stub)
│       ├── NotificationsScreen.tsx  # Notification settings (stub)
│       ├── PrivacyScreen.tsx        # Privacy policy (stub)
│       └── ResetDataScreen.tsx      # Data reset (stub)
│
├── components/             # Reusable UI components
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── TextField.tsx
│   │   ├── SelectField.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Avatar.tsx
│   │   ├── IconButton.tsx
│   │   ├── AppText.tsx        # Custom text with variants
│   │   ├── AppIcon.tsx        # Icon wrapper
│   │   └── LinkText.tsx       # Pressable link text
│   ├── layout/
│   │   ├── AppShell.tsx       # Main layout wrapper
│   │   ├── AppHeader.tsx      # Header component
│   │   └── Screen.tsx         # Screen wrapper
│   ├── chores/
│   │   ├── ChorePill.tsx      # Chore display component
│   │   ├── ChoreCompletedPill.tsx # Completed chore display
│   │   └── CategoryIcon.tsx   # Category icon display
│   ├── auth/
│   │   └── AuthHeader.tsx     # Auth screen header
│   └── notifications/
│       ├── notificationStore.ts # Notification state
│       ├── notificationTypes.ts # Notification types
│       └── NotificationHost.tsx # Notification display
│
├── lib/                    # Utilities and services
│   ├── api.ts             # API client with error handling
│   └── secureStore.ts     # Token storage (platform-aware)
│
├── hooks/                 # Custom React hooks
│   └── useDebounce.ts     # Debounce hook
│
└── global.css            # Global Tailwind styles
```

### Architecture Patterns

#### Domain-Driven Design
- Each feature domain (auth, families, chores, categories) has its own module
- Separate types, store, and selectors per domain
- Clear separation of concerns

#### State Management Pattern
- Zustand stores handle async operations (API calls)
- Error handling with field-level validation support
- Minimum delay simulation for loading states (UX polish)
- Actions are co-located with state

#### API Layer
- Single centralized API client at `src/lib/api.ts`
- Base URL: `http://api.coesya.test/api`
- Automatic Bearer token injection
- Standardized error handling with 422 validation errors
- Support for JSON and FormData requests

#### Component Architecture
- Custom UI component library for consistency
- Layout components for screen structure
- Domain-specific components (chores, auth)
- Reusable hooks for common patterns

---

## Authentication and User Flow

### Authentication Flow

```
App Start
    ↓
AppGate checks if fonts loaded + bootstrapping auth
    ↓
If no token → AuthNavigator (Login/Register screens)
If token exists → LoggedInNavigator
    ↓
LoggedInNavigator checks wizard completion + family status
    ↓
If wizard not completed OR no families → FamilyOnboardingStack
    │   ├── FamilyWizardHome (choose create/join)
    │   ├── CreateFamily (new family setup)
    │   └── JoinFamily (join with code)
    ↓
If wizard completed + has family → MainStack (app screens)
    ├── FamilyTabs (bottom tab navigation)
    │   ├── Home (FamilyHomeScreen - pending chores)
    │   ├── Family (FamilyStack - manage family)
    │   ├── Chores (ChoresStack - chore management)
    │   └── Goals (GoalsScreen - achievements)
    └── Drawer (settings menu)
        ├── Profile
        ├── Notifications
        ├── Privacy
        ├── ResetData
        └── Logout
```

### User States

The authentication store (`authStore.ts`) maintains:
- `user` - Current logged-in user object
- `token` - JWT or API token
- `isBootstrapping` - Initial app load state
- `isLoggingIn` - Login in progress
- `isRegistering` - Registration in progress
- `error` - General error message
- `formError` - Form-level error message
- `fieldErrors` - Per-field validation errors

### Security Mechanisms

#### 1. Secure Token Storage
- **iOS/Android**: Uses `expo-secure-store` with native encryption
- **Web**: Falls back to `localStorage` with platform detection
- Token automatically removed on logout
- Automatic token injection in API requests

#### 2. Authorization
- Bearer token sent in `Authorization` header
- API validates token and user permissions server-side
- Token persists across app restarts

#### 3. Validation
- Client-side field validation on form submission
- Server returns 422 for validation errors
- Field-level error display in UI forms
- Type-safe error handling

### User Types

1. **Unauthenticated User** - Can login or register
2. **New User (no family)** - Must complete wizard (create/join family)
3. **Active User** - Full access to family chores and management

---

## Data Models

### User

```typescript
{
  id: number
  firstname: string
  lastname: string
  nickname: string
  email: string
  profile_photo_path: string | null
  profile_photo_url: string
  has_completed_wizard: boolean
  families: Family[]
}
```

### Family

```typescript
{
  id: number
  name: string
  slug: string
  code: string // Invitation code
  profile_photo_path: string | null
  profile_photo_url: string
  created_at: string
  updated_at: string
  pivot: {
    user_id: number
    family_id: number
    current: 0 | 1 // Currently active family
  }
}
```

### Chore

```typescript
{
  id: number
  title: string
  frequency: "daily" | "weekly" | "monthly" | "semiannual"
  category_id: number
  weight: number // 1-5 (importance)
  priority: number // 1-5
  is_active: boolean
  category: Category
}
```

### ActiveChore

Extended chore with completion tracking:

```typescript
{
  ...Chore
  period_key: string
  due_at: string // ISO date
  is_completed: boolean
  completed_at?: string
  completed_by?: number
}
```

### ChoreCompletion

```typescript
{
  id: number
  chore_id: number
  family_id: number
  completed_by: number // User ID
  period_key: string
  completed_at: string // YYYY-MM-DD
  chore: Chore
}
```

### Category

```typescript
{
  id: number
  title: string
  ico: string | null // Icon identifier
  active: 0 | 1
  created_at: string
  updated_at: string
}
```

### FamilyMember

```typescript
{
  id: number
  firstname: string
  lastname: string
  nickname: string
  email: string
  profile_photo_url: string
}
```

---

## API Integration

### Base Configuration
- **Base URL**: `http://api.coesya.test/api`
- **Authentication**: Bearer token in `Authorization` header
- **Content Types**: `application/json`, `multipart/form-data`

### API Endpoints

#### Authentication
- `POST /login` - User login
- `POST /register` - User registration
- `GET /me` - Get current user data
- `POST /logout` - Logout user

#### Family Management
- `POST /family` - Create new family
- `PATCH /family/{id}` - Update family details
- `POST /family/{id}/uploadPhoto` - Upload family profile photo
- `GET /family/{id}/members` - Get family members
- `POST /family/{id}/code` - Generate invitation code

#### Chore Management
- `GET /chores/active` - Get pending chores for current family
- `GET /chores/completed` - Get completed chore history
- `POST /chores` - Create new chore
- `PATCH /chores/{id}` - Update chore
- `DELETE /chores/{id}` - Delete chore
- `POST /chores/{id}/complete` - Mark chore as completed

#### Categories
- `GET /categories` - Get all chore categories

### Error Handling

The API client handles:
- Network errors
- HTTP status errors
- 422 Validation errors with field-level detail
- Token expiration (automatic logout)

---

## UI/UX Design

### Design System

#### Color Scheme
- **Primary Gradient**: Purple to pink (#A76D99 → #5E134C)
- **Text Colors**: Dark gray (#171717) for primary text
- **Background**: White (#FFFFFF) with subtle grays

#### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Text Variants**:
  - `title` - Large, bold headings
  - `subtitle` - Medium headings
  - `body` - Regular body text
  - `caption` - Small, lighter text

#### Layout
- **Framework**: NativeWind (Tailwind CSS for React Native)
- **Spacing**: Consistent padding/margin scale
- **Safe Areas**: Automatic handling for notches/home indicators

### Navigation Design

#### Bottom Tab Bar
4 main sections:
1. **Home** - Pending chores overview
2. **Family** - Family management and members
3. **Chores** - Completed chores and history
4. **Goals** - Achievements (placeholder)

#### Drawer Navigation
Settings and account options:
- Profile
- Notifications
- Privacy Policy
- Reset Data
- Logout

#### Stack Navigation
Nested screens within each tab section

### Key Screens

#### 1. AuthScreen
- Dual-tab interface (Login/Register)
- Email and password fields
- Form validation with error display
- Gradient background

#### 2. FamilyHomeScreen
- Current family header with photo
- List of pending chores
- Quick completion actions
- Empty state when no chores

#### 3. FamilyScreen
- Family details and photo
- Member list
- Invitation code generation
- Settings access

#### 4. ChoresScreen
- History of completed chores
- Grouped by completion date
- Member attribution

#### 5. ChoreCreateScreen
- Rich form for chore creation/editing
- Title input
- Frequency selector
- Category picker with icons
- Priority and weight sliders
- Save/Cancel actions

#### 6. FamilyWizardHomeScreen
- Onboarding choice screen
- Create new family option
- Join existing family option
- Illustrations and guidance

### Custom UI Components

#### Button
- Multiple variants: primary, secondary, outline, ghost
- Loading states
- Disabled states
- Icon support

#### TextField
- Label and placeholder
- Error state display
- Secure text entry for passwords
- Clear button option

#### SelectField
- Dropdown-style selection
- Label and value display
- Options list modal

#### Checkbox
- Custom styling
- Label integration
- Controlled state

#### Avatar
- Image display with fallback
- Size variants
- Border support

---

## Current Development Status

### Recent Changes

Based on git status and recent commits:

#### Completed
- Navigation structure refactoring
- Deleted old `DashboardScreen` and `RootNavigator`
- Added new `LoggedInNavigator` for post-auth flow
- Added `FamilyWizardHomeScreen` for onboarding
- Implemented code layer for family invitations
- Full linting and TypeScript type checking
- Added user list in family page
- Fixed member pill layout

#### Modified Files
- `App.tsx` - Main app entry point updates
- Authentication type definitions
- Navigation components and param lists
- Multiple screen components
- Layout components

#### New Files
- `src/navigation/LoggedInNavigator.tsx`
- `src/screens/app/FamilyWizardHomeScreen.tsx`

### Work In Progress

#### Incomplete Features
- **Profile Screen** - Stub implementation (placeholder)
- **Notifications Screen** - Stub implementation (placeholder)
- **Privacy Screen** - Stub implementation (placeholder)
- **Reset Data Screen** - Stub implementation (placeholder)
- **Join Family Screen** - Functionality not fully implemented
- **Goals/Achievements** - Placeholder tab with no backend

#### Technical Debt
- Some error handling could be more robust
- Loading states could be more comprehensive
- Offline support not implemented
- Push notifications not integrated

---

## Development Setup

### Prerequisites
- Node.js (latest LTS)
- npm or yarn
- Expo CLI
- iOS Simulator (macOS) or Android Emulator

### Environment
- **Working Directory**: `/Users/alessandro/Work/Coesya/coesya-native`
- **Git Branch**: `develop`
- **Platform**: macOS (Darwin 25.1.0)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on iOS
npx expo start --ios

# Run on Android
npx expo start --android

# Run on web
npx expo start --web
```

### Available Scripts

From `package.json`:
- `npm start` - Start Expo dev server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS
- `npm run web` - Run on web
- `npm run lint` - Run ESLint

---

## Key Design Decisions

### 1. Zustand over Redux
- Lighter weight and simpler API
- Less boilerplate code
- Built-in TypeScript support
- Sufficient for app complexity

### 2. NativeWind (Tailwind CSS)
- Rapid UI development
- Consistent styling system
- Familiar syntax for web developers
- Good performance characteristics

### 3. Expo Managed Workflow
- Simplified development setup
- Easy access to native features
- Over-the-air updates capability
- Strong ecosystem and tooling

### 4. TypeScript Throughout
- Type safety prevents runtime errors
- Better IDE support and autocomplete
- Self-documenting code
- Easier refactoring

### 5. Domain-Driven Structure
- Clear separation of concerns
- Scalable architecture
- Easy to locate related code
- Testable modules

### 6. Platform-Aware Storage
- Native encryption on mobile platforms
- Graceful fallback for web
- Security best practices
- Cross-platform compatibility

---

## Future Considerations

### Potential Enhancements

1. **Push Notifications**
   - Chore reminders
   - Family activity updates
   - Completion notifications

2. **Offline Support**
   - Local data caching
   - Sync when online
   - Optimistic updates

3. **Gamification**
   - Points/rewards system
   - Achievements and badges
   - Leaderboards

4. **Advanced Chore Features**
   - Recurring patterns (every Tuesday, etc.)
   - Chore dependencies
   - Rotating assignments
   - Time estimates

5. **Social Features**
   - Comments on chores
   - Reactions/kudos
   - Activity feed
   - Family chat

6. **Analytics**
   - Completion rate tracking
   - Family contribution metrics
   - Time-based insights

7. **Accessibility**
   - Screen reader support
   - High contrast mode
   - Font size customization
   - VoiceOver/TalkBack optimization

---

## Conclusion

Coesya Native is a well-architected family chore management application that leverages modern React Native best practices. The codebase demonstrates:

- **Clean Architecture**: Domain-driven structure with clear separation
- **Type Safety**: Comprehensive TypeScript usage
- **Modern Stack**: Latest React Native, Expo, and ecosystem libraries
- **Security First**: Secure token storage and authentication
- **User-Centered**: Intuitive onboarding and navigation flow
- **Scalable**: Architecture supports feature growth

The application is in active development with a solid foundation for continued feature enhancement and refinement. The Italian market focus and family collaboration emphasis position it well for its target audience.

---

*Document generated: 2026-01-06*
*Project Version: Based on current develop branch*
