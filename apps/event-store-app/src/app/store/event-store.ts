import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Post, FilterParams } from '@angular-state-comparison/types';
import { filterPosts } from '@angular-state-comparison/utils';

export interface PostState {
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

export type PostEvent =
  | { type: 'LOAD_POSTS_START' }
  | { type: 'LOAD_POSTS_SUCCESS'; payload: Post[] }
  | { type: 'LOAD_POSTS_ERROR'; payload: string }
  | { type: 'CREATE_POST_START' }
  | { type: 'CREATE_POST_SUCCESS'; payload: Post }
  | { type: 'CREATE_POST_ERROR'; payload: string }
  | { type: 'UPDATE_POST_START' }
  | { type: 'UPDATE_POST_SUCCESS'; payload: Post }
  | { type: 'UPDATE_POST_ERROR'; payload: string }
  | { type: 'DELETE_POST_START' }
  | { type: 'DELETE_POST_SUCCESS'; payload: number }
  | { type: 'DELETE_POST_ERROR'; payload: string }
  | { type: 'SET_FILTERS'; payload: FilterParams }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_LIMIT'; payload: number };

@Injectable({ providedIn: 'root' })
export class EventStore {
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

  private stateSubject = new Subject<PostState>();
  private currentState: PostState = { ...this.initialState };
  private eventSubject = new Subject<PostEvent>();

  state$: Observable<PostState> = this.stateSubject.asObservable();
  events$: Observable<PostEvent> = this.eventSubject.asObservable();

  constructor() {
    this.events$.subscribe((event) => this.handleEvent(event));
  }

  dispatch(event: PostEvent): void {
    this.eventSubject.next(event);
  }

  private handleEvent(event: PostEvent): void {
    switch (event.type) {
      case 'LOAD_POSTS_START':
        this.currentState = { ...this.currentState, loading: true, error: null };
        break;
      case 'LOAD_POSTS_SUCCESS':
        this.currentState = {
          ...this.currentState,
          posts: event.payload,
          loading: false,
        };
        this.applyFilters();
        break;
      case 'LOAD_POSTS_ERROR':
        this.currentState = {
          ...this.currentState,
          error: event.payload,
          loading: false,
        };
        break;
      case 'CREATE_POST_SUCCESS':
        this.currentState = {
          ...this.currentState,
          posts: [event.payload, ...this.currentState.posts],
          loading: false,
        };
        this.applyFilters();
        break;
      case 'UPDATE_POST_SUCCESS':
        this.currentState = {
          ...this.currentState,
          posts: this.currentState.posts.map((p) =>
            p.id === event.payload.id ? event.payload : p
          ),
          loading: false,
        };
        this.applyFilters();
        break;
      case 'DELETE_POST_SUCCESS':
        this.currentState = {
          ...this.currentState,
          posts: this.currentState.posts.filter((p) => p.id !== event.payload),
          loading: false,
        };
        this.applyFilters();
        break;
      case 'SET_FILTERS':
        this.currentState = {
          ...this.currentState,
          filters: { ...this.currentState.filters, ...event.payload },
          pagination: { ...this.currentState.pagination, page: 1 },
        };
        this.applyFilters();
        break;
      case 'SET_PAGE':
        this.currentState = {
          ...this.currentState,
          pagination: { ...this.currentState.pagination, page: event.payload },
        };
        break;
      case 'SET_LIMIT':
        const totalPages = Math.ceil(
          this.currentState.filteredPosts.length / event.payload
        );
        this.currentState = {
          ...this.currentState,
          pagination: {
            ...this.currentState.pagination,
            limit: event.payload,
            page: 1,
            totalPages,
          },
        };
        break;
      case 'CREATE_POST_START':
      case 'UPDATE_POST_START':
      case 'DELETE_POST_START':
        this.currentState = { ...this.currentState, loading: true, error: null };
        break;
      case 'CREATE_POST_ERROR':
      case 'UPDATE_POST_ERROR':
      case 'DELETE_POST_ERROR':
        this.currentState = {
          ...this.currentState,
          error: event.payload,
          loading: false,
        };
        break;
    }
    this.stateSubject.next({ ...this.currentState });
  }

  private applyFilters(): void {
    const filtered = filterPosts(
      this.currentState.posts,
      this.currentState.filters.search,
      this.currentState.filters.userId
    );
    const totalPages = Math.ceil(
      filtered.length / this.currentState.pagination.limit
    );
    this.currentState = {
      ...this.currentState,
      filteredPosts: filtered,
      pagination: {
        ...this.currentState.pagination,
        total: filtered.length,
        totalPages,
      },
    };
    this.stateSubject.next({ ...this.currentState });
  }
}

