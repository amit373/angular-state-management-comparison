import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="cardClasses">
      <ng-content></ng-content>
    </div>
  `,
  styles: [],
})
export class CardComponent {
  @Input() padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
  @Input() shadow: 'none' | 'sm' | 'md' | 'lg' = 'md';

  get cardClasses(): string {
    const base =
      'bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/60 dark:border-gray-700/60 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-600';
    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };
    const shadows = {
      none: '',
      sm: 'shadow-sm hover:shadow-md',
      md: 'shadow-lg hover:shadow-xl',
      lg: 'shadow-xl hover:shadow-2xl',
    };

    return `${base} ${paddings[this.padding]} ${shadows[this.shadow]}`;
  }
}

