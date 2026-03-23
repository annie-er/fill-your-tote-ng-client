import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../../environments/environment.development';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  private baseUrl = environment.apiUrl;
  private httpClient = inject(HttpClient);

  private shopSignal = toSignal(
    this.httpClient.get<Product[]>(`${this.baseUrl}/products`).pipe(shareReplay(1)),
    { initialValue: [] as Product[] }
  );

  getProductsSignal() {
    return this.shopSignal;
  }

  getProducts(): Observable<Product[]> {
    return this.httpClient.get<Product[]>(`${this.baseUrl}/products`).pipe(shareReplay(1));
  }

  getProduct(identifier: string): Observable<Product> {
    return this.httpClient.get<Product>(`${this.baseUrl}/products/${identifier}`);
  }
}