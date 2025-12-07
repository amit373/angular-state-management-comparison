import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { InputComponent } from '../input/input.component';
import { SelectComponent } from '../select/select.component';
import { ButtonComponent } from '../button/button.component';
import { Post } from '@angular-state-comparison/types';

@Component({
  selector: 'app-post-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    InputComponent,
    SelectComponent,
    ButtonComponent,
  ],
  template: `
    <app-modal
      [isOpen]="isOpen"
      [title]="modalTitle"
      (close)="onClose()"
    >
      <form [formGroup]="postForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <div class="space-y-5">
          <app-input
            id="title"
            label="Title"
            [value]="postForm.get('title')?.value || ''"
            [error]="getFieldError('title')"
            (valueChange)="onTitleChange($event)"
            (onBlur)="onTitleBlur()"
          />
          <app-input
            id="body"
            label="Body"
            [value]="postForm.get('body')?.value || ''"
            [error]="getFieldError('body')"
            (valueChange)="onBodyChange($event)"
            (onBlur)="onBodyBlur()"
          />
          <app-select
            id="userId"
            label="User"
            [value]="postForm.get('userId')?.value || 1"
            [options]="userOptions"
            [error]="getFieldError('userId')"
            (valueChange)="onUserIdChange($event)"
            (onBlur)="onUserIdBlur()"
          />
        </div>
        <div footer class="flex items-center justify-end gap-3">
          <app-button variant="secondary" (onClick)="onClose()" type="button" size="md">
            Cancel
          </app-button>
          <app-button type="submit" size="md" [disabled]="postForm.invalid">
            Save
          </app-button>
        </div>
      </form>
    </app-modal>
  `,
  styles: [],
})
export class PostFormModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() isEditing = false;
  @Input() post: Post | null = null;
  @Input() userOptions: Array<{ value: number; label: string }> = [];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{ title: string; body: string; userId: number }>();

  private fb = inject(FormBuilder);

  postForm: FormGroup;

  constructor() {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      body: ['', [Validators.required, Validators.minLength(10)]],
      userId: [1, [Validators.required, Validators.min(1)]],
    });
  }

  get modalTitle(): string {
    return this.isEditing ? 'Edit Post' : 'Create Post';
  }

  ngOnInit(): void {
    if (this.post && this.isEditing) {
      this.postForm.patchValue({
        title: this.post.title,
        body: this.post.body,
        userId: this.post.userId,
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Only update form when modal opens
    if (changes['isOpen'] && changes['isOpen'].currentValue && !changes['isOpen'].previousValue) {
      if (this.isEditing && this.post) {
        this.postForm.patchValue({
          title: this.post.title,
          body: this.post.body,
          userId: this.post.userId,
        });
        this.postForm.markAsUntouched();
      } else {
        this.postForm.reset({
          title: '',
          body: '',
          userId: 1,
        });
        this.postForm.markAsUntouched();
      }
    } else if (changes['post'] && this.post && this.isEditing && this.isOpen) {
      // Update form when post changes while editing
      this.postForm.patchValue({
        title: this.post.title,
        body: this.post.body,
        userId: this.post.userId,
      });
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.postForm.get(controlName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    if (control.errors['required']) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
    }

    if (control.errors['minlength']) {
      const required = control.errors['minlength'].requiredLength;
      const actual = control.errors['minlength'].actualLength;
      const remaining = required - actual;
      return `${remaining} more character${remaining !== 1 ? 's' : ''} required`;
    }

    if (control.errors['min']) {
      return 'Please select a valid user';
    }

    return '';
  }

  getFieldError(controlName: string): string {
    return this.getErrorMessage(controlName);
  }

  onTitleChange(value: string): void {
    this.postForm.patchValue({ title: value }, { emitEvent: false });
    this.postForm.get('title')?.updateValueAndValidity();
  }

  onTitleBlur(): void {
    this.postForm.get('title')?.markAsTouched();
  }

  onBodyChange(value: string): void {
    this.postForm.patchValue({ body: value }, { emitEvent: false });
    this.postForm.get('body')?.updateValueAndValidity();
  }

  onBodyBlur(): void {
    this.postForm.get('body')?.markAsTouched();
  }

  onUserIdChange(value: string | number): void {
    this.postForm.patchValue({ userId: +value }, { emitEvent: false });
    this.postForm.get('userId')?.updateValueAndValidity();
  }

  onUserIdBlur(): void {
    this.postForm.get('userId')?.markAsTouched();
  }

  onSubmit(): void {
    this.postForm.markAllAsTouched();

    if (this.postForm.invalid) {
      return;
    }

    this.save.emit(this.postForm.value);
  }

  onClose(): void {
    this.postForm.reset({
      title: '',
      body: '',
      userId: 1,
    });
    this.close.emit();
  }
}

