import { Injectable, signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, finalize, of } from 'rxjs';
import { Post, FilterParams } from '@angular-state-comparison/types';
import { ApiService } from '@angular-state-comparison/services';
import { filterPosts } from '@angular-state-comparison/utils';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiService = inject(ApiService);

  // Signals for state
  posts = signal<Post[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  filters = signal<FilterParams>({});
  page = signal<number>(1);
  limit = signal<number>(5);

  // Computed signals
  filteredPosts = computed(() => {
    return filterPosts(this.posts(), this.filters().search, this.filters().userId);
  });

  pagination = computed(() => {
    const filtered = this.filteredPosts();
    const total = filtered.length;
    const totalPages = Math.ceil(total / this.limit());
    return {
      page: this.page(),
      limit: this.limit(),
      total,
      totalPages,
    };
  });

  paginatedPosts = computed(() => {
    const filtered = this.filteredPosts();
    const start = (this.page() - 1) * this.limit();
    const end = start + this.limit();
    return filtered.slice(start, end);
  });

  constructor() {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.apiService
      .getPosts({ _limit: 100 })
      .pipe(
        catchError((err) => {
          this.error.set(err.message || 'Failed to load posts');
          return of([]);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe((posts) => {
        this.posts.set(posts);
      });
  }

  createPost(post: Omit<Post, 'id'>): void {
    this.loading.set(true);
    this.error.set(null);

    this.apiService
      .createPost(post)
      .pipe(
        catchError((err) => {
          this.error.set(err.message || 'Failed to create post');
          return of(null);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe((newPost) => {
        if (newPost) {
          this.posts.update((posts) => [newPost, ...posts]);
        }
      });
  }

  updatePost(id: number, post: Partial<Post>): void {
    this.loading.set(true);
    this.error.set(null);

    this.apiService
      .updatePost(id, post)
      .pipe(
        catchError((err) => {
          this.error.set(err.message || 'Failed to update post');
          return of(null);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe((updatedPost) => {
        if (updatedPost) {
          this.posts.update((posts) =>
            posts.map((p) => (p.id === id ? updatedPost : p))
          );
        }
      });
  }

  deletePost(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.apiService
      .deletePost(id)
      .pipe(
        catchError((err) => {
          this.error.set(err.message || 'Failed to delete post');
          return of(null);
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe(() => {
        this.posts.update((posts) => posts.filter((p) => p.id !== id));
      });
  }

  setFilters(filters: FilterParams): void {
    this.filters.update((current) => ({ ...current, ...filters }));
    this.page.set(1);
  }

  setPage(page: number): void {
    this.page.set(page);
  }

  setLimit(limit: number): void {
    this.limit.set(limit);
    this.page.set(1);
  }
}

