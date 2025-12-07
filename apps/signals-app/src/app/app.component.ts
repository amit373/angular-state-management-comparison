import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from './services/theme.service';
import { ToastService } from './services/toast.service';
import { PostListComponent } from './components/post-list/post-list.component';
import { ToastContainerComponent } from '@angular-state-comparison/ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, PostListComponent, ToastContainerComponent],
  templateUrl: './app.component.html',
  styles: [],
})
export class AppComponent {
  themeService = inject(ThemeService);
  toastService = inject(ToastService);
}

