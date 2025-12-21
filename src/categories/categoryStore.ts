import { create } from "zustand";
import { api, ApiError } from "../lib/api";
import type { Category, CategoriesResponse } from "./categoryTypes";

interface CategoryState {
    categories: Category[];
    isLoading: boolean;
    error: string | null;

    fetchCategories: () => Promise<void>;
    clearError: () => void;
}

export const useCategoryStore = create<CategoryState>((set) => ({
    categories: [],
    isLoading: false,
    error: null,

    clearError: () => set({ error: null }),

    fetchCategories: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get<CategoriesResponse>("/categories"); // o "/categeries" se davvero è così
            set({ categories: res.items, isLoading: false });
        } catch (e) {
            set({
                isLoading: false,
                error: e instanceof ApiError ? e.message : "Errore nel caricamento categorie.",
            });
            throw e;
        }
    },
}));
