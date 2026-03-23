import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { DrawingsService } from '../../services/drawings.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-drawing-detail',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './drawing-detail.html',
  styleUrl: './drawing-detail.css'
})
export class DrawingDetail {
  identifier = input.required<string>();
  private drawingsService = inject(DrawingsService);
  private router = inject(Router);

  allDrawings = this.drawingsService.getDrawingsSignal();

  // derives the current drawing from the identifier param
  drawing = computed(() =>
    this.allDrawings().find(d => d.slug === this.identifier() || String(d.id) === this.identifier())
  );

  currentIndex = computed(() =>
    this.allDrawings().findIndex(d => d.id === this.drawing()?.id)
  );

  get hasPrevious(): boolean {
    return this.currentIndex() > 0;
  }

  get hasNext(): boolean {
    return this.currentIndex() < this.allDrawings().length - 1;
  }

  navigate(direction: 'prev' | 'next') {
    const newIndex = direction === 'prev'
      ? this.currentIndex() - 1
      : this.currentIndex() + 1;
    const newDrawing = this.allDrawings()[newIndex];
    this.router.navigate(['/drawings', newDrawing.slug || newDrawing.id]);
  }

  goBack() {
    this.router.navigate(['/drawings']);
  }
}