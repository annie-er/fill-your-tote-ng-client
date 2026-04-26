import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  createPaymentIntent() {
    return this.http.post<{ clientSecret: string }>(
      `${this.baseUrl}/payment/create-intent`,
      {}
    );
  }
}