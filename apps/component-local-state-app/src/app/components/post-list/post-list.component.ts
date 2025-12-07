import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, catchError, combineLatest, finalize, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '@angular-state-comparison/services';
import { ToastService } from '../../services/toast.service';
import {
  PostListViewComponent,
  SortEvent,
} from '@angular-state-comparison/ui';
import { Post, FilterParams } from '@angular-state-comparison/types';
import { debounce, filterPosts } from '@angular-state-comparison/utils';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    CommonModule,
    PostListViewComponent,
  ],
  template: `
    @if (state$ | async; as state) {
      <app-post-list-view
        [state]="{
          loading: state.loading,
          error: state.error,
          filteredPosts: state.filteredPosts,
          pagination: state.pagination
        }"
        [isLoading]="false"
        [searchTerm]="searchTerm"
        [selectedUserId]="selectedUserId"
        [userOptions]="userOptions"
        [filteredUserOptions]="filteredUserOptions"
        [sortColumn]="sortColumn"
        [sortDirection]="sortDirection"
        [paginatedPosts]="getPaginatedPosts(state.filteredPosts, state.pagination)"
        [isModalOpen]="isModalOpen"
        [isEditing]="isEditing"
        [editingPost]="editingPost"
        [isDeleteDialogOpen]="isDeleteDialogOpen"
        [getUserName]="getUserName.bind(this)"
        (onCreateClick)="openCreateModal()"
        (onSearchChange)="onSearchChange($event)"
        (onUserIdChange)="onUserIdChange($event)"
        (onSort)="onSort($event)"
        (onPageChange)="changePage($event)"
        (onLimitChange)="changeLimit($event)"
        (onEditClick)="openEditModal($event)"
        (onDeleteClick)="deletePost($event)"
        (onModalClose)="closeModal()"
        (onSavePost)="onSavePost($event)"
        (onConfirmDelete)="confirmDelete()"
        (onDeleteDialogClose)="closeDeleteDialog()"
      />
    }
  `,
  styles: [],
})
export class PostListComponent implements OnInit {
  private apiService = inject(ApiService);
  toastService = inject(ToastService);

