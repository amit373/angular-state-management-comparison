import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select',
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
      <div class="relative">
        <select
          [id]="id"
          [value]="value"
          [disabled]="disabled"
          [class]="selectClasses"
          (change)="onChange($event)"
          (blur)="onBlur.emit($event)"
        >
        @if (placeholder) {
          <option value="">{{ placeholder }}</option>
        }
        @for (option of options; track getOptionValue(option)) {
          <option [value]="getOptionValue(option)">
            {{ getOptionLabel(option) }}
          </option>
        }
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
      </div>
      @if (error) {
        <p class="mt-1 text-sm text-red-600 dark:text-red-400">{{ error }}</p>
      }
    </div>
  `,
  styles: [],
})
export class SelectComponent {
  @Input() id = '';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() value: string | number = '';
  @Input() disabled = false;
  @Input() error = '';
  @Input() options: Array<string | { value: string | number; label: string }> = [];
  @Output() valueChange = new EventEmitter<string | number>();
  @Output() onBlur = new EventEmitter<Event>();

  onChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const value = this.options.some((opt) => typeof opt === 'object')
      ? Number.isNaN(Number(target.value))
        ? target.value
        : Number(target.value)
      : target.value;
    this.valueChange.emit(value);
  }

  getOptionValue(option: string | { value: string | number; label: string }): string | number {
    return typeof option === 'string' ? option : option.value;
  }

  getOptionLabel(option: string | { value: string | number; label: string }): string {
    return typeof option === 'string' ? option : option.label;
  }

  get selectClasses(): string {
    const base =
      'block w-full rounded-xl border-2 py-3 pl-4 pr-10 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-100 disabled:cursor-not-allowed dark:disabled:bg-gray-800 shadow-sm focus:shadow-md appearance-none';
    const normal =
      'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400/20 hover:border-gray-400 dark:hover:border-gray-500';
    const error =
      'border-red-500 bg-white text-gray-900 focus:border-red-500 focus:ring-red-500/20 dark:border-red-400 dark:bg-gray-700 dark:text-white dark:focus:ring-red-400/20';

    return `${base} ${this.error ? error : normal}`;
  }
}

