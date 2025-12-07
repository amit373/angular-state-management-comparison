import { createReducer, on } from '@ngrx/store';
import { createAction, props } from '@ngrx/store';

export const toggleTheme = createAction('[Theme] Toggle');
export const setTheme = createAction(
  '[Theme] Set',
  props<{ theme: 'light' | 'dark' }>()
);

export interface ThemeState {
  theme: 'light' | 'dark';
}

const getInitialTheme = (): 'light' | 'dark' => {
  const stored = localStorage.getItem('theme');
  return stored === 'light' || stored === 'dark' ? stored : 'light';
};

const initialState: ThemeState = {
  theme: getInitialTheme(),
};

export const themeReducer = createReducer(
  initialState,
  on(toggleTheme, (state) => {
    const newTheme: 'light' | 'dark' = state.theme === 'light' ? 'dark' : 'light';
    return {
      ...state,
      theme: newTheme,
    };
  }),
  on(setTheme, (state, action) => {
    const theme: 'light' | 'dark' = action.theme === 'light' || action.theme === 'dark' ? action.theme : state.theme;
    return {
      ...state,
      theme,
    };
  })
);
