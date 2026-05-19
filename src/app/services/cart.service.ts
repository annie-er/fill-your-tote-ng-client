import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { CartItem, CartSummary } from '../models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl = environment.apiUrl;
  private httpClient = inject(HttpClient);

  private cartItems = signal<CartItem[]>([]);
  private cartSummary = signal<CartSummary>({ subtotal: 0, vatAmount: 0, total: 0 });

  loadedCartItems = this.cartItems.asReadonly();
  loadedCartSummary = this.cartSummary.asReadonly();

  loadCartItems(): Observable<CartItem[]> {
    return this.httpClient
      .get<CartItem[]>(`${this.baseUrl}/cart`)
      .pipe(
        tap({
          next: (items) => this.cartItems.set(items),
        }),
        catchError(() =>
          throwError(() => new Error('Something went wrong fetching cart items'))
        )
      );
  }

  loadCartSummary(): Observable<CartSummary> {
    return this.httpClient
      .get<CartSummary>(`${this.baseUrl}/cart/summary`)
      .pipe(
        tap({
          next: (summary) => this.cartSummary.set(summary),
        }),
        catchError(() =>
          throwError(() => new Error('Something went wrong fetching cart summary'))
        )
      );
  }

  addToCart(productId: number, quantity: number = 1): Observable<CartItem> {
    const prevItems = this.cartItems();

    // optimistic update — if item already exists, increment quantity locally
    const existingItem = prevItems.find(i => i.productId === productId.toString());
    if (existingItem) {
      this.cartItems.set(
        prevItems.map(i =>
          i.productId === productId.toString()
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      );
    }

    return this.httpClient
      .post<CartItem>(`${this.baseUrl}/cart/items`, { productId, quantity })
      .pipe(
        tap({
          next: () => this.loadCartItems().subscribe(),
        }),
        catchError(() => {
          // roll back to previous places if error occurs
          this.cartItems.set(prevItems);
          return throwError(() => new Error('Failed to add item to cart'));
        })
      );
  }

  updateCartItemQuantity(itemId: number, quantity: number): Observable<unknown> {
    const prevItems = this.cartItems();

    this.cartItems.set(
      prevItems.map(i => i.id === itemId ? { ...i, quantity } : i)
    );

    return this.httpClient
      .put(`${this.baseUrl}/cart/items/${itemId}`, { quantity })
      .pipe(
        // add tap to reload the summary after each quantity update, so that the summary is always up to date
        tap({
          next: () => this.loadCartSummary().subscribe(),
        }),
        catchError(() => {
          this.cartItems.set(prevItems);
          return throwError(() => new Error('Failed to update cart item quantity'));
        })
      );
  }

  removeFromCart(itemId: number): Observable<unknown> {
    const prevItems = this.cartItems();

    this.cartItems.set(prevItems.filter(i => i.id !== itemId));

    return this.httpClient
      .delete(`${this.baseUrl}/cart/items/${itemId}`)
      .pipe(
        tap({
          next: () => this.loadCartSummary().subscribe(),
        }),
        catchError(() => {
          this.cartItems.set(prevItems);
          return throwError(() => new Error('Failed to remove item from cart'));
        })
      );
  }

  clearCart(): Observable<unknown> {
    const prevItems = this.cartItems();

    // optimistic update
    this.cartItems.set([]);

    return this.httpClient
      .delete(`${this.baseUrl}/cart`)
      .pipe(
        catchError(() => {
          this.cartItems.set(prevItems);
          return throwError(() => new Error('Failed to clear cart'));
        })
      );
  }
}