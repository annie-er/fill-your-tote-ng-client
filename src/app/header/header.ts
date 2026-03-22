import { Component, HostListener, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  favouritesHover = false;
  cartHover = false;
  accountHover = false;

  isHidden = false;
  private lastScrollY = 0;

  @HostListener('window:scroll')
  onScroll() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
      // scrolling down and past 100px — hide header
      this.isHidden = true;
    } else {
      // scrolling up — show header
      this.isHidden = false;
    }

    this.lastScrollY = currentScrollY;
  }
}
