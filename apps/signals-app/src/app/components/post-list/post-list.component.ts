import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { ToastService } from '../../services/toast.service';
import {
  PostListViewComponent,
  SortEvent,
} from '@angular-state-comparison/ui';
import { Post } from '@angular-state-comparison/types';
import { debounce } from '@angular-state-comparison/utils';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [
    CommonModule,
    PostListViewComponent,
  ],
  template: `
    <app-post-list-view
      [state]="{
        loading: postService.loading(),
        error: postService.error(),
        filteredPosts: postService.filteredPosts(),
        pagination: postService.pagination()
      }"
      [isLoading]="false"
      [searchTerm]="searchTerm()"
      [selectedUserId]="selectedUserId()"
      [userOptions]="userOptions"
      [filteredUserOptions]="filteredUserOptions"
      [sortColumn]="sortColumn()"
      [sortDirection]="sortDirection()"
      [paginatedPosts]="getPaginatedPosts(postService.filteredPosts(), postService.pagination())"
      [isModalOpen]="isModalOpen()"
      [isEditing]="isEditing()"
      [editingPost]="editingPost()"
      [isDeleteDialogOpen]="isDeleteDialogOpen()"
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
  `,
  styles: [],
})
export class PostListComponent implements OnInit {
  postService = inject(PostService);
  toastService = inject(ToastService);

  searchTerm = signal('');
  selectedUserId = signal<number | ''>('');
  isModalOpen = signal(false);
  isEditing = signal(false);
  editingPost = signal<Post | null>(null);
  isDeleteDialogOpen = signal(false);
  postToDelete = signal<number | null>(null);
  sortColumn = signal<number | null>(null);
  sortDirection = signal<'asc' | 'desc'>('asc');

  userOptions: Array<{ value: number; label: string }> = [];
  filteredUserOptions: Array<{ value: number; label: string }> = [];

  private debouncedSearch = debounce((term: string) => {
    this.postService.setFilters({ search: term || undefined });
  }, 300);

  ngOnInit(): void {
    // Initialize user options
    this.userOptions = Array.from({ length: 10 }, (_, i) => ({
      value: i + 1,
      label: `User ${i + 1}`,
    }));
    this.userOptions.unshift({ value: 0, label: 'All Users' });
    this.filteredUserOptions = this.userOptions.filter((u) => u.value !== 0);

    // Initialize search term from service
    const filters = this.postService.filters();
    if (filters.search) {
      this.searchTerm.set(filters.search);
    }
    if (filters.userId) {
      this.selectedUserId.set(filters.userId);
    }
  }

  getUserName(userId: number): string {
    return `User ${userId}`;
  }

  onSort(event: SortEvent): void {
    this.sortColumn.set(event.column);
    this.sortDirection.set(event.direction);
  }

  getSortedPosts(posts: Post[]): Post[] {
    const sortCol = this.sortColumn();
    if (sortCol === null) return posts;

    const sorted = [...posts];
    const field = ['id', 'userId', 'title', 'body'][sortCol];
    const direction = this.sortDirection();

    sorted.sort((a, b) => {
      let aVal: string | number = a[field as keyof Post] as string | number;
      let bVal: string | number = b[field as keyof Post] as string | number;

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }

  getPaginatedPosts(posts: Post[], pagination: { page: number; limit: number }): Post[] {
    const sorted = this.getSortedPosts(posts);
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    return sorted.slice(start, end);
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.debouncedSearch(term);
  }

  onUserIdChange(userId: string | number): void {
    this.selectedUserId.set(userId as number);
    this.postService.setFilters({
      userId: userId ? (userId as number) : undefined,
    });
  }

  changePage(page: number): void {
    this.postService.setPage(page);
  }

  changeLimit(limit: number): void {
    this.postService.setLimit(limit);
  }

  openCreateModal(): void {
    this.isEditing.set(false);
    this.editingPost.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(post: Post): void {
    this.isEditing.set(true);
    this.editingPost.set(post);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.isEditing.set(false);
    this.editingPost.set(null);
  }

  onSavePost(formValue: { title: string; body: string; userId: number }): void {
    if (this.isEditing() && this.editingPost()) {
      this.postService.updatePost(this.editingPost()!.id, formValue);
      this.toastService.success('Post updated successfully');
    } else {
      this.postService.createPost(formValue);
      this.toastService.success('Post created successfully');
    }
    this.closeModal();
  }

  deletePost(id: number): void {
    this.postToDelete.set(id);
    this.isDeleteDialogOpen.set(true);
  }

  confirmDelete(): void {
    const id = this.postToDelete();
    if (id !== null) {
      this.postService.deletePost(id);
      this.toastService.success('Post deleted successfully');
      this.postToDelete.set(null);
    }
  }

  closeDeleteDialog(): void {
    this.isDeleteDialogOpen.set(false);
    this.postToDelete.set(null);
  }
}

