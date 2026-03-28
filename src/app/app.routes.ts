import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Drawings } from './drawings/drawings';
import { Shop } from './shop/shop';
import { Cart } from './cart/cart';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    // eagerly loaded routes
    {
        path: '', // <your-domain>/
        component: Home
    },
    {
        path: 'drawings', // <your-domain>/drawings
        component: Drawings,
    },
    {
        path: 'shop',
        component: Shop
    }, 
    {
        path: 'cart',
        component: Cart
    },
    {
        path: 'login',
        loadComponent: () => import('./auth/login/login')
            .then(m => m.Login)
    },
    {
        path: 'register',
        loadComponent: () => import('./auth/register/register')
            .then(m => m.Register)
    },
    {
        path: 'favourites',
        loadComponent: () => import('./favourites/favourites')
            .then(m => m.Favourites)
        // canActivate: [authGuard]
    },
    {
        path: 'cart',
        loadComponent: () => import('./cart/cart')
            .then(m => m.Cart)
    },
    {
        path: 'drawings/:identifier',
        loadComponent: () => import('./drawings/drawing-detail/drawing-detail')
            .then(m => m.DrawingDetail)
    },
    {
        path: 'shop/:identifier',
        loadComponent: () => import('./shop/product-detail/product-detail')
            .then(m => m.ProductDetail)
    },
];
