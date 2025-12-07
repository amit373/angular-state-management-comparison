import { createReducer, on } from '@ngrx/store';
import { Post, FilterParams } from '@angular-state-comparison/types';
import { filterPosts } from '@angular-state-comparison/utils';
import * as PostActions from './post.actions';

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

const initialState: PostState = {
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

function applyFilters(posts: Post[], filters: FilterParams): Post[] {
  return filterPosts(posts, filters.search, filters.userId);
}

export const postReducer = createReducer(
  initialState,
  on(PostActions.loadPosts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(PostActions.loadPostsSuccess, (state, { posts }) => {
    const filtered = applyFilters(posts, state.filters);
    const totalPages = Math.ceil(filtered.length / state.pagination.limit);
    return {
      ...state,
      posts,
      filteredPosts: filtered,
      loading: false,
      pagination: {
        ...state.pagination,
        total: filtered.length,
        totalPages,
      },
    };
  }),
  on(PostActions.loadPostsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(PostActions.createPostSuccess, (state, { post }) => {
    const posts = [post, ...state.posts];
    const filtered = applyFilters(posts, state.filters);
    const totalPages = Math.ceil(filtered.length / state.pagination.limit);
    return {
      ...state,
      posts,
      filteredPosts: filtered,
      pagination: {
        ...state.pagination,
        total: filtered.length,
        totalPages,
      },
    };
  }),
  on(PostActions.updatePostSuccess, (state, { post }) => {
    const posts = state.posts.map((p) => (p.id === post.id ? post : p));
    const filtered = applyFilters(posts, state.filters);
    return {
      ...state,
      posts,
      filteredPosts: filtered,
    };
  }),
  on(PostActions.deletePostSuccess, (state, { id }) => {
    const posts = state.posts.filter((p) => p.id !== id);
    const filtered = applyFilters(posts, state.filters);
    const totalPages = Math.ceil(filtered.length / state.pagination.limit);
    return {
      ...state,
      posts,
      filteredPosts: filtered,
      pagination: {
        ...state.pagination,
        total: filtered.length,
        totalPages,
      },
    };
  }),
  on(PostActions.setFilters, (state, { filters }) => {
    const newFilters = { ...state.filters, ...filters };
    const filtered = applyFilters(state.posts, newFilters);
    const totalPages = Math.ceil(filtered.length / state.pagination.limit);
    return {
      ...state,
      filters: newFilters,
      filteredPosts: filtered,
      pagination: {
        ...state.pagination,
        page: 1,
        total: filtered.length,
        totalPages,
      },
    };
  }),
  on(PostActions.setPage, (state, { page }) => ({
    ...state,
    pagination: {
      ...state.pagination,
      page,
    },
  })),
  on(PostActions.setLimit, (state, { limit }) => {
    const totalPages = Math.ceil(state.filteredPosts.length / limit);
    return {
      ...state,
      pagination: {
        ...state.pagination,
        limit,
        page: 1,
        totalPages,
      },
    };
  })
);

