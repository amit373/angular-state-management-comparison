import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { PostListComponent } from './components/post-list/post-list.component';
import { ToastContainerComponent } from '@angular-state-comparison/ui';
import { ThemeState } from './store/theme.reducer';
import { ToastState } from './store/toast.reducer';
import { toggleTheme } from './store/theme.reducer';
import { loadPosts } from './store/post.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, PostListComponent, ToastContainerComponent],
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent implements OnInit {
  private store = inject(Store);
  theme$: Observable<ThemeState> = this.store.select('theme');
  toasts$: Observable<ToastState> = this.store.select('toasts');

  ngOnInit(): void {
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
    this.store.dispatch(loadPosts());
  }

  toggleTheme(): void {
    this.store.dispatch(toggleTheme());
    const currentTheme = document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}

