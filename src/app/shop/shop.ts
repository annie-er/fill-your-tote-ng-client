import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { Product } from '../models/product.model';
import { ShopService } from '../services/shop.service';
import { CartService } from '../services/cart.service';
import { MatIcon } from '@angular/material/icon';
import { CartNotification } from './cart-notification/cart-notification';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [RouterLink, MatIcon, CartNotification],
  templateUrl: './shop.html',
  styleUrl: './shop.css',
})
export class Shop {
  products = signal<Product[]>([]);
  isFetching = signal(false);
  error = signal('');

  showNotification = false;
  notificationProduct = '';
  notificationQuantity = 1;

  private shopService = inject(ShopService);
  private cartService = inject(CartService);
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

    this.notificationProduct = product.name;
    this.notificationQuantity = 1;
    this.showNotification = true;
    setTimeout(() => this.showNotification = false, 4000);

    const subscription = this.cartService.addToCart(product.id, 1).subscribe({
      error: (error: Error) => {
        this.showNotification = false;
        console.error(error.message);
      }
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }
}