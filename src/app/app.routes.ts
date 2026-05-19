import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Drawings } from './drawings/drawings';
import { Shop } from './shop/shop';
import { Cart } from './cart/cart';
import { noAuthGuard } from './core/guards/no-auth.guard';

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
        loadComponent: () => import('./auth/login/login').then(m => m.Login),
        canActivate: [noAuthGuard]
    },
    {
        path: 'register',
        loadComponent: () => import('./auth/register/register').then(m => m.Register),
        canActivate: [noAuthGuard]
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
    { 
        path: 'checkout', 
        loadComponent: () => import('./checkout/checkout')
            .then(m => m.Checkout)
    },
    { 
        path: 'checkout/success', 
        loadComponent: () => import('./checkout/checkout-success/checkout-success')
            .then(m => m.CheckoutSuccess)
    },
    {
        path: 'orders',
        loadComponent: () => import('./orders/orders')
            .then(m => m.Orders)
    },
];
