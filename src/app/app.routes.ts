import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Drawings } from './drawings/drawings';
import { DrawingDetail } from './drawings/drawing-detail/drawing-detail';
import { Shop } from './shop/shop';
import { Favourites } from './favourites/favourites';
import { Cart } from './cart/cart';
import { Account } from './account/account';
import { ProductDetail } from './shop/product-detail/product-detail';

export const routes: Routes = [
    {
        path: '', // <your-domain>/
        component: Home
    },
    {
        path: 'drawings', // <your-domain>/drawings
        component: Drawings,
    },
    { 
        path: 'drawings/:identifier', 
        component: DrawingDetail 
    },
    {
        path: 'shop',
        component: Shop
    }, 
    {
        path: 'shop/:identifier',
        component: ProductDetail
    },
    {
        path: 'favourites',
        component: Favourites
    },
    {
        path: 'cart',
        component: Cart
    },
    {
        path: 'account',
        component: Account
    }
];
