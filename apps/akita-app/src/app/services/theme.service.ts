import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeSubject = new BehaviorSubject<'light' | 'dark'>('light');
  theme$: Observable<'light' | 'dark'> = this.themeSubject.asObservable();

  init(): void {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    this.setTheme(theme);
  }

  toggle(): void {
    const current = this.themeSubject.value;
    this.setTheme(current === 'light' ? 'dark' : 'light');
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.themeSubject.next(theme);
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}

