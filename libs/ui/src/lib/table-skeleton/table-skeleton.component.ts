import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonComponent } from '../skeleton/skeleton.component';

@Component({
  selector: 'app-table-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonComponent],
  templateUrl: './table-skeleton.component.html',
  styles: [],
})
export class TableSkeletonComponent {
  @Input() rows = 5;
  @Input() columns = 5;
}

