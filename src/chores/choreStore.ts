import { create } from "zustand";
import { api, ApiError } from "../lib/api";
import type { ActiveChore, ActiveChoresResponse, CompleteResponse, Chore, ChoresIndexResponse, ChoreCompletion, CompletedCompletionsResponse, CreateChoreRequest, CreateChoreResponse, UpdateChoreRequest, UpdateChoreResponse, DeleteChoreResponse } from "./choreTypes";

type FieldErrors = Partial<Record<"title" | "frequency" | "category_id" | "weight" | "priority", string>>;
interface ChoresState {
    pending: ActiveChore[];
    completions: ChoreCompletion[];
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

    isCreating: boolean;
    createError: string | null;
    createFieldErrors: FieldErrors;

    createChore: (data: CreateChoreRequest) => Promise<Chore>;
    updateChore: (choreId: number, data: UpdateChoreRequest) => Promise<Chore>;
    deleteChore: (choreId: number) => Promise<void>;

    isDeleting: boolean;
    deleteError: string | null;

    clearDeleteError: () => void;
    clearCreateFieldError: (field: keyof FieldErrors) => void;
    clearCreateError: () => void;

    completedCompletions: ChoreCompletion[];
    isLoadingCompleted: boolean;
    completedError: string | null;

    fetchCompleted: () => Promise<void>;
    clearCompletedError: () => void;
}

