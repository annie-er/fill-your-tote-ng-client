import { Component, DestroyRef, inject } from '@angular/core';
import { OrdersService } from '../services/orders.service';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-orders',
  imports: [DatePipe],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
  standalone: true,
})
export class Orders {
  private ordersService = inject(OrdersService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  loadedOrders = this.ordersService.loadedOrders;
  isAuthenticated = this.authService.isAuthenticated;
  
  ngOnInit() {
    if (!this.authService.isAuthenticated()) return;

    const subscription = this.ordersService.loadOrders().subscribe({
      error: (error: Error) => console.error(error.message)
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  onViewAuth() {
    this.router.navigate(['/login']);
  }

  goToShop() {
    this.router.navigate(['/shop']);
  }
}
