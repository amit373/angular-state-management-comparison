import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { SelectComponent } from '../select/select.component';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, ButtonComponent, SelectComponent],
  templateUrl: './pagination.component.html',
  styles: [],
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() total = 0;
  @Input() limit = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 20, 50, 100];
  @Input() showPageSizeSelector = true;
  @Output() pageChange = new EventEmitter<number>();
  @Output() limitChange = new EventEmitter<number>();

  get startIndex(): number {
    return (this.currentPage - 1) * this.limit + 1;
  }

  get endIndex(): number {
    return Math.min(this.currentPage * this.limit, this.total);
  }

  get hasNext(): boolean {
    return this.currentPage < this.totalPages;
  }

  get hasPrev(): boolean {
    return this.currentPage > 1;
  }

  get visiblePages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(this.totalPages);
      } else if (this.currentPage >= this.totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = this.totalPages - 3; i <= this.totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = this.currentPage - 1; i <= this.currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(this.totalPages);
      }
    }
    
    return pages;
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  onFirst(): void {
    if (this.currentPage > 1) {
      this.onPageChange(1);
    }
  }

  onLast(): void {
    if (this.currentPage < this.totalPages) {
      this.onPageChange(this.totalPages);
    }
  }

  onPrevious(): void {
    if (this.hasPrev) {
      this.onPageChange(this.currentPage - 1);
    }
  }

  onNext(): void {
    if (this.hasNext) {
      this.onPageChange(this.currentPage + 1);
    }
  }

  getPageNumber(page: number | string): number {
    return typeof page === 'number' ? page : 1;
  }

  onLimitChange(newLimit: number | string): void {
    const limit = typeof newLimit === 'number' ? newLimit : Number(newLimit);
    if (limit > 0 && limit !== this.limit) {
      this.limitChange.emit(limit);
    }
  }

  get pageSizeOptionsFormatted(): Array<{ value: number; label: string }> {
    return this.pageSizeOptions.map(option => ({
      value: option,
      label: `${option} per page`
    }));
  }
}

