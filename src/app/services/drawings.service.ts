import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { environment } from '../../environments/environment';
import { Drawing } from '../models/drawing.model';

@Injectable({
  providedIn: 'root'
})
export class DrawingsService {
  private baseUrl = environment.apiUrl;
  private httpClient = inject(HttpClient);

  private drawingsSignal = toSignal(
    this.httpClient.get<Drawing[]>(`${this.baseUrl}/drawings`).pipe(shareReplay(1)),
    { initialValue: [] as Drawing[] }
  );

  getDrawingsSignal() {
    return this.drawingsSignal;
  }

  getDrawings(): Observable<Drawing[]> {
    return this.httpClient.get<Drawing[]>(`${this.baseUrl}/drawings`).pipe(shareReplay(1));
  }

  getDrawing(identifier: string): Observable<Drawing> {
    return this.httpClient.get<Drawing>(`${this.baseUrl}/drawings/${identifier}`);
  }
}