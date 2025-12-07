import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Toast } from '@angular-state-comparison/types';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, ToastComponent],
  template: `
    <div class="fixed top-4 right-4 z-50 w-full max-w-sm">
      @for (toast of toasts; track toast.id) {
        <app-toast [toast]="toast" />
      }
    </div>
  `,
  styles: [],
})
export class ToastContainerComponent {
  @Input() toasts: Toast[] = [];
}

