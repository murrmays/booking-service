import { Component, signal } from '@angular/core';
import { User } from '../../domain/models/user';

@Component({
  selector: 'app-auth-service',
  imports: [],
  templateUrl: './auth-service.html',
  styleUrl: './auth-service.css',
})
export class AuthService {
  private readonly user_key = 'app-current-user';
  currentUser = signal<User | null>(null);

  constructor() {
    const lastUser = localStorage.getItem(this.user_key);
    if (lastUser) this.currentUser.set(JSON.parse(lastUser));
  }

  login(user: User) {
    localStorage.setItem(this.user_key, JSON.stringify(user));
    this.currentUser.set(user);
  }
  logout() {
    localStorage.removeItem(this.user_key);
    this.currentUser.set(null);
  }
  getCurrentUserId(): string | undefined {
    return this.currentUser()?.id;
  }
}
