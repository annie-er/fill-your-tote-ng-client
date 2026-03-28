export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface AuthUser {
    firstName: string;
    lastName: string;
    email: string;
}