  // Local state using BehaviorSubject
  private postsSubject = new BehaviorSubject<Post[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  private filtersSubject = new BehaviorSubject<FilterParams>({});
  private pageSubject = new BehaviorSubject<number>(1);

  posts$ = this.postsSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();
  filters$ = this.filtersSubject.asObservable();
  page$ = this.pageSubject.asObservable();

  // Computed state
  filteredPosts$ = new BehaviorSubject<Post[]>([]);
  pagination$ = new BehaviorSubject({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
  });

  state$ = combineLatest([
    this.loading$,
    this.error$,
    this.filteredPosts$.asObservable(),
    this.pagination$.asObservable(),
  ]).pipe(
    map(([loading, error, filteredPosts, pagination]) => ({
      loading,
      error,
      filteredPosts,
      pagination,
    }))
  );

  searchTerm = '';
  selectedUserId: number | '' = '';
  isModalOpen = false;
  isEditing = false;
  editingPost: Post | null = null;
  isDeleteDialogOpen = false;
  postToDelete: number | null = null;
  sortColumn: number | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  userOptions: Array<{ value: number; label: string }> = [];
  filteredUserOptions: Array<{ value: number; label: string }> = [];

  private debouncedSearch = debounce((term: string) => {
    this.filtersSubject.next({ ...this.filtersSubject.value, search: term || undefined });
    this.applyFilters();
  }, 300);

  ngOnInit(): void {
    // Initialize user options
    this.userOptions = Array.from({ length: 10 }, (_, i) => ({
      value: i + 1,
      label: `User ${i + 1}`,
    }));
    this.userOptions.unshift({ value: 0, label: 'All Users' });
    this.filteredUserOptions = this.userOptions.filter((u) => u.value !== 0);
    this.loadPosts();
    // Update filtered posts when posts or filters change
    this.posts$.subscribe(() => this.applyFilters());
    this.filters$.subscribe(() => this.applyFilters());
    this.page$.subscribe(() => this.updatePagination());
  }

  loadPosts(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.apiService
      .getPosts({ _limit: 100 })
      .pipe(
        catchError((error: unknown) => {
          const errorMessage = error instanceof Error ? error.message : 'Failed to load posts';
          this.errorSubject.next(errorMessage);
          return of([]);
        }),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((posts: Post[]) => {
        this.postsSubject.next(posts);
      });
  }

  createPost(post: Omit<Post, 'id'>): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.apiService
      .createPost(post)
      .pipe(
        catchError((error: unknown) => {
          const errorMessage = error instanceof Error ? error.message : 'Failed to create post';
          this.errorSubject.next(errorMessage);
          return of(null);
        }),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((newPost: Post | null) => {
        if (newPost) {
          this.postsSubject.next([newPost, ...this.postsSubject.value]);
          this.toastService.success('Post created successfully');
        }
      });
  }

  updatePost(id: number, post: Partial<Post>): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.apiService
      .updatePost(id, post)
      .pipe(
        catchError((error: unknown) => {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update post';
          this.errorSubject.next(errorMessage);
          return of(null);
        }),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((updatedPost: Post | null) => {
        if (updatedPost) {
          const posts = this.postsSubject.value.map((p) =>
            p.id === id ? updatedPost : p
          );
          this.postsSubject.next(posts);
          this.toastService.success('Post updated successfully');
        }
      });
  }

  deletePost(id: number): void {
    this.postToDelete = id;
    this.isDeleteDialogOpen = true;
  }

  confirmDelete(): void {
    if (this.postToDelete === null) return;

    const id = this.postToDelete;
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.apiService
      .deletePost(id)
      .pipe(
        catchError((error: unknown) => {
          const errorMessage = error instanceof Error ? error.message : 'Failed to delete post';
          this.errorSubject.next(errorMessage);
          return of(null);
        }),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(() => {
        const posts = this.postsSubject.value.filter((p) => p.id !== id);
        this.postsSubject.next(posts);
        this.toastService.success('Post deleted successfully');
        this.postToDelete = null;
      });
  }

  closeDeleteDialog(): void {
    this.isDeleteDialogOpen = false;
    this.postToDelete = null;
  }

  private applyFilters(): void {
    const posts = this.postsSubject.value;
    const filters = this.filtersSubject.value;
    const filtered = filterPosts(posts, filters.search, filters.userId);
    this.filteredPosts$.next(filtered);
    this.updatePagination();
  }

  private updatePagination(): void {
    const filtered = this.filteredPosts$.value;
    const page = this.pageSubject.value;
    const limit = this.pagination$.value.limit;
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    this.pagination$.next({ page, limit, total, totalPages });
  }

  getUserName(userId: number): string {
    return `User ${userId}`;
  }

  onSort(event: SortEvent): void {
    this.sortColumn = event.column;
    this.sortDirection = event.direction;
  }

  getSortedPosts(posts: Post[]): Post[] {
    if (this.sortColumn === null) return posts;

    const sorted = [...posts];
    const field = ['id', 'userId', 'title', 'body'][this.sortColumn];

    sorted.sort((a, b) => {
      let aVal: string | number = a[field as keyof Post] as string | number;
      let bVal: string | number = b[field as keyof Post] as string | number;

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.debouncedSearch(term);
  }

  onUserIdChange(userId: string | number): void {
    this.selectedUserId = userId as number;
    this.filtersSubject.next({
      ...this.filtersSubject.value,
      userId: userId ? (userId as number) : undefined,
    });
    this.pageSubject.next(1);
    this.applyFilters();
  }

  getPaginatedPosts(posts: Post[], pagination: { page: number; limit: number }): Post[] {
    const sorted = this.getSortedPosts(posts);
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    return sorted.slice(start, end);
  }

  changePage(page: number): void {
    this.pageSubject.next(page);
  }

  changeLimit(limit: number): void {
    this.pagination$.next({
      ...this.pagination$.value,
      limit,
      page: 1,
      totalPages: Math.ceil(this.filteredPosts$.value.length / limit),
    });
    this.pageSubject.next(1);
  }

  openCreateModal(): void {
    this.isEditing = false;
    this.editingPost = null;
    this.isModalOpen = true;
  }

  openEditModal(post: Post): void {
    this.isEditing = true;
    this.editingPost = post;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isEditing = false;
    this.editingPost = null;
  }

  onSavePost(formValue: { title: string; body: string; userId: number }): void {
    if (this.isEditing && this.editingPost) {
      this.updatePost(this.editingPost.id, formValue);
    } else {
      this.createPost(formValue);
    }
    this.closeModal();
  }
}

