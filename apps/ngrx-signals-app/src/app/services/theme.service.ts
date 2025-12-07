import { Injectable, signal, computed, effect } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeSignal = signal<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );

  theme = computed(() => this.themeSignal());

  constructor() {
    effect(() => {
      const theme = this.themeSignal();
      document.documentElement.classList.toggle('dark', theme === 'dark');
      localStorage.setItem('theme', theme);
    });
  }

  init(): void {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') {
      this.themeSignal.set(stored);
    }
  }

  toggle(): void {
    this.themeSignal.update((current) => (current === 'light' ? 'dark' : 'light'));
  }

  set(theme: 'light' | 'dark'): void {
    this.themeSignal.set(theme);
  }
}

