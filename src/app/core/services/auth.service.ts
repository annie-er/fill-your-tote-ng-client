import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, AuthUser, LoginRequest, RegisterRequest } from '../models/auth.models';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private readonly TOKEN_KEY = 'auth_token';
    private readonly USER_KEY = 'auth_user';

    private _currentUser = signal<AuthUser | null>(null);
    private _token = signal<string | null>(null);

    currentUser = this._currentUser.asReadonly();
    isAuthenticated = computed(() => this._token() !== null);

    constructor(private http: HttpClient, private router: Router) {
        // Run expiry check on app load instead of blindly loading from storage
        const token = localStorage.getItem(this.TOKEN_KEY);
        if (token && !this.isTokenExpired(token)) {
            this._token.set(token);
            const stored = localStorage.getItem(this.USER_KEY);
            this._currentUser.set(stored ? JSON.parse(stored) : null);
        } else {
            // Token missing or expired; clear storage
            localStorage.removeItem(this.TOKEN_KEY);
            localStorage.removeItem(this.USER_KEY);
        }
    }

    register(request: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, request)
            .pipe(tap(response => this.handleAuthResponse(response)));
    }

    login(request: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, request)
            .pipe(tap(response => this.handleAuthResponse(response)));
    }

    getToken(): string | null {
        return this._token();
    }

    clearAuth(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        this._token.set(null);
        this._currentUser.set(null);
    }

    private isTokenExpired(token: string): boolean {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 < Date.now();
        } catch {
            return true; // if we can't parse it, treat it as expired
        }
    }

    private handleAuthResponse(response: AuthResponse): void {
        const user: AuthUser = {
            firstName: response.firstName,
            lastName: response.lastName,
            email: response.email
        };

        localStorage.setItem(this.TOKEN_KEY, response.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));

        this._token.set(response.token);
        this._currentUser.set(user);
    }
}