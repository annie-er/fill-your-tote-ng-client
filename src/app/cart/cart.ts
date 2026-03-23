import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
  private cartService = inject(CartService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  cartItems = this.cartService.loadedCartItems;
  cartSummary = this.cartService.loadedCartSummary;

  ngOnInit() {
    const subscription = this.cartService.loadCartItems().subscribe({
      error: (error: Error) => console.error(error.message)
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());

    const summarySub = this.cartService.loadCartSummary().subscribe({
      error: (error: Error) => console.error(error.message)
    });
    this.destroyRef.onDestroy(() => summarySub.unsubscribe());
  }

  increment(itemId: number, currentQuantity: number) {
    const subscription = this.cartService.updateCartItemQuantity(itemId, currentQuantity + 1).subscribe({
      error: (error: Error) => console.error(error.message)
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  decrement(itemId: number, currentQuantity: number) {
    if (currentQuantity <= 1) return;
    const subscription = this.cartService.updateCartItemQuantity(itemId, currentQuantity - 1).subscribe({
      error: (error: Error) => console.error(error.message)
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  removeItem(itemId: number) {
    const subscription = this.cartService.removeFromCart(itemId).subscribe({
      error: (error: Error) => console.error(error.message)
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  goToShop() {
    this.router.navigate(['/shop']);
  }
}