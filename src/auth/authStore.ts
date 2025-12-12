import { create } from "zustand";
import { api, ApiError } from "../lib/api";
import { getToken, removeToken, setToken } from "../lib/secureStore";
import type { LoginRequest, LoginResponse, User } from "./authTypes";

type FieldErrorMap = Partial<Record<"email" | "password", string>>;

interface AuthState {
    user: User | null;
    token: string | null;
    isBootstrapping: boolean;
    isLoggingIn: boolean;
    error: string | null;
    fieldErrors: FieldErrorMap;

    bootstrap: () => Promise<void>;
    login: (data: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: null,
    isBootstrapping: true,
    isLoggingIn: false,
    error: null,
    fieldErrors: {},

    bootstrap: async () => {
        set({ isBootstrapping: true, error: null });
        try {
            const token = await getToken();
            if (!token) {
                set({ token: null, user: null, isBootstrapping: false });
                return;
            }

            // opzionale ma consigliato: endpoint /me per validare token
            // Adatta l'endpoint al tuo backend:
            const me = await api.get<User>("/me");

            set({ token, user: me, isBootstrapping: false });
        } catch {
            await removeToken();
            set({ token: null, user: null, isBootstrapping: false });
        }
    },

    login: async (data: LoginRequest) => {
        set({ isLoggingIn: true, error: null, fieldErrors: {} });

        const minDelayMs = 450;
        const startedAt = Date.now();

        try {
            const res = await api.post<LoginResponse>("/login", data);

            await setToken(res.token);

            const elapsed = Date.now() - startedAt;
            if (elapsed < minDelayMs) {
                await new Promise<void>((r) => setTimeout(r, minDelayMs - elapsed));
            }

            set({
                token: res.token,
                user: res.user,
                isLoggingIn: false,
                error: null,
            });
        } catch (e) {
            const elapsed = Date.now() - startedAt;
            if (elapsed < minDelayMs) {
                await new Promise<void>((r) => setTimeout(r, minDelayMs - elapsed));
            }

            if (e instanceof ApiError && e.status === 422 && e.validationErrors) {
                const emailErr = e.validationErrors.email?.[0];
                const passwordErr = e.validationErrors.password?.[0];

                set({
                    isLoggingIn: false,
                    error: null,
                    fieldErrors: {
                        ...(emailErr ? { email: emailErr } : {}),
                        ...(passwordErr ? { password: passwordErr } : {}),
                    },
                });
                return; // non rilanciare: è un errore “di form”
            }

            const message = e instanceof Error ? e.message : "Errore durante il login";
            set({ isLoggingIn: false, error: message, fieldErrors: {} });
            throw e;
        }
    },

    logout: async () => {
        // opzionale: chiamata backend /logout
        await removeToken();
        set({ token: null, user: null, error: null });
    },
}));
