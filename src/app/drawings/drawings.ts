import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Drawing } from '../models/drawing.model';
import { DrawingsService } from '../services/drawings.service';

@Component({
  selector: 'app-drawings',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './drawings.html',
  styleUrl: './drawings.css',
})
export class Drawings implements OnInit {
  drawings = signal<Drawing[]>([]);
  isFetching = signal(false);
  error = signal('');

  private drawingsService = inject(DrawingsService);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.drawingsService.getDrawings().subscribe({
      next: (drawings) => {
        this.drawings.set(drawings);
      },
      error: (error: Error) => {
        this.error.set(error.message || 'Failed to load drawings');
        this.isFetching.set(false);
      },
      complete: () => {
        this.isFetching.set(false);
      }
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
