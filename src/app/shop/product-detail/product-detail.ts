import { Component, computed, DestroyRef, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { ShopService } from '../../services/shop.service';
import { CartService } from '../../services/cart.service';
import { MatIconModule } from '@angular/material/icon';
import { CartNotification } from '../cart-notification/cart-notification';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [MatIconModule, CartNotification],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  identifier = input.required<string>();
  private shopService = inject(ShopService);
  private cartService = inject(CartService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  allProducts = this.shopService.getProductsSignal();

  showNotification = false;

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
      this.showNotification = true;
      setTimeout(() => this.showNotification = false, 4000);

      const subscription = this.cartService.addToCart(product.id, this.quantity).subscribe({
        error: (error: Error) => {
          this.showNotification = false; // hide if request fails
          console.error(error.message);
        }
      });

      this.destroyRef.onDestroy(() => subscription.unsubscribe());
    }
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }
  goBack() { this.router.navigate(['/shop']); }
}