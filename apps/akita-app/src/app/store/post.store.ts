import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Post, FilterParams } from '@angular-state-comparison/types';

export interface PostState extends EntityState<Post> {
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

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'posts' })
export class PostStore extends EntityStore<PostState, Post> {
  constructor() {
    super({
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
    });
  }
}

