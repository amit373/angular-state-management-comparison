import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() showFooter = true;
  @Input() closeOnBackdrop = true;
  @Output() close = new EventEmitter<void>();

  @ViewChild('modalDialog', { static: false }) modalDialog?: ElementRef<HTMLElement>;

  isClosing = false;
  private scrollbarWidth = 0;
  private previousBodyOverflow = '';
  private previousBodyPaddingRight = '';
  private focusableElements: HTMLElement[] = [];
  private firstFocusableElement?: HTMLElement;
  private lastFocusableElement?: HTMLElement;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      const wasOpen = changes['isOpen'].previousValue;
      const isNowOpen = changes['isOpen'].currentValue;

      if (isNowOpen && !wasOpen) {
        this.openModal();
      } else if (!isNowOpen && wasOpen) {
        this.startClosingAnimation();
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.isOpen) {
      this.openModal();
    }
  }

  ngOnDestroy(): void {
    this.restoreBodyScroll();
  }

  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (!this.isOpen) return;

    // Close on Escape key
    if (event.key === 'Escape') {
      this.onClose();
      return;
    }

    // Focus trap - Tab navigation
    if (event.key === 'Tab') {
      this.handleTabNavigation(event);
    }
  }

  private openModal(): void {
    this.isClosing = false;
    this.lockBodyScroll();
    // Small delay to ensure DOM is ready for focus trap
    setTimeout(() => {
      this.setupFocusTrap();
      this.focusFirstElement();
    }, 100);
  }

  private startClosingAnimation(): void {
    if (!this.isClosing) {
      this.isClosing = true;
      // Wait for exit animation to complete before restoring scroll
      setTimeout(() => {
        this.restoreBodyScroll();
        this.isClosing = false;
      }, 300);
    }
  }

  onClose(): void {
    this.startClosingAnimation();
    // Small delay to allow animation to start before emitting close
    setTimeout(() => {
      this.close.emit();
    }, 50);
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop) {
      this.onClose();
    }
  }

  private lockBodyScroll(): void {
    const body = document.body;
    this.previousBodyOverflow = body.style.overflow;
    this.previousBodyPaddingRight = body.style.paddingRight;

    // Calculate scrollbar width
    this.scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Apply styles
    body.style.overflow = 'hidden';
    if (this.scrollbarWidth > 0) {
      body.style.paddingRight = `${this.scrollbarWidth}px`;
    }
    body.classList.add('modal-open');
  }

  private restoreBodyScroll(): void {
    const body = document.body;
    body.style.overflow = this.previousBodyOverflow;
    body.style.paddingRight = this.previousBodyPaddingRight;
    body.classList.remove('modal-open');
  }

  private setupFocusTrap(): void {
    if (!this.modalDialog?.nativeElement) return;

    const modal = this.modalDialog.nativeElement;
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    this.focusableElements = Array.from(
      modal.querySelectorAll<HTMLElement>(focusableSelectors)
    ).filter((el) => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });

    if (this.focusableElements.length > 0) {
      this.firstFocusableElement = this.focusableElements[0];
      this.lastFocusableElement = this.focusableElements[this.focusableElements.length - 1];
    }
  }

  private handleTabNavigation(event: KeyboardEvent): void {
    if (this.focusableElements.length === 0) return;

    const currentFocus = document.activeElement as HTMLElement;

    if (event.shiftKey) {
      // Shift + Tab
      if (currentFocus === this.firstFocusableElement) {
        event.preventDefault();
        this.lastFocusableElement?.focus();
      }
    } else {
      // Tab
      if (currentFocus === this.lastFocusableElement) {
        event.preventDefault();
        this.firstFocusableElement?.focus();
      }
    }
  }

  private focusFirstElement(): void {
    // Focus the first focusable element or the modal dialog itself
    if (this.firstFocusableElement) {
      this.firstFocusableElement.focus();
    } else if (this.modalDialog?.nativeElement) {
      this.modalDialog.nativeElement.focus();
    }
  }
}

