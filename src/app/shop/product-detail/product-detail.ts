import { Component, computed, DestroyRef, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { ShopService } from '../../services/shop.service';
import { CartService } from '../../services/cart.service';
import { FavouritesService } from '../../services/favourites.service';
import { AuthService } from '../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { CartNotification } from '../cart-notification/cart-notification';
import { FavouriteNotification } from '../favourite-notification/favourite-notification';
import { AuthNotification } from '../../shared/auth-notification/auth-notification';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [MatIconModule, CartNotification, FavouriteNotification, AuthNotification],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  identifier = input.required<string>();
  private shopService = inject(ShopService);
  private cartService = inject(CartService);
  private favouritesService = inject(FavouritesService);
  private authService = inject(AuthService);
  
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  allProducts = this.shopService.getProductsSignal();

  showCartNotification = false;
  showFavouriteNotification = false;
  showAuthNotification = false; 

  product = computed(() =>
    this.allProducts().find(p => p.slug === this.identifier() || String(p.id) === this.identifier())
  );

  currentIndex = computed(() =>
    this.allProducts().findIndex(p => p.id === this.product()?.id)
  );

  get hasPrevious(): boolean { return this.currentIndex() > 0; }
  get hasNext(): boolean { return this.currentIndex() < this.allProducts().length - 1; }

  navigate(direction: 'prev' | 'next') {
    const newIndex = direction === 'prev' ? this.currentIndex() - 1 : this.currentIndex() + 1;
    const newProduct = this.allProducts()[newIndex];
    this.router.navigate(['/shop', newProduct.slug || newProduct.id]);
  }

  quantity = 1;
  careOpen = false;

  increment() { this.quantity++; }
  decrement() { if (this.quantity > 1) this.quantity--; }

  addToCart() {
    const product = this.product();
    if (product) {
      // show notification immediately, don't wait for HTTP
      this.showCartNotification = true;
      setTimeout(() => this.showCartNotification = false, 4000);

      const subscription = this.cartService.addToCart(product.id, this.quantity).subscribe({
        error: (error: Error) => {
          this.showCartNotification = false; // hide if request fails
          console.error(error.message);
        }
      });

      this.destroyRef.onDestroy(() => subscription.unsubscribe());
    }
  }

  addToFavourites() {
    const product = this.product();
    if (!product) return;

    // ← check auth first
    if (!this.authService.isAuthenticated()) {
      this.showAuthNotification = true;
      setTimeout(() => this.showAuthNotification = false, 4000);
      return;
    }

    this.showFavouriteNotification = true;
    setTimeout(() => this.showFavouriteNotification = false, 4000);

    const subscription = this.favouritesService.addToFavourites(product.id).subscribe({
      error: (error: Error) => {
        this.showFavouriteNotification = false;
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

  goBack() { 
    this.router.navigate(['/shop']); 
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}