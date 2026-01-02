import { Category } from "../categories/categoryTypes";
export type ChoreFrequency = "daily" | "weekly" | "monthly" | "semiannual";

export interface ActiveChore {
    id: number;
    title: string;
    frequency: ChoreFrequency;
    category_id: number;
    weight: number; // 1..5
    priority: number; // 1..5
    is_active: boolean;

    period_key: string;
    due_at: string; // ISO string (end-exclusive o deadline)
    is_completed: boolean;
    completed_at?: string | null;
    completed_by?: number | null;

    category: Category;
}

export interface ActiveChoresResponse {
    success: "ok";
    pending: ActiveChore[];
    completions: ChoreCompletion[];
}

export interface CompleteResponse {
    success: "ok";
    completion: ChoreCompletion | null;
    period_key?: string;
}

export interface Chore {
    id: number;
    title: string;
    frequency: ChoreFrequency;
    category_id: number;
    is_active: boolean;
    weight: number;
    priority: number;
    category: Category;
}
export interface ChoreCompletion {
    id: number;
    chore_id: number;
    family_id: number;
    completed_by: number;
    period_key: string | null;
    completed_at: string; // "YYYY-MM-DD" nel tuo esempio

    chore: Chore & {
        category: Category | null;
    };
}

export interface CompletedCompletionsResponse {
    success: "ok";
    completions: ChoreCompletion[];
}

export interface ChoresIndexResponse {
    success: "ok";
    chores: Chore[];
}
export interface CreateChoreRequest {
    title: string;
    frequency: ChoreFrequency;
    category_id: number;
    weight: number;
    priority: number;
    is_active: boolean;

    // non necessariamente salvato nel chore: è un “comportamento”
    completed_current_period: boolean;
}

export interface CreateChoreResponse {
    success: "ok";
    chore: Chore;
}

export type UpdateChoreRequest = CreateChoreRequest; // stessa shape va benissimo
export interface UpdateChoreResponse {
    success: "ok";
    chore: Chore;
}
export interface DeleteChoreResponse {
    success: "ok";
}
