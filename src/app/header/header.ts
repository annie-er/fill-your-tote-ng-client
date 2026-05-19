import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private authService = inject(AuthService);
  private router = inject(Router);

  favouritesHover = false; // leave as plain properties as they're only ever set in the template, not in the typescript code
  cartHover = false;
  accountHover = false;
  showAccountPanel = signal(false);

  isAuthenticated = this.authService.isAuthenticated;
  currentUser = this.authService.currentUser;

  isHidden = signal(false);
  private lastScrollY = 0;

  @HostListener('window:scroll')
  onScroll() {
    const currentScrollY = window.scrollY;
    this.isHidden.set(currentScrollY > this.lastScrollY && currentScrollY > 100);
    this.lastScrollY = currentScrollY;
  }

  toggleAccountPanel() {
    this.showAccountPanel.set(!this.showAccountPanel());
  }

  closeAccountPanel() {
    this.showAccountPanel.set(false);
  }

  goTo(path: string) {
    this.showAccountPanel.set(false);
    this.router.navigate([path]);
  }

  scrollToContact() {
    if (this.router.url === '/') {
      // already on home page; scroll directly
      this.scrollToContactSection();
    } else {
      // navigate to home first, then scroll after navigation completes
      this.router.navigate(['/']).then(() => {
        setTimeout(() => this.scrollToContactSection(), 100);
      });
    }
  }

  private scrollToContactSection() {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
