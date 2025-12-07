import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  PostListViewComponent,
  SortEvent,
} from '@angular-state-comparison/ui';
import { Post } from '@angular-state-comparison/types';
import { PostState } from '../../store/post.reducer';
import * as PostActions from '../../store/post.actions';
import { showToast } from '../../store/toast.reducer';
import { debounce } from '@angular-state-comparison/utils';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    CommonModule,
    PostListViewComponent,
  ],
  template: `
    @if (postState$ | async; as state) {
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
  private store = inject(Store);
  postState$: Observable<PostState> = this.store.select('posts');

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
    this.store.dispatch(PostActions.setFilters({ filters: { search: term || undefined } }));
  }, 300);

  ngOnInit(): void {
    // Initialize user options
    this.userOptions = Array.from({ length: 10 }, (_, i) => ({
      value: i + 1,
      label: `User ${i + 1}`,
    }));
    this.userOptions.unshift({ value: 0, label: 'All Users' });
    this.filteredUserOptions = this.userOptions.filter((u) => u.value !== 0);

    this.postState$.subscribe((state) => {
      if (state.filters.search) {
        this.searchTerm = state.filters.search;
      }
      if (state.filters.userId) {
        this.selectedUserId = state.filters.userId;
      }
    });
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.debouncedSearch(term);
  }

  onUserIdChange(userId: string | number): void {
    this.selectedUserId = userId as number;
    this.store.dispatch(
      PostActions.setFilters({
        filters: { userId: userId ? (userId as number) : undefined },
      })
    );
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

  getPaginatedPosts(posts: Post[], pagination: PostState['pagination']): Post[] {
    const sorted = this.getSortedPosts(posts);
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    return sorted.slice(start, end);
  }

  changePage(page: number): void {
    this.store.dispatch(PostActions.setPage({ page }));
  }

  changeLimit(limit: number): void {
    this.store.dispatch(PostActions.setLimit({ limit }));
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
      this.store.dispatch(
        PostActions.updatePost({ id: this.editingPost.id, post: formValue })
      );
      this.store.dispatch(showToast({ message: 'Post updated successfully', toastType: 'success' }));
    } else {
      this.store.dispatch(PostActions.createPost({ post: formValue }));
      this.store.dispatch(showToast({ message: 'Post created successfully', toastType: 'success' }));
    }
    this.closeModal();
  }

  deletePost(id: number): void {
    this.postToDelete = id;
    this.isDeleteDialogOpen = true;
  }

  confirmDelete(): void {
    if (this.postToDelete !== null) {
      this.store.dispatch(PostActions.deletePost({ id: this.postToDelete }));
      this.store.dispatch(showToast({ message: 'Post deleted successfully', toastType: 'success' }));
      this.postToDelete = null;
    }
  }

  closeDeleteDialog(): void {
    this.isDeleteDialogOpen = false;
    this.postToDelete = null;
  }
}

