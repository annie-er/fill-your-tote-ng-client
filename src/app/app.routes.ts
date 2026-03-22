import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Drawings } from './drawings/drawings';
import { DrawingDetail } from './drawings/drawing-detail/drawing-detail';
import { Shop } from './shop/shop';
import { Favourites } from './favourites/favourites';
import { Cart } from './cart/cart';
import { Account } from './account/account';

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
