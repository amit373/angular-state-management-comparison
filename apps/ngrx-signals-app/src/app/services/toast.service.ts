import { Injectable, signal } from '@angular/core';
import { Toast } from '@angular-state-comparison/types';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    const toast: Toast = {
      id: Date.now().toString(),
      message,
      type,
    };
    this.toasts.update((toasts) => [...toasts, toast]);
    setTimeout(() => this.remove(toast.id), 3000);
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  info(message: string): void {
    this.show(message, 'info');
  }

  remove(id: string): void {
    this.toasts.update((toasts) => toasts.filter((t) => t.id !== id));
  }
}
