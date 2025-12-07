import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
      [class]="buttonClasses"
      [title]="title"
      (click)="onClick.emit($event)"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: [],
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() title = '';
  @Output() onClick = new EventEmitter<MouseEvent>();

  get buttonClasses(): string {
    const base =
      'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md';
    const variants = {
      primary:
        'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 shadow-blue-500/20',
      secondary:
        'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 hover:from-gray-200 hover:to-gray-300 focus:ring-gray-400 dark:from-gray-700 dark:to-gray-800 dark:text-gray-100 dark:hover:from-gray-600 dark:hover:to-gray-700 border border-gray-300 dark:border-gray-600',
      danger:
        'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 dark:from-red-500 dark:to-red-600 dark:hover:from-red-600 dark:hover:to-red-700 shadow-red-500/20',
      ghost:
        'bg-transparent text-gray-700 hover:bg-gray-100/80 focus:ring-gray-400 dark:text-gray-300 dark:hover:bg-gray-800/80 border border-transparent hover:border-gray-200 dark:hover:border-gray-700',
    };
    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-5 py-2.5 text-base gap-2',
      lg: 'px-7 py-3.5 text-lg gap-2.5',
    };

    return `${base} ${variants[this.variant]} ${sizes[this.size]}`;
  }
}

