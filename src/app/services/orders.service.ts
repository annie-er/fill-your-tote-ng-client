
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private baseUrl = environment.apiUrl;
  private httpClient = inject(HttpClient);

  private orders = signal<Order[]>([]);
  loadedOrders = this.orders.asReadonly();

  loadOrders(): Observable<Order[]> {
    return this.httpClient
      .get<Order[]>(`${this.baseUrl}/orders`)
      .pipe(
        tap({
          next: (orders) => this.orders.set(orders),
        }),
        catchError(() =>
          throwError(() => new Error('Something went wrong fetching orders'))
        )
      );
  }
}