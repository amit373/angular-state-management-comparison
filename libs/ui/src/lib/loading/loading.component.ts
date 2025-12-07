import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center p-8">
      <div class="relative">
        <div
          class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary-600 dark:border-gray-700 dark:border-t-primary-500"
        ></div>
        @if (message) {
          <p class="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            {{ message }}
          </p>
        }
      </div>
    </div>
  `,
  styles: [],
})
export class LoadingComponent {
  @Input() message = '';
}

