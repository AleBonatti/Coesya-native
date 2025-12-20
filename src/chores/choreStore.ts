import { create } from "zustand";
import { api, ApiError } from "../lib/api";
import type { ActiveChore, ActiveChoresResponse, CompleteResponse, Chore, ChoresIndexResponse } from "./choreTypes";

interface ChoresState {
    chores: ActiveChore[];
    isLoading: boolean;
    error: string | null;

    // loader per riga
    togglingIds: Record<number, boolean>;

    fetchActive: () => Promise<void>;
    toggleComplete: (choreId: number) => Promise<void>;
    clearError: () => void;

    allChores: Chore[];
    isLoadingAll: boolean;
    fetchAll: () => Promise<void>;
}

export const useChoresStore = create<ChoresState>((set, get) => ({
    chores: [],
    isLoading: false,
    error: null,
    togglingIds: {},

    clearError: () => set({ error: null }),

    allChores: [],
    isLoadingAll: false,

    fetchActive: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get<ActiveChoresResponse>("/chores/active");
            set({ chores: res.chores, isLoading: false });
        } catch (e) {
            const msg = e instanceof ApiError ? e.message : "Errore nel caricamento degli impegni.";
            set({ isLoading: false, error: msg });
        }
    },

    toggleComplete: async (choreId: number) => {
        const state = get();
        const current = state.chores.find((c) => c.id === choreId);
        if (!current) return;

        // optimistic update
        const nextCompleted = !current.is_completed;

        set({
            togglingIds: { ...state.togglingIds, [choreId]: true },
            chores: state.chores.map((c) =>
                c.id === choreId
                    ? {
                          ...c,
                          is_completed: nextCompleted,
                          // se stai marcando completo, metto un timestamp locale "provvisorio"
                          completed_at: nextCompleted ? new Date().toISOString() : null,
                      }
                    : c
            ),
        });

        try {
            if (nextCompleted) {
                const res = await api.post<CompleteResponse>(`/chores/${choreId}/complete`, {});
                // allineo con server (period_key / completed_at)
                set((s) => ({
                    chores: s.chores.map((c) =>
                        c.id === choreId
                            ? {
                                  ...c,
                                  is_completed: true,
                                  period_key: res.completion?.period_key ?? c.period_key,
                                  completed_at: res.completion?.completed_at ?? c.completed_at,
                                  completed_by_user_id: res.completion?.completed_by_user_id ?? c.completed_by_user_id,
                              }
                            : c
                    ),
                }));
            } else {
                const res = await api.del<CompleteResponse>(`/chores/${choreId}/complete`);
                set((s) => ({
                    chores: s.chores.map((c) =>
                        c.id === choreId
                            ? {
                                  ...c,
                                  is_completed: false,
                                  period_key: res.period_key ?? c.period_key,
                                  completed_at: null,
                                  completed_by_user_id: null,
                              }
                            : c
                    ),
                }));
            }
        } catch (e) {
            // rollback
            set((s) => ({
                chores: s.chores.map((c) => (c.id === choreId ? current : c)),
                error: e instanceof ApiError ? e.message : "Operazione non riuscita. Riprova.",
            }));
        } finally {
            set((s) => {
                const { [choreId]: _removed, ...rest } = s.togglingIds;
                return { togglingIds: rest };
            });
        }
    },

    fetchAll: async () => {
        set({ isLoadingAll: true, error: null });
        try {
            const res = await api.get<ChoresIndexResponse>("/chores");
            set({ allChores: res.chores, isLoadingAll: false });
        } catch (e) {
            const msg = e instanceof ApiError ? e.message : "Errore nel caricamento degli impegni.";
            set({ isLoadingAll: false, error: msg });
        }
    },
}));
