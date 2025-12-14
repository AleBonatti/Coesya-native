import { create } from "zustand";
import { api, ApiError } from "../lib/api";
import { getToken, removeToken, setToken } from "../lib/secureStore";
import type { LoginRequest, LoginResponse, User, RegisterRequest, RegisterResponse } from "./authTypes";

type FieldErrorMap = Partial<Record<"firstname" | "lastname" | "email" | "password" | "password_confirmation", string>>;

interface AuthState {
    user: User | null;
    token: string | null;
    isBootstrapping: boolean;
    isLoggingIn: boolean;
    isRegistering: boolean;
    register: (data: RegisterRequest) => Promise<void>;
    error: string | null;
    formError: string | null;
    fieldErrors: FieldErrorMap;

    bootstrap: () => Promise<void>;
    login: (data: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;

    clearFormError: () => void;
    clearFieldError: (field: keyof FieldErrorMap) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    token: null,
    isBootstrapping: true,
    isLoggingIn: false,
    isRegistering: false,
    error: null,
    formError: null,
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
        set({ isLoggingIn: true, formError: null, error: null, fieldErrors: {} });

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

            if (e instanceof ApiError) {
                // 422: errori campi
                if (e.status === 422 && e.validationErrors) {
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

                // 401/403: credenziali / accesso negato
                if (e.status === 401 || e.status === 403) {
                    set({
                        isLoggingIn: false,
                        formError: "Email o password non corrette.",
                        fieldErrors: {},
                    });
                    return;
                }

                // altro: errore server/rete
                set({
                    isLoggingIn: false,
                    formError: "Si è verificato un errore. Riprova tra poco.",
                    fieldErrors: {},
                });
                return;
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

    register: async (data) => {
        set({ isRegistering: true, formError: null, fieldErrors: {} });

        const minDelayMs = 450;
        const startedAt = Date.now();

        try {
            const res = await api.post<RegisterResponse>("/register", data);

            await setToken(res.token);

            const elapsed = Date.now() - startedAt;
            if (elapsed < minDelayMs) {
                await new Promise<void>((r) => setTimeout(r, minDelayMs - elapsed));
            }

            // se Laravel ritorna user in register, usalo. Altrimenti fallback su /me
            const user = res.user ?? (await api.get<User>("/me"));

            set({ token: res.token, user, isRegistering: false, formError: null });
        } catch (e) {
            const elapsed = Date.now() - startedAt;
            if (elapsed < minDelayMs) {
                await new Promise<void>((r) => setTimeout(r, minDelayMs - elapsed));
            }

            if (e instanceof ApiError && e.status === 422 && e.validationErrors) {
                set({
                    isRegistering: false,
                    formError: null,
                    fieldErrors: {
                        firstname: e.validationErrors.firstname?.[0],
                        lastname: e.validationErrors.lastname?.[0],
                        email: e.validationErrors.email?.[0],
                        password: e.validationErrors.password?.[0],
                        password_confirmation: e.validationErrors.password_confirmation?.[0],
                    },
                });
                return;
            }

            if (e instanceof ApiError && (e.status === 409 || e.status === 422)) {
                // 409 tipico per "email già registrata" se lo gestisci così lato backend
                set({ isRegistering: false, formError: e.message, fieldErrors: {} });
                return;
            }

            set({
                isRegistering: false,
                formError: "Si è verificato un errore. Riprova tra poco.",
                fieldErrors: {},
            });
        }
    },

    clearFieldError: (field) =>
        set((state) => {
            if (!state.fieldErrors[field]) return state;

            const { [field]: _, ...rest } = state.fieldErrors;
            return { fieldErrors: rest };
        }),

    clearFormError: () => set({ formError: null }),
}));
