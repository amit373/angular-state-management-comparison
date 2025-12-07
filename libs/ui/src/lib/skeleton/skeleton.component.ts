import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton.component.html',
  styles: [],
})
export class SkeletonComponent {
  @Input() type: 'text' | 'circle' | 'rect' = 'text';
  @Input() width = '100%';
  @Input() height = '1rem';
  @Input() lines = 1;

  get skeletonClasses(): string {
    const base = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';
    const types = {
      text: '',
      circle: 'rounded-full',
      rect: 'rounded-lg',
    };
    return `${base} ${types[this.type]}`;
  }
}

