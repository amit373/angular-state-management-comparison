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
      localStorage.setItem('theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    });
  }

  toggle(): void {
    this.themeSignal.update((current) => (current === 'light' ? 'dark' : 'light'));
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.themeSignal.set(theme);
  }
}

