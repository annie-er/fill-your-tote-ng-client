import { Component, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-auth-notification',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './auth-notification.html',
  styleUrl: './auth-notification.css'
})
export class AuthNotification {
  close = output<void>();
  viewAuth = output<void>();

  onClose() { this.close.emit(); }
  onViewAuth() { this.viewAuth.emit(); }
}