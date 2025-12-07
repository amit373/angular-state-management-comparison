import { createReducer, on } from '@ngrx/store';
import { createAction, props } from '@ngrx/store';
import { Toast } from '@angular-state-comparison/types';
import { generateId } from '@angular-state-comparison/utils';

export const showToast = createAction(
  '[Toast] Show',
  props<{ message: string; toastType: Toast['type']; duration?: number }>()
);
export const removeToast = createAction('[Toast] Remove', props<{ id: string }>());

export interface ToastState {
  toasts: Toast[];
}

const initialState: ToastState = {
  toasts: [],
};

export const toastReducer = createReducer(
  initialState,
  on(showToast, (state, { message, toastType, duration = 3000 }) => {
    const toast: Toast = {
      id: generateId(),
      message,
      type: toastType,
      duration,
    };
    return {
      ...state,
      toasts: [...state.toasts, toast],
    };
  }),
  on(removeToast, (state, { id }) => ({
    ...state,
    toasts: state.toasts.filter((t) => t.id !== id),
  }))
);

