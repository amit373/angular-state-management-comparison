import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { postReducer } from './app/store/post.reducer';
import { PostEffects } from './app/store/post.effects';
import { themeReducer } from './app/store/theme.reducer';
import { toastReducer } from './app/store/toast.reducer';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideStore({
      posts: postReducer,
      theme: themeReducer,
      toasts: toastReducer,
    }),
    provideEffects([PostEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
    }),
  ],
}).catch((err) => console.error(err));

