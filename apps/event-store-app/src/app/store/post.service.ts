import { Injectable } from '@angular/core';
import { catchError, finalize, of } from 'rxjs';
import { Post } from '@angular-state-comparison/types';
import { ApiService } from '@angular-state-comparison/services';
import { EventStore } from './event-store';

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private store: EventStore, private apiService: ApiService) {
    this.loadPosts();
  }

  loadPosts(): void {
    this.store.dispatch({ type: 'LOAD_POSTS_START' });

    this.apiService
      .getPosts({ _limit: 100 })
      .pipe(
        catchError((error) => {
          this.store.dispatch({
            type: 'LOAD_POSTS_ERROR',
            payload: error.message || 'Failed to load posts',
          });
          return of([]);
        })
      )
      .subscribe((posts) => {
        this.store.dispatch({ type: 'LOAD_POSTS_SUCCESS', payload: posts });
      });
  }

  createPost(post: Omit<Post, 'id'>): void {
    this.store.dispatch({ type: 'CREATE_POST_START' });

    this.apiService
      .createPost(post)
      .pipe(
        catchError((error) => {
          this.store.dispatch({
            type: 'CREATE_POST_ERROR',
            payload: error.message || 'Failed to create post',
          });
          return of(null);
        })
      )
      .subscribe((newPost) => {
        if (newPost) {
          this.store.dispatch({ type: 'CREATE_POST_SUCCESS', payload: newPost });
        }
      });
  }

  updatePost(id: number, post: Partial<Post>): void {
    this.store.dispatch({ type: 'UPDATE_POST_START' });

    this.apiService
      .updatePost(id, post)
      .pipe(
        catchError((error) => {
          this.store.dispatch({
            type: 'UPDATE_POST_ERROR',
            payload: error.message || 'Failed to update post',
          });
          return of(null);
        })
      )
      .subscribe((updatedPost) => {
        if (updatedPost) {
          this.store.dispatch({ type: 'UPDATE_POST_SUCCESS', payload: updatedPost });
        }
      });
  }

  deletePost(id: number): void {
    this.store.dispatch({ type: 'DELETE_POST_START' });

    this.apiService
      .deletePost(id)
      .pipe(
        catchError((error) => {
          this.store.dispatch({
            type: 'DELETE_POST_ERROR',
            payload: error.message || 'Failed to delete post',
          });
          return of(null);
        })
      )
      .subscribe(() => {
        this.store.dispatch({ type: 'DELETE_POST_SUCCESS', payload: id });
      });
  }

  setFilters(filters: { search?: string; userId?: number }): void {
    this.store.dispatch({ type: 'SET_FILTERS', payload: filters });
  }

  setPage(page: number): void {
    this.store.dispatch({ type: 'SET_PAGE', payload: page });
  }

  setLimit(limit: number): void {
    this.store.dispatch({ type: 'SET_LIMIT', payload: limit });
  }
}

