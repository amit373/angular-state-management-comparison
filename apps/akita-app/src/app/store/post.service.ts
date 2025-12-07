import { Injectable } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { Post, FilterParams } from '@angular-state-comparison/types';
import { ApiService } from '@angular-state-comparison/services';
import { filterPosts } from '@angular-state-comparison/utils';
import { PostStore } from './post.store';
import { PostQuery } from './post.query';

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private store: PostStore, private query: PostQuery, private apiService: ApiService) {
    this.loadPosts();
  }

  loadPosts(): void {
    this.store.update({ loading: true, error: null });

    this.apiService
      .getPosts({ _limit: 100 })
      .pipe(
        catchError((error) => {
          this.store.update({
            error: error.message || 'Failed to load posts',
            loading: false,
          });
          return of([]);
        }),
        finalize(() => this.store.update({ loading: false }))
      )
      .subscribe((posts) => {
        this.store.set(posts);
        this.applyFilters();
      });
  }

  createPost(post: Omit<Post, 'id'>): void {
    this.store.update({ loading: true, error: null });

    this.apiService
      .createPost(post)
      .pipe(
        catchError((error) => {
          this.store.update({
            error: error.message || 'Failed to create post',
            loading: false,
          });
          return of(null);
        }),
        finalize(() => this.store.update({ loading: false }))
      )
      .subscribe((newPost) => {
        if (newPost) {
          this.store.add(newPost);
          this.applyFilters();
        }
      });
  }

  updatePost(id: number, post: Partial<Post>): void {
    this.store.update({ loading: true, error: null });

    this.apiService
      .updatePost(id, post)
      .pipe(
        catchError((error) => {
          this.store.update({
            error: error.message || 'Failed to update post',
            loading: false,
          });
          return of(null);
        }),
        finalize(() => this.store.update({ loading: false }))
      )
      .subscribe((updatedPost) => {
        if (updatedPost) {
          this.store.update(id, updatedPost);
          this.applyFilters();
        }
      });
  }

  deletePost(id: number): void {
    this.store.update({ loading: true, error: null });

    this.apiService
      .deletePost(id)
      .pipe(
        catchError((error) => {
          this.store.update({
            error: error.message || 'Failed to delete post',
            loading: false,
          });
          return of(null);
        }),
        finalize(() => this.store.update({ loading: false }))
      )
      .subscribe(() => {
        this.store.remove(id);
        this.applyFilters();
      });
  }

  setFilters(filters: FilterParams): void {
    this.store.update({
      filters: { ...this.store.getValue().filters, ...filters },
      pagination: { ...this.store.getValue().pagination, page: 1 },
    });
    this.applyFilters();
  }

  setPage(page: number): void {
    this.store.update({
      pagination: { ...this.store.getValue().pagination, page },
    });
  }

  setLimit(limit: number): void {
    const state = this.store.getValue();
    const totalPages = Math.ceil(state.filteredPosts.length / limit);
    this.store.update({
      pagination: {
        ...state.pagination,
        limit,
        page: 1,
        totalPages,
      },
    });
  }

  private applyFilters(): void {
    const state = this.store.getValue();
    // Get all entities from Akita EntityStore using the query
    const posts = this.query.getAll();
    const filtered = filterPosts(posts, state.filters.search, state.filters.userId);
    const { pagination } = state;
    const totalPages = Math.ceil(filtered.length / pagination.limit);

    this.store.update({
      filteredPosts: filtered,
      pagination: {
        ...pagination,
        total: filtered.length,
        totalPages,
      },
    });
  }
}

