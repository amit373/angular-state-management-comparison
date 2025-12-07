import { Injectable, signal } from '@angular/core';
import { Toast } from '@angular-state-comparison/types';
import { generateId } from '@angular-state-comparison/utils';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(message: string, type: Toast['type'] = 'info', duration = 3000): void {
    const toast: Toast = {
      id: generateId(),
      message,
      type,
      duration,
    };

    this.toasts.update((toasts) => [...toasts, toast]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(toast.id);
      }, duration);
    }
  }

  remove(id: string): void {
    this.toasts.update((toasts) => toasts.filter((t) => t.id !== id));
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error', 5000);
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  warning(message: string): void {
    this.show(message, 'warning');
  }
}

