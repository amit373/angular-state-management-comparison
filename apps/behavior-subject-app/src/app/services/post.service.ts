import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, finalize, of } from 'rxjs';
import { Post, FilterParams, PaginationParams } from '@angular-state-comparison/types';
import { ApiService } from '@angular-state-comparison/services';
import { filterPosts } from '@angular-state-comparison/utils';

interface PostState {
  posts: Post[];
  filteredPosts: Post[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: FilterParams;
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private initialState: PostState = {
    posts: [],
    filteredPosts: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 5,
      total: 0,
      totalPages: 0,
    },
    filters: {},
  };

  private stateSubject = new BehaviorSubject<PostState>(this.initialState);
  state$: Observable<PostState> = this.stateSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadPosts();
  }

  loadPosts(): void {
    this.updateState({ loading: true, error: null });

    this.apiService
      .getPosts({ _page: this.stateSubject.value.pagination.page, _limit: 100 })
      .pipe(
        catchError((error) => {
          this.updateState({ error: error.message || 'Failed to load posts', loading: false });
          return of([]);
        }),
        finalize(() => this.updateState({ loading: false }))
      )
      .subscribe((posts) => {
        this.updateState({
          posts,
          pagination: {
            ...this.stateSubject.value.pagination,
            total: posts.length,
            totalPages: Math.ceil(posts.length / this.stateSubject.value.pagination.limit),
          },
        });
        this.applyFilters();
      });
  }

  createPost(post: Omit<Post, 'id'>): void {
    this.updateState({ loading: true, error: null });

    this.apiService
      .createPost(post)
      .pipe(
        catchError((error) => {
          this.updateState({ error: error.message || 'Failed to create post', loading: false });
          return of(null);
        }),
        finalize(() => this.updateState({ loading: false }))
      )
      .subscribe((newPost) => {
        if (newPost) {
          const posts = [newPost, ...this.stateSubject.value.posts];
          this.updateState({ posts });
          this.applyFilters();
        }
      });
  }

  updatePost(id: number, post: Partial<Post>): void {
    this.updateState({ loading: true, error: null });

    this.apiService
      .updatePost(id, post)
      .pipe(
        catchError((error) => {
          this.updateState({ error: error.message || 'Failed to update post', loading: false });
          return of(null);
        }),
        finalize(() => this.updateState({ loading: false }))
      )
      .subscribe((updatedPost) => {
        if (updatedPost) {
          const posts = this.stateSubject.value.posts.map((p) =>
            p.id === id ? updatedPost : p
          );
          this.updateState({ posts });
          this.applyFilters();
        }
      });
  }

  deletePost(id: number): void {
    this.updateState({ loading: true, error: null });

    this.apiService
      .deletePost(id)
      .pipe(
        catchError((error) => {
          this.updateState({ error: error.message || 'Failed to delete post', loading: false });
          return of(null);
        }),
        finalize(() => this.updateState({ loading: false }))
      )
      .subscribe(() => {
        const posts = this.stateSubject.value.posts.filter((p) => p.id !== id);
        this.updateState({ posts });
        this.applyFilters();
      });
  }

  setFilters(filters: FilterParams): void {
    this.updateState({
      filters: { ...this.stateSubject.value.filters, ...filters },
      pagination: { ...this.stateSubject.value.pagination, page: 1 },
    });
    this.applyFilters();
  }

  setPage(page: number): void {
    this.updateState({
      pagination: { ...this.stateSubject.value.pagination, page },
    });
  }

  setLimit(limit: number): void {
    this.updateState({
      pagination: { ...this.stateSubject.value.pagination, page: 1, limit },
    });
    this.applyFilters();
  }

  private applyFilters(): void {
    const { posts, filters } = this.stateSubject.value;
    const filtered = filterPosts(posts, filters.search, filters.userId);
    const { pagination } = this.stateSubject.value;
    const totalPages = Math.ceil(filtered.length / pagination.limit);

    this.updateState({
      filteredPosts: filtered,
      pagination: {
        ...pagination,
        total: filtered.length,
        totalPages,
      },
    });
  }

  private updateState(partial: Partial<PostState>): void {
    this.stateSubject.next({
      ...this.stateSubject.value,
      ...partial,
    });
  }
}

