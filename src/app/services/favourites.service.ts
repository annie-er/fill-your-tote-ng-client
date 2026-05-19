import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { FavouriteItem } from '../models/favourite.model';

@Injectable({
  providedIn: 'root',
})
export class FavouritesService {
  private baseUrl = environment.apiUrl;
  private httpClient = inject(HttpClient);

  private favouriteItems = signal<FavouriteItem[]>([]);

  loadedFavouriteItems = this.favouriteItems.asReadonly();

  loadFavouriteItems(): Observable<FavouriteItem[]> {
    return this.httpClient
      .get<FavouriteItem[]>(`${this.baseUrl}/favourites`)
      .pipe(
        tap({
          next: (items) => this.favouriteItems.set(items),
        }),
        catchError(() =>
          throwError(() => new Error('Something went wrong fetching favourite items'))
        )
      );
  }

  addToFavourites(productId: number): Observable<FavouriteItem> {
    const prevItems = this.favouriteItems();

    return this.httpClient
      .post<FavouriteItem>(`${this.baseUrl}/favourites/items`, { productId })
      .pipe(
        tap({
          next: () => this.loadFavouriteItems().subscribe(),
        }),
        catchError(() => {
          this.favouriteItems.set(prevItems);
          return throwError(() => new Error('Failed to add item to favourites'));
        })
      );
  }

  removeFromFavourites(itemId: number): Observable<unknown> {
    const prevItems = this.favouriteItems();

    this.favouriteItems.set(prevItems.filter(i => i.id !== itemId));

    return this.httpClient
      .delete(`${this.baseUrl}/favourites/items/${itemId}`)
      .pipe(
        catchError(() => {
          this.favouriteItems.set(prevItems);
          return throwError(() => new Error('Failed to remove item from favourites'));
        })
      );
  }

  clearFavourites(): Observable<unknown> {
    const prevItems = this.favouriteItems();

    this.favouriteItems.set([]);

    return this.httpClient
      .delete(`${this.baseUrl}/favourites`)
      .pipe(
        catchError(() => {
          this.favouriteItems.set(prevItems);
          return throwError(() => new Error('Failed to clear favourites'));
        })
      );
  }
}