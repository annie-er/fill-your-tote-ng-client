import { Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-cart-notification',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './cart-notification.html',
  styleUrl: './cart-notification.css',
})
export class CartNotification {
  productName = input.required<string>();
  quantity = input.required<number>();

  close = output<void>();
  viewCart = output<void>();

  onClose() { this.close.emit(); }
  onViewCart() { this.viewCart.emit(); }
}
