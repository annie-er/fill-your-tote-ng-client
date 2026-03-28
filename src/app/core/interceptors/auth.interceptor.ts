import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const token = authService.getToken();

    const cloned = req.clone({
        withCredentials: true,                    
        headers: token
            ? req.headers.set('Authorization', `Bearer ${token}`)
            : req.headers
    });

    return next(cloned).pipe(
        catchError(error => {
            if (error.status === 401) {
                authService.clearAuth();
                router.navigate(['/login']);
            }
            return throwError(() => error);
        })
    );
};