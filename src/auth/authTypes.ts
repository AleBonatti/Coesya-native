export interface User {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
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
}

export interface RegisterResponse {
    success: "ok";
    token: string;
    user?: User; // se la restituisci subito da Laravel
}
