import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FavouritesService } from '../services/favourites.service';
import { CartService } from '../services/cart.service';
import { AuthService } from '../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { CartNotification } from '../shop/cart-notification/cart-notification';

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [MatIconModule, CartNotification],
  templateUrl: './favourites.html',
  styleUrl: './favourites.css',
})
export class Favourites implements OnInit {
  private favouritesService = inject(FavouritesService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  favouriteItems = this.favouritesService.loadedFavouriteItems;
  isAuthenticated = this.authService.isAuthenticated;

  showNotification = false;
  notificationProduct = '';

  ngOnInit() {
    if (!this.authService.isAuthenticated()) return;

    const subscription = this.favouritesService.loadFavouriteItems().subscribe({
      error: (error: Error) => console.error(error.message)
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  addToCart(item: any) {
    this.notificationProduct = item.name;
    this.showNotification = true;
    setTimeout(() => this.showNotification = false, 4000);

    const subscription = this.cartService.addToCart(Number(item.productId), 1).subscribe({
      error: (error: Error) => {
        this.showNotification = false;
        console.error(error.message);
      }
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  removeItem(itemId: number) {
    const subscription = this.favouritesService.removeFromFavourites(itemId).subscribe({
      error: (error: Error) => console.error(error.message)
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  goToShop() {
    this.router.navigate(['/shop']);
  }

  onViewAuth() {
    this.router.navigate(['/login']);
  } 
}