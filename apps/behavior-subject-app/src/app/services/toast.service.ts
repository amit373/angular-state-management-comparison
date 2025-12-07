import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Toast } from '@angular-state-comparison/types';
import { generateId } from '@angular-state-comparison/utils';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toasts$: Observable<Toast[]> = this.toastsSubject.asObservable();

  show(message: string, type: Toast['type'] = 'info', duration = 3000): void {
    const toast: Toast = {
      id: generateId(),
      message,
      type,
      duration,
    };

    const toasts = [...this.toastsSubject.value, toast];
    this.toastsSubject.next(toasts);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(toast.id);
      }, duration);
    }
  }

  remove(id: string): void {
    const toasts = this.toastsSubject.value.filter((t) => t.id !== id);
    this.toastsSubject.next(toasts);
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

