import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';
import { User } from '@angular-state-comparison/types';
import { ApiService } from '@angular-state-comparison/services';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiService = inject(ApiService);
  private usersSubject = new BehaviorSubject<Map<number, User>>(new Map());
  users$ = this.usersSubject.asObservable();

  constructor() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.apiService.getUsers().pipe(
      catchError(() => of([]))
    ).subscribe((users) => {
      const usersMap = new Map<number, User>();
      users.forEach((user) => {
        usersMap.set(user.id, user);
      });
      this.apiService.cacheUsers(users);
      this.usersSubject.next(usersMap);
    });
  }

  getUser(id: number): User | undefined {
    return this.usersSubject.value.get(id);
  }

  getUserName(id: number): string {
    const user = this.getUser(id);
    return user ? user.name : `User ${id}`;
  }
}

