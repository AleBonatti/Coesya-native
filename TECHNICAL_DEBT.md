# Technical Debt & Improvement Plan

**Project**: Coesya Native
**Analysis Date**: 2026-01-07
**Total Issues Identified**: 17

---

## Table of Contents

1. [Critical Issues](#critical-issues)
2. [High Priority Issues](#high-priority-issues)
3. [Medium Priority Improvements](#medium-priority-improvements)
4. [Architecture Improvements](#architecture-improvements)
5. [Action Plan](#action-plan)
6. [Progress Tracking](#progress-tracking)

---

## Critical Issues

### 1. Wrong HTTP Status Code in API Error Handler ⚠️

**File**: `src/lib/api.ts:51`
**Severity**: CRITICAL
**Status**: 🟢 Completed

**Problem**:
```typescript
if (res.status === 401) {
    const message = "Invalid data.";
    const errors = (data as { errors?: ValidationErrors }).errors;
    throw new ApiError(message, 422, errors);  // ❌ Should be 401, not 422
}
```

**Impact**: Authentication failures are treated as validation errors instead of unauthorized errors. This prevents proper logout behavior and confuses error handling throughout the app.

**Fix Applied**:
```typescript
if (res.status === 401) {
    const message = "Unauthorized";
    throw new ApiError(message, 401);
}
```

**Result**: Authentication errors now properly throw 401 status codes, enabling correct logout and error handling behavior throughout the app.

**Actual Time**: 5 minutes

---

### 2. Insecure API URL 🔒

**File**: `src/lib/api.ts:3`
**Severity**: MEDIUM (downgraded from CRITICAL)
**Status**: 🟢 Completed

**Problem**:
```typescript
const API_BASE_URL = "http://api.coesya.test/api";  // ❌ HTTP, not HTTPS
```

**Impact**:
- ~~Credentials sent unencrypted over the network~~ (HTTP acceptable for local dev)
- ~~Man-in-the-middle attack vulnerability~~ (local network only)
- ~~Cannot switch between development/staging/production easily~~ ✅ FIXED

**Solution Implemented**:
1. ✅ Created `.env.example` file as template
2. ✅ Created `.env` file with local development URL
3. ✅ Updated `api.ts:3`:
```typescript
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://api.coesya.test/api";
```
4. ✅ Added `.env` to `.gitignore` (keeping `.env.example` in git)

**Benefits**:
- Easy to switch environments by changing `.env` file
- Production can use HTTPS URL: `EXPO_PUBLIC_API_URL=https://api.coesya.com/api`
- Developers can use their own local API URLs
- Secure credentials management (`.env` excluded from git)

**Actual Time**: 5 minutes

---

### 3. Missing Navigation After Family Operations 🧭

**Files**:
- `src/screens/app/CreateFamilyScreen.tsx:32-35`
- `src/screens/app/JoinFamilyScreen.tsx:46-54`

**Severity**: ~~CRITICAL~~ **FALSE POSITIVE**
**Status**: 🟢 Not an Issue

**Analysis**: This was initially flagged as a bug, but after code review, the navigation is working correctly through Zustand's reactive state management.

**How it actually works**:
1. After family creation/join, `refreshMe()` is called (line 30 in CreateFamilyScreen, line 49 in JoinFamilyScreen)
2. `refreshMe()` fetches updated user data from `/me` endpoint, which includes the new family
3. It updates the Zustand store: `set({ user: me })` (authStore.ts:193)
4. LoggedInNavigator subscribes to user state: `const user = useAuthStore((s) => s.user)` (LoggedInNavigator.tsx:33)
5. React automatically re-renders LoggedInNavigator
6. `hasFamily` is recalculated with updated user data
7. `wizardRequired = !!user && (!user.has_completed_wizard || !hasFamily)` becomes false
8. The screen automatically switches from `<WizardShell />` to `<MainShell />` (LoggedInNavigator.tsx:50)

The commented-out navigation code was likely left as an alternative approach but is unnecessary. The current reactive approach is actually better because:
- No manual navigation management needed
- Automatic UI updates when state changes
- Works correctly across the entire app

**Resolution**: No fix needed - working as designed.

**Estimated Effort**: N/A

---

### 4. Console.log in Production Code 🐛

**File**: `src/chores/choreStore.ts:275`
**Severity**: CRITICAL
**Status**: 🟢 Completed (Manual)

**Problem**:
```typescript
console.log(choreId, data, data.category_id);  // ❌ Debug logging in production
```

**Impact**:
- Information leakage in production
- Console pollution
- Debugging confusion

**Fix Applied**: The debug console.log statement was manually removed from the codebase.

**Result**: Production code is now cleaner with no debug statements left behind.

**Actual Time**: 2 minutes

---

## High Priority Issues

### 5. No Token Refresh Mechanism 🔐

**File**: `src/lib/api.ts`
**Severity**: HIGH
**Status**: 🔴 Not Started

**Problem**: When a token expires mid-session, users are immediately logged out with no opportunity to refresh the token silently.

**Impact**: Poor UX - users lose work and must re-login frequently.

**Fix**: Implement token refresh interceptor:
```typescript
async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const token = await getToken();
    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: {
            ...init?.headers,
            Authorization: token ? `Bearer ${token}` : "",
        },
    });

    if (res.status === 401) {
        // Try to refresh token
        const refreshToken = await getRefreshToken();
        if (refreshToken) {
            const newToken = await refreshAccessToken(refreshToken);
            if (newToken) {
                // Retry original request with new token
                return request(path, init);
            }
        }
        // If refresh fails, logout user
        await logout();
        throw new ApiError("Session expired", 401);
    }

    // ... rest of error handling
}
```

**Estimated Effort**: 2 hours

---

### 6. No Request Timeouts ⏱️

**File**: `src/lib/api.ts:26-67`
**Severity**: HIGH
**Status**: 🔴 Not Started

**Problem**: Fetch requests have no timeout configuration. On slow or unresponsive networks, requests hang indefinitely.

**Impact**: App appears frozen; users must force-quit.

**Fix**:
```typescript
async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const token = await getToken();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
        const res = await fetch(`${API_BASE_URL}${path}`, {
            ...init,
            signal: controller.signal,
            headers: {
                ...init?.headers,
                Authorization: token ? `Bearer ${token}` : "",
                "X-Requested-With": "XMLHttpRequest",
            },
        });
        clearTimeout(timeoutId);

        // ... rest of handling
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new ApiError("Request timeout", 408);
        }
        throw error;
    }
}
```

**Estimated Effort**: 30 minutes

---

### 7. Web Token Storage Vulnerability 🔓

**File**: `src/lib/secureStore.ts:15-20`
**Severity**: HIGH
**Status**: 🔴 Not Started

**Problem**:
```typescript
if (Platform.OS === "web") {
    if (!canUseLocalStorage()) return null;
    return window.localStorage.getItem(TOKEN_KEY);  // ❌ XSS vulnerable
}
```

**Impact**: On web platform, tokens stored in localStorage are accessible to any JavaScript code, including malicious scripts (XSS attacks).

**Fix**: Use httpOnly cookies for web or implement a more secure storage mechanism:
```typescript
// Option 1: Use httpOnly cookies (requires backend support)
// Option 2: Use sessionStorage with additional security measures
// Option 3: Implement encrypted localStorage wrapper
```

**Estimated Effort**: 3 hours (requires backend coordination for httpOnly cookies)

---

### 8. Race Condition in Notifications ⚡

**File**: `src/components/notifications/notificationStore.ts:24-28`
**Severity**: HIGH
**Status**: 🔴 Not Started

**Problem**:
```typescript
setTimeout(() => {
    const cur = get().current;
    if (cur?.id === id) set({ current: null });
}, durationMs);
```

Multiple rapid notifications can cause race conditions where the wrong notification is cleared.

**Impact**: Notifications disappear too early or stay too long; unpredictable behavior.

**Fix**:
```typescript
show: (payload) => {
    const id = nanoid();
    const notification = { ...payload, id };

    // Clear previous timeout
    const prevTimeoutId = get().timeoutId;
    if (prevTimeoutId) clearTimeout(prevTimeoutId);

    set({ current: notification });

    const timeoutId = setTimeout(() => {
        set((state) => {
            if (state.current?.id === id) {
                return { current: null, timeoutId: undefined };
            }
            return state;
        });
    }, payload.durationMs ?? 2500);

    set({ timeoutId });
},
```

Add `timeoutId` to NotificationState interface.

**Estimated Effort**: 20 minutes

---

## Medium Priority Improvements

### 9. Inconsistent Error Handling Patterns 🔄

**Files**: Multiple stores
**Severity**: MEDIUM
**Status**: 🔴 Not Started

**Problem**: Different stores use different error state patterns:
- `authStore.ts`: `error` + `fieldErrors`
- `familyStore.ts`: `formError` + `fieldErrors`
- `choreStore.ts`: `error`

**Impact**: Confusing for developers; harder to maintain; inconsistent UX.

**Fix**: Standardize on a single pattern across all stores:
```typescript
interface BaseStoreState {
    isLoading: boolean;
    error: string | null;
    fieldErrors: Record<string, string>;
}
```

**Estimated Effort**: 4 hours (requires refactoring multiple stores)

---

### 10. Missing Client-Side Validation ✅

**Files**:
- `src/screens/app/CreateFamilyScreen.tsx:29`
- `src/screens/app/JoinFamilyScreen.tsx`

**Severity**: MEDIUM
**Status**: 🔴 Not Started

**Problem**: No client-side validation before API calls:
```typescript
await createFamily({ name: name.trim() }); // No length/format check
```

**Impact**: Poor UX - users wait for API response to learn of validation errors.

**Fix**:
```typescript
const handleSave = async () => {
    // Validate
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
        // Show error: "Nome richiesto"
        return;
    }
    if (trimmedName.length > 50) {
        // Show error: "Nome troppo lungo (max 50 caratteri)"
        return;
    }

    try {
        await createFamily({ name: trimmedName });
        await refreshMe();
    } catch {
        // errori già gestiti nello store
    }
};
```

**Estimated Effort**: 1 hour

---

### 11. Hardcoded Delays Without Documentation ⏲️

**Files**: Multiple stores (`authStore.ts`, `familyStore.ts`, `choreStore.ts`)
**Severity**: MEDIUM
**Status**: 🔴 Not Started

**Problem**: Hardcoded `minDelayMs` values (450ms, 350ms) scattered throughout with no explanation:
```typescript
const minDelayMs = 450; // Why 450ms?
const startedAt = Date.now();
// ... API call ...
if (elapsed < minDelayMs) {
    await new Promise<void>((r) => setTimeout(r, minDelayMs - elapsed));
}
```

**Impact**:
- Maintenance burden - changing timing requires editing multiple files
- Inconsistent delays confuse UX
- No clear rationale for timing choices

**Fix**: Extract to a constant with documentation:
```typescript
// src/lib/constants.ts
/**
 * Minimum delay for form submissions to prevent perceived lag
 * and ensure loading states are visible to users.
 * @see https://ux.stackexchange.com/questions/...
 */
export const MIN_FORM_SUBMIT_DELAY_MS = 450;

/**
 * Minimum delay for update operations
 */
export const MIN_UPDATE_DELAY_MS = 350;
```

Then import and use in stores.

**Estimated Effort**: 30 minutes

---

### 12. FlatList Performance Not Optimized 🚀

**File**: `src/screens/app/tabs/FamilyHomeScreen.tsx`
**Severity**: MEDIUM
**Status**: 🔴 Not Started

**Problem**: Large lists render without performance optimizations:
```typescript
<FlatList
    data={pending}
    renderItem={({ item }) => <ChorePill item={item} />}
    // ❌ Missing optimization props
/>
```

**Impact**: Performance degradation with long lists; scrolling lag.

**Fix**:
```typescript
<FlatList
    data={pending}
    renderItem={({ item }) => <ChorePill item={item} />}
    keyExtractor={(item) => item.id.toString()}
    initialNumToRender={10}
    maxToRenderPerBatch={10}
    updateCellsBatchingPeriod={50}
    removeClippedSubviews={true}
    windowSize={5}
/>
```

**Estimated Effort**: 15 minutes per FlatList (multiple instances)

---

### 13. No-op Button 🔘

**File**: `src/screens/app/tabs/FamilyHomeScreen.tsx:85`
**Severity**: MEDIUM
**Status**: 🔴 Not Started

**Problem**:
```typescript
<IconButton
    icon="arrow-forward"
    onPress={() => {}}  // ❌ Does nothing
    bgClass="bg-brand-primary"
/>
```

**Impact**: Confusing UX - button appears clickable but has no action.

**Fix**: Either implement the action or remove the button.

**Estimated Effort**: 5 minutes (decision needed on intended behavior)

---

## Architecture Improvements

### 14. Extract Shared Error Handling 🏗️

**Files**: Multiple stores
**Severity**: LOW
**Status**: 🔴 Not Started

**Goal**: Create reusable hooks for consistent form state management.

**Implementation**:
```typescript
// src/hooks/useFormState.ts
interface FormState<T extends Record<string, any>> {
    isLoading: boolean;
    error: string | null;
    fieldErrors: Partial<Record<keyof T, string>>;
}

export function useFormState<T extends Record<string, any>>() {
    const [state, setState] = useState<FormState<T>>({
        isLoading: false,
        error: null,
        fieldErrors: {},
    });

    const clearError = () => setState(s => ({ ...s, error: null }));
    const clearFieldError = (field: keyof T) =>
        setState(s => {
            const { [field]: _, ...rest } = s.fieldErrors;
            return { ...s, fieldErrors: rest as typeof s.fieldErrors };
        });

    const handleApiError = (error: unknown) => {
        if (error instanceof ApiError && error.status === 422 && error.validationErrors) {
            setState(s => ({
                ...s,
                isLoading: false,
                error: null,
                fieldErrors: error.validationErrors as typeof s.fieldErrors,
            }));
        } else {
            setState(s => ({
                ...s,
                isLoading: false,
                error: error instanceof Error ? error.message : "Unknown error",
                fieldErrors: {},
            }));
        }
    };

    return { state, setState, clearError, clearFieldError, handleApiError };
}
```

**Estimated Effort**: 6 hours (design + implementation + migration)

---

### 15. Implement API Interceptors 🔌

**File**: `src/lib/api.ts`
**Severity**: LOW
**Status**: 🔴 Not Started

**Goal**: Add middleware for token refresh, retry logic, and common error handling.

**Implementation**:
```typescript
// src/lib/apiInterceptors.ts
interface RequestInterceptor {
    onRequest?: (url: string, init?: RequestInit) => Promise<RequestInit | undefined>;
    onResponse?: (response: Response) => Promise<Response>;
    onError?: (error: Error) => Promise<void>;
}

const interceptors: RequestInterceptor[] = [];

export function addInterceptor(interceptor: RequestInterceptor) {
    interceptors.push(interceptor);
}

// Token refresh interceptor
addInterceptor({
    onResponse: async (response) => {
        if (response.status === 401) {
            // Attempt token refresh
            const refreshed = await attemptTokenRefresh();
            if (refreshed) {
                // Retry original request
                return fetch(response.url, { ... });
            }
        }
        return response;
    },
});

// Retry interceptor for transient failures
addInterceptor({
    onError: async (error) => {
        if (isTransientError(error)) {
            await delay(1000);
            // Retry logic
        }
    },
});
```

**Estimated Effort**: 8 hours

---

### 16. Create Family Selection Context 👨‍👩‍👧‍👦

**Files**: Multiple navigation and screen files
**Severity**: LOW
**Status**: 🔴 Not Started

**Goal**: Replace `getCurrentFamily(user)` pattern with explicit context for better state management.

**Implementation**:
```typescript
// src/contexts/FamilyContext.tsx
interface FamilyContextValue {
    currentFamily: Family | null;
    families: Family[];
    setCurrentFamily: (family: Family) => Promise<void>;
    refreshCurrentFamily: () => Promise<void>;
}

const FamilyContext = createContext<FamilyContextValue | null>(null);

export function FamilyProvider({ children }: { children: ReactNode }) {
    const user = useAuthStore(s => s.user);
    const [currentFamilyId, setCurrentFamilyId] = useState<number | null>(null);

    const currentFamily = useMemo(() =>
        user?.families?.find(f => f.id === currentFamilyId) ?? null,
        [user?.families, currentFamilyId]
    );

    const setCurrentFamily = async (family: Family) => {
        setCurrentFamilyId(family.id);
        // Optionally persist to backend
        await api.post(`/user/current-family`, { family_id: family.id });
    };

    return (
        <FamilyContext.Provider value={{ currentFamily, families: user?.families ?? [], setCurrentFamily, refreshCurrentFamily }}>
            {children}
        </FamilyContext.Provider>
    );
}

export function useFamily() {
    const context = useContext(FamilyContext);
    if (!context) throw new Error("useFamily must be used within FamilyProvider");
    return context;
}
```

**Estimated Effort**: 4 hours

---

### 17. Implement Deep Linking 🔗

**Files**: Navigation configuration
**Severity**: LOW
**Status**: 🔴 Not Started

**Goal**: Enable deep links for sharing specific screens, chores, or families.

**Implementation**:
```typescript
// app.json or App.tsx
const linking = {
    prefixes: ['coesya://', 'https://coesya.com'],
    config: {
        screens: {
            LoggedIn: {
                screens: {
                    Main: {
                        screens: {
                            FamilyTabs: {
                                screens: {
                                    Home: 'family/:familyId',
                                    Chores: {
                                        screens: {
                                            ChoresList: 'chores',
                                            ChoreDetail: 'chore/:choreId',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};

// Usage: coesya://chore/123 or https://coesya.com/family/45
```

**Estimated Effort**: 6 hours

---

## Action Plan

### Week 1: Critical Issues (Priority 1) 🚨

**Goals**: Fix breaking bugs and security issues

| Issue | File | Estimated Time | Assignee | Status |
|-------|------|----------------|----------|--------|
| #1: API status code bug | `api.ts:51` | 5 min | - | 🟢 Completed |
| #4: Remove console.log | `choreStore.ts:275` | 2 min | - | 🟢 Completed (Manual) |
| #3: Fix navigation | `CreateFamilyScreen.tsx`, `JoinFamilyScreen.tsx` | ~~10 min~~ N/A | - | 🟢 Not an Issue |
| #2: Environment variables | `api.ts:3` | 5 min | - | 🟢 Completed |

**Total Estimated Time**: ~~32 minutes~~ 12 minutes
**Expected Completion**: ✅ Week 1 Complete

---

### Week 2: High Priority Issues (Priority 2) ⚡

**Goals**: Improve reliability and user experience

| Issue | File | Estimated Time | Assignee | Status |
|-------|------|----------------|----------|--------|
| #6: Request timeouts | `api.ts` | 30 min | - | 🔴 Not Started |
| #8: Fix notification race condition | `notificationStore.ts` | 20 min | - | 🔴 Not Started |
| #5: Token refresh mechanism | `api.ts` | 2 hours | - | 🔴 Not Started |
| #7: Secure web token storage | `secureStore.ts` | 3 hours | - | 🔴 Not Started |

**Total Estimated Time**: ~6 hours
**Expected Completion**: End of Week 2

---

### Week 3: Medium Priority Improvements (Priority 3) 🔧

**Goals**: Code quality and consistency improvements

| Issue | File | Estimated Time | Assignee | Status |
|-------|------|----------------|----------|--------|
| #11: Document hardcoded delays | Multiple stores | 30 min | - | 🔴 Not Started |
| #10: Client-side validation | `CreateFamilyScreen.tsx` | 1 hour | - | 🔴 Not Started |
| #12: FlatList optimization | `FamilyHomeScreen.tsx` | 1 hour | - | 🔴 Not Started |
| #13: Fix no-op button | `FamilyHomeScreen.tsx` | 5 min | - | 🔴 Not Started |
| #9: Standardize error handling | Multiple stores | 4 hours | - | 🔴 Not Started |

**Total Estimated Time**: ~7 hours
**Expected Completion**: End of Week 3

---

### Week 4: Architecture Improvements (Priority 4) 🏗️

**Goals**: Long-term maintainability and scalability

| Issue | File | Estimated Time | Assignee | Status |
|-------|------|----------------|----------|--------|
| #14: Shared error handling hook | New: `hooks/useFormState.ts` | 6 hours | - | 🔴 Not Started |
| #16: Family selection context | New: `contexts/FamilyContext.tsx` | 4 hours | - | 🔴 Not Started |
| #15: API interceptors | `lib/apiInterceptors.ts` | 8 hours | - | 🔴 Not Started |
| #17: Deep linking | Navigation config | 6 hours | - | 🔴 Not Started |

**Total Estimated Time**: ~24 hours
**Expected Completion**: End of Week 4

---

## Progress Tracking

### Summary Statistics

- **Total Issues**: 17
- **Critical**: ~~4~~ 1 (5.9%) - 3 resolved
- **High**: 4 (23.5%)
- **Medium**: ~~5~~ 6 (35.3%) - #2 downgraded from Critical
- **Low**: 4 (23.5%)
- **False Positives**: 1 (5.9%)

### Status Overview

- 🔴 Not Started: 13 (76.5%)
- 🟡 In Progress: 0 (0%)
- 🟢 Completed: 3 (17.6%)
- 🟢 Not an Issue: 1 (5.9%)

### Estimated Total Effort

- **Week 1**: 32 minutes
- **Week 2**: 6 hours
- **Week 3**: 7 hours
- **Week 4**: 24 hours
- **Total**: ~37 hours

---

## Notes

### Priority Definitions

- **CRITICAL**: Breaks core functionality or poses security risk
- **HIGH**: Significantly impacts UX or reliability
- **MEDIUM**: Code quality and maintainability issues
- **LOW**: Nice-to-have architectural improvements

### Review Schedule

- Update this document weekly after completing each phase
- Mark issues as 🟡 In Progress when work begins
- Mark issues as 🟢 Completed when merged to main
- Add actual time spent vs. estimated time for future planning

### Additional Considerations

1. Some issues may reveal additional problems during implementation
2. Backend coordination required for issues #2, #5, and #7
3. Testing time not included in estimates (add ~20% for testing)
4. Consider pairing critical fixes with relevant tests

---

**Last Updated**: 2026-01-07
**Next Review**: 2026-01-14
