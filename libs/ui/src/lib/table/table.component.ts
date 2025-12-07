import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SortEvent {
  column: number;
  direction: 'asc' | 'desc';
  field: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full rounded-xl border border-gray-200/60 dark:border-gray-700/60 shadow-sm">
      <table [class]="tableClasses" class="w-full table-auto">
        @if (headers && headers.length > 0) {
          <thead class="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <tr>
              @for (header of headers; track $index) {
                <th
                  [class]="getHeaderClasses($index)"
                  class="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700"
                >
                  <div class="flex items-center gap-2">
                    <span>{{ header }}</span>
                    @if (sortable && sortableFields && sortableFields[$index]) {
                      <button
                        (click)="onSort($index)"
                        class="flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        [title]="getSortTitle($index)"
                      >
                        <svg class="h-3 w-3" [class.text-blue-600]="sortColumn === $index && sortDirection === 'asc'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                        </svg>
                        <svg class="h-3 w-3 -mt-1" [class.text-blue-600]="sortColumn === $index && sortDirection === 'desc'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                      </button>
                    }
                  </div>
                </th>
              }
            </tr>
          </thead>
        }
        <tbody class="divide-y divide-gray-200/50 bg-white dark:divide-gray-700/50 dark:bg-gray-800">
          <ng-content></ng-content>
        </tbody>
      </table>
    </div>
  `,
  styles: [],
})
export class TableComponent {
  @Input() headers: string[] = [];
  @Input() striped = false;
  @Input() sortable = false;
  @Input() sortableFields: (string | null)[] = [];
  @Input() sortColumn: number | null = null;
  @Input() sortDirection: 'asc' | 'desc' = 'asc';
  @Output() sort = new EventEmitter<SortEvent>();

  get tableClasses(): string {
    const base = 'divide-y divide-gray-200/50 dark:divide-gray-700/50';
    const stripedClass = this.striped
      ? '[&>tbody>tr:nth-child(even)]:bg-gray-50/50 dark:[&>tbody>tr:nth-child(even)]:bg-gray-900/30'
      : '';
    return `${base} ${stripedClass}`;
  }

  getHeaderClasses(index: number): string {
    return '';
  }

  onSort(column: number): void {
    if (!this.sortable || !this.sortableFields[column]) return;
    
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.sort.emit({
      column,
      direction: this.sortDirection,
      field: this.sortableFields[column]!,
    });
  }

  getSortTitle(index: number): string {
    if (this.sortColumn === index) {
      return `Sorted ${this.sortDirection === 'asc' ? 'ascending' : 'descending'}. Click to ${this.sortDirection === 'asc' ? 'sort descending' : 'remove sort'}`;
    }
    return 'Click to sort ascending';
  }
}

