import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="w-full">
      @if (label) {
        <label
          [for]="id"
          class="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {{ label }}
        </label>
      }
      <input
        [id]="id"
        [type]="type"
        [placeholder]="placeholder"
        [value]="value"
        [disabled]="disabled"
        [class]="inputClasses"
        (input)="onInput($event)"
        (blur)="onBlur.emit($event)"
      />
      @if (error) {
        <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ error }}</p>
      }
    </div>
  `,
  styles: [],
})
export class InputComponent {
  @Input() id = '';
  @Input() label = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' = 'text';
  @Input() placeholder = '';
  @Input() value = '';
  @Input() disabled = false;
  @Input() error = '';
  @Output() valueChange = new EventEmitter<string>();
  @Output() onBlur = new EventEmitter<Event>();

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }

  get inputClasses(): string {
    const base =
      'block w-full rounded-xl border-2 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-100 disabled:cursor-not-allowed dark:disabled:bg-gray-800 shadow-sm focus:shadow-md';
    const padding = 'px-4';
    const normal =
      'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400/20 hover:border-gray-400 dark:hover:border-gray-500';
    const error =
      'border-red-500 bg-white text-gray-900 focus:border-red-500 focus:ring-red-500/20 dark:border-red-400 dark:bg-gray-700 dark:text-white dark:focus:ring-red-400/20';

    return `${base} ${padding} ${this.error ? error : normal}`;
  }
}

