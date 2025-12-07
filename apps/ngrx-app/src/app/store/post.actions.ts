import { createAction, props } from '@ngrx/store';
import { Post, FilterParams } from '@angular-state-comparison/types';

export const loadPosts = createAction('[Post] Load Posts');
export const loadPostsSuccess = createAction(
  '[Post] Load Posts Success',
  props<{ posts: Post[] }>()
);
export const loadPostsFailure = createAction(
  '[Post] Load Posts Failure',
  props<{ error: string }>()
);

export const createPost = createAction(
  '[Post] Create Post',
  props<{ post: Omit<Post, 'id'> }>()
);
export const createPostSuccess = createAction(
  '[Post] Create Post Success',
  props<{ post: Post }>()
);
export const createPostFailure = createAction(
  '[Post] Create Post Failure',
  props<{ error: string }>()
);

export const updatePost = createAction(
  '[Post] Update Post',
  props<{ id: number; post: Partial<Post> }>()
);
export const updatePostSuccess = createAction(
  '[Post] Update Post Success',
  props<{ post: Post }>()
);
export const updatePostFailure = createAction(
  '[Post] Update Post Failure',
  props<{ error: string }>()
);

export const deletePost = createAction(
  '[Post] Delete Post',
  props<{ id: number }>()
);
export const deletePostSuccess = createAction(
  '[Post] Delete Post Success',
  props<{ id: number }>()
);
export const deletePostFailure = createAction(
  '[Post] Delete Post Failure',
  props<{ error: string }>()
);

export const setFilters = createAction(
  '[Post] Set Filters',
  props<{ filters: FilterParams }>()
);

export const setPage = createAction(
  '[Post] Set Page',
  props<{ page: number }>()
);

export const setLimit = createAction(
  '[Post] Set Limit',
  props<{ limit: number }>()
);

