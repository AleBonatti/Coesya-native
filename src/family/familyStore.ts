import { create } from "zustand";
import { api, ApiError } from "../lib/api";
import type { CreateFamilyRequest, CreateFamilyResponse, Family } from "./familyTypes";

type FamilyFieldErrorMap = Partial<Record<"title", string>>;

interface FamilyState {
    isCreating: boolean;
    formError: string | null;
    fieldErrors: FamilyFieldErrorMap;

    createFamily: (data: CreateFamilyRequest) => Promise<Family>;
    clearFieldError: (field: keyof FamilyFieldErrorMap) => void;
    clearFormError: () => void;
}

export const useFamilyStore = create<FamilyState>((set) => ({
    isCreating: false,
    formError: null,
    fieldErrors: {},

    clearFormError: () => set({ formError: null }),

    clearFieldError: (field) =>
        set((state) => {
            if (!state.fieldErrors[field]) return state;
            const { [field]: _removed, ...rest } = state.fieldErrors;
            return { fieldErrors: rest };
        }),

    createFamily: async (data) => {
        set({ isCreating: true, formError: null, fieldErrors: {} });

        const minDelayMs = 450;
        const startedAt = Date.now();

        try {
            // ✅ Cambia qui l’endpoint se nel tuo backend è diverso
            const res = await api.post<CreateFamilyResponse>("/family", data);

            const elapsed = Date.now() - startedAt;
            if (elapsed < minDelayMs) {
                await new Promise<void>((r) => setTimeout(r, minDelayMs - elapsed));
            }

            set({ isCreating: false, formError: null, fieldErrors: {} });
            return res.family;
        } catch (e) {
            const elapsed = Date.now() - startedAt;
            if (elapsed < minDelayMs) {
                await new Promise<void>((r) => setTimeout(r, minDelayMs - elapsed));
            }

            if (e instanceof ApiError && e.status === 422 && e.validationErrors) {
                set({
                    isCreating: false,
                    formError: null,
                    fieldErrors: {
                        title: e.validationErrors.name?.[0],
                    },
                });
                throw e; // opzionale, puoi anche non rilanciare
            }

            if (e instanceof ApiError && (e.status === 401 || e.status === 403)) {
                set({
                    isCreating: false,
                    formError: "Non hai i permessi per creare una famiglia.",
                    fieldErrors: {},
                });
                throw e;
            }

            set({
                isCreating: false,
                formError: "Si è verificato un errore. Riprova tra poco.",
                fieldErrors: {},
            });
            throw e;
        }
    },
}));
