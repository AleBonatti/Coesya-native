/* export interface Chore {
    id: number;
    name: string;
}

export interface CreateChoreRequest {
    name: string;
}

export interface CreateChoreResponse {
    success: "ok";
    chore: Chore;
}
export interface UpdateChoreRequest {
    name: string;
}
export interface UpdateChoreResponse {
    success: "ok";
    chore: Chore;
}
 */
export type ChoreFrequency = "daily" | "weekly" | "monthly" | "semiannual";

export interface ActiveChore {
    id: number;
    title: string;
    frequency: ChoreFrequency;
    category: string;
    weight: number; // 1..5
    priority: number; // 1..5
    is_active: boolean;

    period_key: string;
    due_at: string; // ISO string (end-exclusive o deadline)
    is_completed: boolean;
    completed_at?: string | null;
    completed_by_user_id?: number | null;
}

export interface ActiveChoresResponse {
    success: "ok";
    chores: ActiveChore[];
}

export interface CompleteResponse {
    success: "ok";
    completion: {
        chore_id: number;
        period_key: string;
        completed_at?: string | null;
        completed_by_user_id?: number | null;
    } | null;
    period_key?: string;
}
