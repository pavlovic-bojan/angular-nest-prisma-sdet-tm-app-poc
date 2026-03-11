import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/user.model';

// Hardcoded mock user
const MOCK_USER: User = {
  id: '1',
  name: 'Demo User',
  email: 'demo@example.com',
  role: 'admin',
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  readonly user = this.currentUser.asReadonly();
  readonly isLoggedIn = computed(() => this.currentUser() !== null);

  login(email: string, password: string): boolean {
    // Mock: accept demo@example.com / password123
    if (email === 'demo@example.com' && password === 'password123') {
      this.currentUser.set(MOCK_USER);
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser.set(null);
  }

  setUser(user: User | null): void {
    this.currentUser.set(user);
  }
}
