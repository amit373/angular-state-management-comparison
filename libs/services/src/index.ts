import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post, User } from '@angular-state-comparison/types';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com';
  private usersCache: Map<number, User> = new Map();

  constructor(private http: HttpClient) {}

  getPosts(params?: { _page?: number; _limit?: number }): Observable<Post[]> {
    let httpParams = new HttpParams();
    if (params?._page) {
      httpParams = httpParams.set('_page', params._page.toString());
    }
    if (params?._limit) {
      httpParams = httpParams.set('_limit', params._limit.toString());
    }
    return this.http.get<Post[]>(`${this.baseUrl}/posts`, { params: httpParams });
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}/posts/${id}`);
  }

  createPost(post: Omit<Post, 'id'>): Observable<Post> {
    return this.http.post<Post>(`${this.baseUrl}/posts`, post);
  }

  updatePost(id: number, post: Partial<Post>): Observable<Post> {
    return this.http.put<Post>(`${this.baseUrl}/posts/${id}`, post);
  }

  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/posts/${id}`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  getUser(id: number): Observable<User> {
    if (this.usersCache.has(id)) {
      return new Observable((observer) => {
        observer.next(this.usersCache.get(id)!);
        observer.complete();
      });
    }
    return this.http.get<User>(`${this.baseUrl}/users/${id}`);
  }

  cacheUsers(users: User[]): void {
    users.forEach((user) => {
      this.usersCache.set(user.id, user);
    });
  }

  getCachedUser(id: number): User | undefined {
    return this.usersCache.get(id);
  }
}

