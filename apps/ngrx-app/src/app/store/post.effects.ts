import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ApiService } from '@angular-state-comparison/services';
import * as PostActions from './post.actions';

@Injectable()
export class PostEffects {
  constructor(private actions$: Actions, private apiService: ApiService) {}

  loadPosts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostActions.loadPosts),
      switchMap(() =>
        this.apiService.getPosts({ _limit: 100 }).pipe(
          map((posts) => PostActions.loadPostsSuccess({ posts })),
          catchError((error) =>
            of(PostActions.loadPostsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  createPost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostActions.createPost),
      switchMap(({ post }) =>
        this.apiService.createPost(post).pipe(
          map((newPost) => PostActions.createPostSuccess({ post: newPost })),
          catchError((error) =>
            of(PostActions.createPostFailure({ error: error.message }))
          )
        )
      )
    )
  );

  updatePost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostActions.updatePost),
      switchMap(({ id, post }) =>
        this.apiService.updatePost(id, post).pipe(
          map((updatedPost) => PostActions.updatePostSuccess({ post: updatedPost })),
          catchError((error) =>
            of(PostActions.updatePostFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deletePost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostActions.deletePost),
      switchMap(({ id }) =>
        this.apiService.deletePost(id).pipe(
          map(() => PostActions.deletePostSuccess({ id })),
          catchError((error) =>
            of(PostActions.deletePostFailure({ error: error.message }))
          )
        )
      )
    )
  );
}

