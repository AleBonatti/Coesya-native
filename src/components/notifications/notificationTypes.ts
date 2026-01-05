export type NotificationType = "success" | "error" | "info";

export interface NotificationPayload {
    id: string;
    type: NotificationType;
    title: string;
    message?: string;
    durationMs?: number; // default 2500
}
