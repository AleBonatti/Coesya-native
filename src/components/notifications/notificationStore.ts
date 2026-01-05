import { create } from "zustand";
import type { NotificationPayload } from "./notificationTypes";

interface NotificationState {
    current: NotificationPayload | null;
    show: (payload: Omit<NotificationPayload, "id">) => void;
    hide: () => void;
}

function uid(): string {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    current: null,
    show: (payload) => {
        const id = uid();
        const durationMs = payload.durationMs ?? 2500;

        // mostra subito
        set({ current: { ...payload, id, durationMs } });

        // auto-hide
        setTimeout(() => {
            // evita di chiudere una notifica nuova
            const cur = get().current;
            if (cur?.id === id) set({ current: null });
        }, durationMs);
    },
    hide: () => set({ current: null }),
}));
