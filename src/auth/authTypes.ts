export interface User {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    families: Family[];
}
export interface FamilyPivot {
    user_id: number;
    family_id: number;
    current: 0 | 1;
}

export interface Family {
    id: number;
    name: string;
    profile_photo_path: string | null;
    profile_photo_url: string;
    created_at: string;
    updated_at: string;
    pivot: FamilyPivot;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: "ok";
    token: string;
    user: User;
}
export interface RegisterRequest {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    password_confirmation: string;
    privacy: boolean;
}

export interface RegisterResponse {
    success: "ok";
    token: string;
    user?: User; // se la restituisci subito da Laravel
}
