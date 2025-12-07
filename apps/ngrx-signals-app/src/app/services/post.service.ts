import { Injectable, inject, computed } from '@angular/core';
import { signalState, patchState } from '@ngrx/signals';
import { catchError, finalize, of } from 'rxjs';
import { Post, FilterParams } from '@angular-state-comparison/types';
import { ApiService } from '@angular-state-comparison/services';
import { filterPosts } from '@angular-state-comparison/utils';

interface PostState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  filters: FilterParams;
  pagination: {
    page: number;
    limit: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiService = inject(ApiService);

  // Initialize state using @ngrx/signals signalState
  private state = signalState<PostState>({
    posts: [],
    loading: false,
    error: null,
    filters: {},
    pagination: {
      page: 1,
      limit: 5,
    },
  });

  // Expose state signals
  posts = this.state.posts;
  loading = this.state.loading;
  error = this.state.error;
  filters = this.state.filters;
  pagination = this.state.pagination;

  // Computed signals for derived state
  filteredPosts = computed(() => {
    const posts = this.state.posts();
    const filters = this.state.filters();
    return filterPosts(posts, filters.search, filters.userId);
  });

  paginationInfo = computed(() => {
    const filtered = this.filteredPosts();
    const pagination = this.state.pagination();
    const total = filtered.length;
    const totalPages = Math.ceil(total / pagination.limit);
    return {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages,
    };
  });

  paginatedPosts = computed(() => {
    const filtered = this.filteredPosts();
    const pagination = this.state.pagination();
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    return filtered.slice(start, end);
  });

  constructor() {
    this.loadPosts();
  }

  loadPosts(): void {
    patchState(this.state, { loading: true, error: null });

    this.apiService
      .getPosts({ _limit: 100 })
      .pipe(
        catchError((err) => {
          patchState(this.state, {
            error: err.message || 'Failed to load posts',
            loading: false,
          });
          return of([]);
        }),
        finalize(() => patchState(this.state, { loading: false }))
      )
      .subscribe((posts) => {
        patchState(this.state, { posts });
      });
  }

  createPost(post: Omit<Post, 'id'>): void {
    patchState(this.state, { loading: true, error: null });

    this.apiService
      .createPost(post)
      .pipe(
        catchError((err) => {
          patchState(this.state, {
            error: err.message || 'Failed to create post',
            loading: false,
          });
          return of(null);
        }),
        finalize(() => patchState(this.state, { loading: false }))
      )
      .subscribe((newPost) => {
        if (newPost) {
          const currentPosts = this.state.posts();
          patchState(this.state, { posts: [newPost, ...currentPosts] });
        }
      });
  }

  updatePost(id: number, post: Partial<Post>): void {
    patchState(this.state, { loading: true, error: null });

    this.apiService
      .updatePost(id, post)
      .pipe(
        catchError((err) => {
          patchState(this.state, {
            error: err.message || 'Failed to update post',
            loading: false,
          });
          return of(null);
        }),
        finalize(() => patchState(this.state, { loading: false }))
      )
      .subscribe((updatedPost) => {
        if (updatedPost) {
          const currentPosts = this.state.posts();
          const updatedPosts = currentPosts.map((p) =>
            p.id === id ? updatedPost : p
          );
          patchState(this.state, { posts: updatedPosts });
        }
      });
  }

  deletePost(id: number): void {
    patchState(this.state, { loading: true, error: null });

    this.apiService
      .deletePost(id)
      .pipe(
        catchError((err) => {
          patchState(this.state, {
            error: err.message || 'Failed to delete post',
            loading: false,
          });
          return of(null);
        }),
        finalize(() => patchState(this.state, { loading: false }))
      )
      .subscribe(() => {
        const currentPosts = this.state.posts();
        const filteredPosts = currentPosts.filter((p) => p.id !== id);
        patchState(this.state, { posts: filteredPosts });
      });
  }

  setFilters(filters: FilterParams): void {
    const currentFilters = this.state.filters();
    patchState(this.state, {
      filters: { ...currentFilters, ...filters },
      pagination: { ...this.state.pagination(), page: 1 },
    });
  }

  setPage(page: number): void {
    patchState(this.state, {
      pagination: { ...this.state.pagination(), page },
    });
  }

  setLimit(limit: number): void {
    const filtered = this.filteredPosts();
    const totalPages = Math.ceil(filtered.length / limit);
    patchState(this.state, {
      pagination: {
        ...this.state.pagination(),
        limit,
        page: 1,
      },
    });
  }
}
