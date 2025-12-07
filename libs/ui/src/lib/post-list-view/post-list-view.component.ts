import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { CardComponent } from '../card/card.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { InputComponent } from '../input/input.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { PostFormModalComponent } from '../post-form-modal/post-form-modal.component';
import { SelectComponent } from '../select/select.component';
import { TableComponent, SortEvent } from '../table/table.component';
import { TableSkeletonComponent } from '../table-skeleton/table-skeleton.component';
import { Post } from '@angular-state-comparison/types';

export interface PostListState {
  loading: boolean;
  error: string | null;
  filteredPosts: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Component({
  selector: 'app-post-list-view',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    CardComponent,
    ConfirmDialogComponent,
    InputComponent,
    PaginationComponent,
    PostFormModalComponent,
    SelectComponent,
    TableComponent,
    TableSkeletonComponent,
  ],
  template: `
    <app-card>
      <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Posts</h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your posts with ease</p>
        </div>
        <app-button (onClick)="onCreateClick.emit()">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          <span class="hidden sm:inline">Create Post</span>
        </app-button>
      </div>

      <div class="mb-6 flex gap-4 items-center">
        <div class="relative flex-1 top-[10px]">
          <app-input
            id="search"
            placeholder="Search posts..."
            [value]="searchTerm"
            (valueChange)="onSearchChange.emit($event)"
            class="!pr-10"
          />
          <div class="absolute right-3 z-10 pointer-events-none" style="top: 1.375rem; transform: translateY(-50%);">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
        <div class="w-48 flex-shrink-0">
          <app-select
            id="userId"
            placeholder="Filter by User"
            [value]="selectedUserId"
            [options]="userOptions"
            (valueChange)="onUserIdChange.emit($event)"
          />
        </div>
      </div>

      @if (state.loading || isLoading) {
        <app-table-skeleton [rows]="5" [columns]="5" />
      } @else if (state.error) {
        <div class="rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-400">
          {{ state.error }}
        </div>
      } @else {
        <app-table
          [headers]="['ID', 'User', 'Title', 'Body', 'Actions']"
          [striped]="true"
          [sortable]="true"
          [sortableFields]="['id', 'userId', 'title', 'body', null]"
          [sortColumn]="sortColumn"
          [sortDirection]="sortDirection"
          (sort)="onSort.emit($event)"
        >
          @for (
            post of paginatedPosts;
            track post.id
          ) {
            <tr class="transition-all duration-150 hover:bg-gray-50/80 dark:hover:bg-gray-700/50 hover:shadow-sm">
              <td class="px-4 py-4 text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
                #{{ post.id }}
              </td>
              <td class="px-4 py-4 whitespace-nowrap">
                <span class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  {{ getUserName(post.userId) }}
                </span>
              </td>
              <td class="px-4 py-4 text-sm font-semibold text-gray-900 dark:text-white max-w-[200px]">
                <div class="truncate" [title]="post.title">{{ post.title }}</div>
              </td>
              <td class="px-4 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-[300px]">
                <div class="truncate" [title]="post.body">{{ post.body | slice : 0 : 50 }}...</div>
              </td>
              <td class="px-4 py-4 text-sm whitespace-nowrap">
                <div class="flex flex-wrap gap-2">
                  <app-button
                    variant="secondary"
                    size="sm"
                    (onClick)="onEditClick.emit(post)"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    <span class="hidden sm:inline">Edit</span>
                  </app-button>
                  <app-button
                    variant="danger"
                    size="sm"
                    (onClick)="onDeleteClick.emit(post.id)"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    <span class="hidden sm:inline">Delete</span>
                  </app-button>
                </div>
              </td>
            </tr>
          }
        </app-table>

        <app-pagination
          [currentPage]="state.pagination.page"
          [totalPages]="state.pagination.totalPages"
          [total]="state.pagination.total"
          [limit]="state.pagination.limit"
          (pageChange)="onPageChange.emit($event)"
          (limitChange)="onLimitChange.emit($event)"
        />
      }
    </app-card>

    <app-post-form-modal
      [isOpen]="isModalOpen"
      [isEditing]="isEditing"
      [post]="editingPost"
      [userOptions]="filteredUserOptions"
      (close)="onModalClose.emit()"
      (save)="onSavePost.emit($event)"
    />

    <app-confirm-dialog
      [isOpen]="isDeleteDialogOpen"
      title="Delete Post"
      message="Are you sure you want to delete this post? This action cannot be undone."
      confirmText="Delete"
      cancelText="Cancel"
      variant="danger"
      (confirm)="onConfirmDelete.emit()"
      (close)="onDeleteDialogClose.emit()"
    />
  `,
  styles: [],
})
export class PostListViewComponent {
  @Input() state!: PostListState;
  @Input() isLoading = false;
  @Input() searchTerm = '';
  @Input() selectedUserId: number | '' = '';
  @Input() userOptions: Array<{ value: number; label: string }> = [];
  @Input() filteredUserOptions: Array<{ value: number; label: string }> = [];
  @Input() sortColumn: number | null = null;
  @Input() sortDirection: 'asc' | 'desc' = 'asc';
  @Input() paginatedPosts: Post[] = [];
  @Input() isModalOpen = false;
  @Input() isEditing = false;
  @Input() editingPost: Post | null = null;
  @Input() isDeleteDialogOpen = false;
  @Input() getUserName: (userId: number) => string = (userId: number) => `User ${userId}`;

  @Output() onCreateClick = new EventEmitter<void>();
  @Output() onSearchChange = new EventEmitter<string>();
  @Output() onUserIdChange = new EventEmitter<string | number>();
  @Output() onSort = new EventEmitter<SortEvent>();
  @Output() onPageChange = new EventEmitter<number>();
  @Output() onLimitChange = new EventEmitter<number>();
  @Output() onEditClick = new EventEmitter<Post>();
  @Output() onDeleteClick = new EventEmitter<number>();
  @Output() onModalClose = new EventEmitter<void>();
  @Output() onSavePost = new EventEmitter<{ title: string; body: string; userId: number }>();
  @Output() onConfirmDelete = new EventEmitter<void>();
  @Output() onDeleteDialogClose = new EventEmitter<void>();
}

