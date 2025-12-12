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
