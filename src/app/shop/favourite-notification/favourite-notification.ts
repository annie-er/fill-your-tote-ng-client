import { Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-favourite-notification',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './favourite-notification.html',
  styleUrl: './favourite-notification.css',
})
export class FavouriteNotification {
  productName = input.required<string>();

  close = output<void>();
  viewFavourites = output<void>();

  onClose() { this.close.emit(); }
  onViewFavourites() { this.viewFavourites.emit(); }
}
