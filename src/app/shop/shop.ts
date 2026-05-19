import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { Product } from '../models/product.model';
import { ShopService } from '../services/shop.service';
import { CartService } from '../services/cart.service';
import { FavouritesService } from '../services/favourites.service';
import { AuthService } from '../core/services/auth.service';                          
import { MatIcon } from '@angular/material/icon';
import { CartNotification } from './cart-notification/cart-notification';
import { FavouriteNotification } from './favourite-notification/favourite-notification';
import { AuthNotification } from '../shared/auth-notification/auth-notification';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [RouterLink, MatIcon, CartNotification, FavouriteNotification, AuthNotification],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop {
  products = signal<Product[]>([]);
  isFetching = signal(false);
  error = signal('');

  showCartNotification = signal(false);
  showFavouriteNotification = signal(false);
  showAuthNotification = signal(false);        
  notificationProduct = signal('');
  notificationQuantity = signal(1);

  private shopService = inject(ShopService);
  private cartService = inject(CartService);
  private favouritesService = inject(FavouritesService);
  private authService = inject(AuthService);   
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.shopService.getProducts().subscribe({
      next: (products) => this.products.set(products),
      error: (error: Error) => {
        this.error.set(error.message || 'Failed to load products');
        this.isFetching.set(false);
      },
      complete: () => this.isFetching.set(false)
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  addToCart(event: Event, product: Product) {
    event.preventDefault();
    event.stopPropagation();

    this.notificationProduct.set(product.name);
    this.notificationQuantity.set(1);
    this.showCartNotification.set(true);
    setTimeout(() => this.showCartNotification.set(false), 4000);

    const subscription = this.cartService.addToCart(product.id, 1).subscribe({
      error: (error: Error) => {
        this.showCartNotification.set(false);
        console.error(error.message);
      }
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  addToFavourites(event: Event, product: Product) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.authService.isAuthenticated()) {
      this.showAuthNotification.set(true);
      setTimeout(() => this.showAuthNotification.set(false), 4000);
      return;
    }

    this.notificationProduct.set(product.name);
    this.showFavouriteNotification.set(true);
    setTimeout(() => this.showFavouriteNotification.set(false), 4000);

    const subscription = this.favouritesService.addToFavourites(product.id).subscribe({
      error: (error: Error) => {
        this.showFavouriteNotification.set(false);
        console.error(error.message);
      }
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  goToFavourites() {
    this.router.navigate(['/favourites']);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}