export const useChoresStore = create<ChoresState>((set, get) => ({
    pending: [],
    completions: [],
    isLoading: false,
    error: null,
    togglingIds: {},

    clearError: () => set({ error: null }),

    allChores: [],
    isLoadingAll: false,

    isCreating: false,
    createError: null,
    createFieldErrors: {},

    isDeleting: false,
    deleteError: null,
    clearDeleteError: () => set({ deleteError: null }),

    completedCompletions: [],
    isLoadingCompleted: false,
    completedError: null,
    clearCompletedError: () => set({ completedError: null }),

    fetchActive: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.get<ActiveChoresResponse>("/chores/active");
            set({ pending: res.pending, completions: res.completions, isLoading: false });
        } catch (e) {
            const msg = e instanceof ApiError ? e.message : "Errore nel caricamento degli impegni.";
            set({ isLoading: false, error: msg });
        }
    },

    fetchCompleted: async () => {
        set({ isLoadingCompleted: true, completedError: null });
        try {
            const res = await api.get<CompletedCompletionsResponse>("/chores/completed");
            set({ completedCompletions: res.completions, isLoadingCompleted: false });
        } catch (e) {
            const msg = e instanceof ApiError ? e.message : "Errore nel caricamento dello storico.";
            set({ isLoadingCompleted: false, completedError: msg });
        }
    },

    toggleComplete: async (choreId: number) => {
        const state = get();
        const current = state.pending.find((c) => c.id === choreId);
        if (!current) return;

        // Qui, visto che pending contiene solo "da completare",
        // il click in pratica significa "complete".
        // Però mantengo la logica generica nel caso tu in futuro
        // mostri anche completed nella stessa lista.
        const nextCompleted = !current.is_completed;

        // loader per riga
        set({
            togglingIds: { ...state.togglingIds, [choreId]: true },
        });

        try {
            if (nextCompleted) {
                const res = await api.post<CompleteResponse>(`/chores/${choreId}/complete`, {});

                if (!res.completion) {
                    // se il backend risponde ok ma senza completion, per sicurezza non sposto nulla
                    throw new ApiError("Risposta non valida: completion mancante.", 500);
                }

                const completion = res.completion;

                set((s) => {
                    // 1) rimuovi dalla lista pending
                    const nextPending = s.pending.filter((c) => c.id !== choreId);

                    // 2) prepend nei completati e mantieni max 3
                    const nextCompletions = [completion, ...s.completions].slice(0, 3);

                    return {
                        pending: nextPending,
                        completions: nextCompletions,
                    };
                });
            } else {
                // UNCOMPLETE (se mai ti capiterà di chiamarlo su un item "completed")
                const res = await api.post<CompleteResponse>(`/chores/${choreId}/uncomplete`, {});

                set((s) => {
                    const restored: ActiveChore = {
                        ...current,
                        is_completed: false,
                        completed_at: null,
                        completed_by: null,
                        // il backend può mandare un period_key aggiornato; se non c'è, tengo il suo
                        period_key: res.period_key ?? current.period_key,
                    };

                    // 1) reinserisci in pending (poi ordina)
                    const pendingUnsorted = [restored, ...s.pending];

                    // Ordine coerente con backend: priority desc, weight desc, title asc
                    const nextPending = [...pendingUnsorted].sort((a, b) => {
                        if (a.priority !== b.priority) return b.priority - a.priority;
                        if (a.weight !== b.weight) return b.weight - a.weight;
                        return a.title.localeCompare(b.title);
                    });

                    // 2) rimuovi dalla lista completions il record relativo a questo chore/periodo
                    // Nel tuo modello, period_key di ActiveChore è string, mentre nella completion può essere null.
                    const pk = restored.period_key;
                    const nextCompletions = s.completions.filter((c) => {
                        if (c.chore_id !== choreId) return true;
                        // se la completion ha period_key valorizzata, matcha per period_key
                        if (c.period_key != null) return c.period_key !== pk;
                        // se fosse null (caso raro), lo togliamo comunque per chore_id
                        return false;
                    });

                    return {
                        pending: nextPending,
                        completions: nextCompletions,
                    };
                });
            }
        } catch (e) {
            // rollback: siccome spostiamo solo a success, qui basta settare errore
            set({
                error: e instanceof ApiError ? e.message : "Operazione non riuscita. Riprova.",
            });
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

    clearCreateError: () => set({ createError: null }),
    clearCreateFieldError: (field) =>
        set((s) => {
            if (!s.createFieldErrors[field]) return s;
            const { [field]: _removed, ...rest } = s.createFieldErrors;
            return { createFieldErrors: rest };
        }),

    createChore: async (data) => {
        set({ isCreating: true, createError: null, createFieldErrors: {} });

        const minDelayMs = 450;
        const startedAt = Date.now();

        try {
            // 1) crea chore
            const res = await api.post<CreateChoreResponse>("/chores", {
                title: data.title,
                frequency: data.frequency,
                category_id: data.category_id,
                weight: data.weight,
                priority: data.priority,
                is_active: data.is_active,
            });

            // 2) se richiesto, marca completato nel periodo corrente
            if (data.completed_current_period) {
                await api.post(`/chores/${res.chore.id}/complete`, {});
            }

            // ✅ 3) aggiorno subito la lista "gestione"
            set((s) => ({
                allChores: [res.chore, ...s.allChores],
            }));

            // ✅ 4) riallineo la lista "attivi per periodo"
            // (robusto: include period_key/completed_at ecc.)
            await get().fetchActive();

            const elapsed = Date.now() - startedAt;
            if (elapsed < minDelayMs) await new Promise<void>((r) => setTimeout(r, minDelayMs - elapsed));

            set({ isCreating: false });
            return res.chore;
        } catch (e) {
            const elapsed = Date.now() - startedAt;
            if (elapsed < minDelayMs) await new Promise<void>((r) => setTimeout(r, minDelayMs - elapsed));

            if (e instanceof ApiError && e.status === 422 && e.validationErrors) {
                set({
                    isCreating: false,
                    createError: null,
                    createFieldErrors: {
                        title: e.validationErrors.title?.[0],
                        frequency: e.validationErrors.frequency?.[0],
                        category_id: e.validationErrors.category_id?.[0],
                        weight: e.validationErrors.weight?.[0],
                        priority: e.validationErrors.priority?.[0],
                    },
                });
                throw e;
            }

            set({
                isCreating: false,
                createError: e instanceof ApiError ? e.message : "Si è verificato un errore. Riprova tra poco.",
            });
            throw e;
        }
    },

    updateChore: async (choreId, data) => {
        set({ isCreating: true, createError: null, createFieldErrors: {} });

        const minDelayMs = 450;
        const startedAt = Date.now();

        try {
            console.log(choreId, data, data.category_id);
            const res = await api.patch<UpdateChoreResponse>(`/chores/${choreId}`, {
                title: data.title,
                frequency: data.frequency,
                category_id: data.category_id,
                weight: data.weight,
                priority: data.priority,
                is_active: data.is_active,
            });

            const elapsed = Date.now() - startedAt;
            if (elapsed < minDelayMs) await new Promise<void>((r) => setTimeout(r, minDelayMs - elapsed));

            // aggiorno lista gestione
            set((s) => ({
                isCreating: false,
                allChores: s.allChores.map((c) => (c.id === res.chore.id ? res.chore : c)),
            }));

            // riallineo active (robusto)
            await get().fetchActive();

            return res.chore;
        } catch (e) {
            const elapsed = Date.now() - startedAt;
            if (elapsed < minDelayMs) await new Promise<void>((r) => setTimeout(r, minDelayMs - elapsed));

            if (e instanceof ApiError && e.status === 422 && e.validationErrors) {
                set({
                    isCreating: false,
                    createError: null,
                    createFieldErrors: {
                        title: e.validationErrors.title?.[0],
                        frequency: e.validationErrors.frequency?.[0],
                        category_id: e.validationErrors.category_id?.[0],
                        weight: e.validationErrors.weight?.[0],
                        priority: e.validationErrors.priority?.[0],
                    },
                });
                throw e;
            }

            set({
                isCreating: false,
                createError: e instanceof ApiError ? e.message : "Si è verificato un errore. Riprova tra poco.",
            });
            throw e;
        }
    },

    deleteChore: async (choreId) => {
        set({ isDeleting: true, deleteError: null });

        const minDelayMs = 350;
        const startedAt = Date.now();

        // snapshot per rollback
        const prevAll = get().allChores;

        // optimistic remove dalla lista gestione
        set((s) => ({
            allChores: s.allChores.filter((c) => c.id !== choreId),
        }));

        try {
            await api.del<DeleteChoreResponse>(`/chores/${choreId}`);

            const elapsed = Date.now() - startedAt;
            if (elapsed < minDelayMs) {
                await new Promise<void>((r) => setTimeout(r, minDelayMs - elapsed));
            }

            set({ isDeleting: false });

            // riallineo lista attivi per periodo (in caso fosse presente)
            await get().fetchActive();
        } catch (e) {
            const elapsed = Date.now() - startedAt;
            if (elapsed < minDelayMs) {
                await new Promise<void>((r) => setTimeout(r, minDelayMs - elapsed));
            }

            // rollback
            set({
                isDeleting: false,
                allChores: prevAll,
                deleteError: e instanceof ApiError ? e.message : "Eliminazione non riuscita. Riprova.",
            });

            throw e;
        }
    },
}));
