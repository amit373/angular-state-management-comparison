import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { PostStore, PostState } from './post.store';
import { Post } from '@angular-state-comparison/types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PostQuery extends QueryEntity<PostState, Post> {
  constructor(protected override store: PostStore) {
    super(store);
  }

  selectLoading$: Observable<boolean> = this.select((state) => state.loading);
  selectError$: Observable<string | null> = this.select((state) => state.error);
  selectFilteredPosts$: Observable<Post[]> = this.select((state) => state.filteredPosts);
  selectPagination$ = this.select((state) => state.pagination);
  selectFilters$ = this.select((state) => state.filters);
}

