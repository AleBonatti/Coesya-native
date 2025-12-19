import { Platform } from "react-native";
import { create } from "zustand";
import { api, ApiError } from "../lib/api";
import type { CreateFamilyRequest, CreateFamilyResponse, Family, UpdateFamilyRequest, UpdateFamilyResponse, UploadFamilyPhotoResponse } from "./familyTypes";
// familyStore.ts
import type * as ImagePicker from "expo-image-picker";

type FamilyFieldErrorMap = Partial<Record<"name", string>>;

interface FamilyState {
    isCreating: boolean;
    isUpdating: boolean;
    isUploadingPhoto: boolean;

    formError: string | null;
    fieldErrors: FamilyFieldErrorMap;

    createFamily: (data: CreateFamilyRequest) => Promise<Family>;
    updateFamily: (familyId: number, data: UpdateFamilyRequest) => Promise<Family>;

    uploadFamilyPhoto: (familyId: number, asset: ImagePicker.ImagePickerAsset) => Promise<Family>;

    clearFieldError: (field: keyof FamilyFieldErrorMap) => void;
    clearFormError: () => void;
}

export const useFamilyStore = create<FamilyState>((set) => ({
    isCreating: false,
    isUpdating: false,
    isUploadingPhoto: false,
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
                        name: e.validationErrors.name?.[0],
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

    updateFamily: async (familyId, data) => {
        set({ isUpdating: true, formError: null, fieldErrors: {} });

        const minDelayMs = 350;
        const startedAt = Date.now();

        try {
            const res = await api.patch<UpdateFamilyResponse>(`/family/${familyId}`, data);

            const elapsed = Date.now() - startedAt;
            if (elapsed < minDelayMs) {
                await new Promise<void>((r) => setTimeout(r, minDelayMs - elapsed));
            }

            set({ isUpdating: false, formError: null, fieldErrors: {} });
            return res.family; // ✅ ritorna Family
        } catch (e) {
            const elapsed = Date.now() - startedAt;
            if (elapsed < minDelayMs) {
                await new Promise<void>((r) => setTimeout(r, minDelayMs - elapsed));
            }

            if (e instanceof ApiError && e.status === 422 && e.validationErrors) {
                set({
                    isUpdating: false,
                    formError: null,
                    fieldErrors: { name: e.validationErrors.name?.[0] },
                });
                throw e;
            }

            if (e instanceof ApiError && (e.status === 401 || e.status === 403)) {
                set({
                    isUpdating: false,
                    formError: "Non hai i permessi per modificare questa famiglia.",
                    fieldErrors: {},
                });
                throw e;
            }

            set({
                isUpdating: false,
                formError: "Si è verificato un errore. Riprova tra poco.",
                fieldErrors: {},
            });
            throw e;
        }
    },

    uploadFamilyPhoto: async (familyId, asset) => {
        set({ isUploadingPhoto: true, formError: null });

        const minDelayMs = 350;
        const startedAt = Date.now();

        try {
            const form = new FormData();
            const filename = asset.fileName ?? `family-${familyId}.jpg`;
            const mimeType = asset.mimeType ?? "image/jpeg";

            if (Platform.OS === "web") {
                const blob = await (await fetch(asset.uri)).blob();
                form.append("photo", blob, filename);
            } else {
                form.append("photo", { uri: asset.uri, name: filename, type: mimeType } as unknown as Blob);
            }

            const res = await api.postForm<UploadFamilyPhotoResponse>(`/family/${familyId}/uploadPhoto`, form);

            const elapsed = Date.now() - startedAt;
            if (elapsed < minDelayMs) await new Promise<void>((r) => setTimeout(r, minDelayMs - elapsed));

            set({ isUploadingPhoto: false });
            return res.family;
        } catch (e) {
            const elapsed = Date.now() - startedAt;
            if (elapsed < minDelayMs) await new Promise<void>((r) => setTimeout(r, minDelayMs - elapsed));

            set({
                isUploadingPhoto: false,
                formError: "Non è stato possibile caricare l’immagine. Riprova.",
            });

            throw e;
        }
    },
}));
